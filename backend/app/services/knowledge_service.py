import hashlib
import json
import math
import os
import re
import sqlite3

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.core.config import settings


# =========================================================
# PATH BACKEND
# =========================================================

BACKEND_DIR = Path(
    __file__
).resolve().parents[2]

KNOWLEDGE_DIR = (
    BACKEND_DIR / "knowledge"
)


load_dotenv(
    BACKEND_DIR / ".env"
)


# =========================================================
# DATABASE PATH
# =========================================================

def get_database_path() -> Path:
    """
    Mengambil path SQLite dari DATABASE_URL.

    Lokal:
    sqlite:///./vertexar.db
    -> backend/vertexar.db

    Railway:
    sqlite:////data/vertexar-local.db
    -> /data/vertexar-local.db
    """

    database_url = (
        settings.database_url
        .strip()
    )

    sqlite_prefixes = (
        "sqlite+pysqlite:///",
        "sqlite:///",
    )

    raw_path = None

    for prefix in sqlite_prefixes:
        if database_url.startswith(prefix):
            raw_path = database_url[
                len(prefix):
            ]
            break

    if raw_path is None:
        raise RuntimeError(
            "Knowledge service saat ini "
            "hanya mendukung database SQLite."
        )

    if raw_path == ":memory:":
        raise RuntimeError(
            "Database SQLite in-memory "
            "tidak didukung untuk knowledge."
        )

    database_path = Path(
        raw_path
    )

    if not database_path.is_absolute():
        database_path = (
            BACKEND_DIR
            / database_path
        )

    database_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    return database_path.resolve()


DATABASE_PATH = (
    get_database_path()
)


# =========================================================
# EMBEDDING CONFIGURATION
# =========================================================

EMBEDDING_MODEL = os.getenv(
    "GEMINI_EMBEDDING_MODEL",
    "gemini-embedding-2",
)

EMBEDDING_DIMENSION = 768


# =========================================================
# GEMINI API KEY
# =========================================================

def get_api_key() -> str:
    api_key = os.getenv(
        "GEMINI_API_KEY"
    )

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY belum tersedia "
            "di environment backend."
        )

    return api_key.strip()


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_database_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(
        DATABASE_PATH,
        timeout=30,
    )

    connection.row_factory = (
        sqlite3.Row
    )

    return connection


# =========================================================
# CREATE KNOWLEDGE TABLE
# =========================================================

def create_knowledge_table() -> None:
    with get_database_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS knowledge_chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                document_name TEXT NOT NULL,
                document_title TEXT NOT NULL,
                route TEXT NOT NULL,
                category TEXT NOT NULL,
                section_title TEXT NOT NULL,
                content TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                embedding TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )

        connection.execute(
            """
            CREATE INDEX IF NOT EXISTS
            idx_knowledge_chunks_document_name
            ON knowledge_chunks(document_name)
            """
        )

        connection.commit()


# =========================================================
# PARSE MARKDOWN FRONTMATTER
# =========================================================

def parse_frontmatter(
    markdown_text: str,
) -> tuple[dict[str, str], str]:
    metadata: dict[
        str,
        str,
    ] = {}

    text = markdown_text.lstrip(
        "\ufeff"
    )

    if not text.startswith("---"):
        return metadata, text

    parts = text.split(
        "---",
        2,
    )

    if len(parts) < 3:
        return metadata, text

    for raw_line in (
        parts[1].splitlines()
    ):
        line = raw_line.strip()

        if (
            not line
            or line.startswith("-")
            or ":" not in line
        ):
            continue

        key, value = line.split(
            ":",
            1,
        )

        metadata[
            key.strip()
        ] = (
            value.strip()
            .strip('"')
            .strip("'")
        )

    return (
        metadata,
        parts[2].lstrip(),
    )


# =========================================================
# SPLIT LONG SECTION
# =========================================================

def split_long_section(
    title: str,
    content: str,
    max_chars: int = 1800,
) -> list[
    tuple[str, str]
]:
    content = re.sub(
        r"\n{3,}",
        "\n\n",
        content,
    ).strip()

    if not content:
        return []

    if len(content) <= max_chars:
        return [
            (
                title,
                content,
            )
        ]

    paragraphs = [
        item.strip()
        for item in re.split(
            r"\n\s*\n",
            content,
        )
        if item.strip()
    ]

    result: list[
        tuple[str, str]
    ] = []

    current: list[str] = []

    current_length = 0
    part_number = 1

    for paragraph in paragraphs:
        paragraph_length = (
            len(paragraph) + 2
        )

        if (
            current
            and (
                current_length
                + paragraph_length
                > max_chars
            )
        ):
            result.append(
                (
                    (
                        f"{title} — "
                        f"Bagian {part_number}"
                    ),
                    "\n\n".join(
                        current
                    ),
                )
            )

            current = []
            current_length = 0
            part_number += 1

        current.append(
            paragraph
        )

        current_length += (
            paragraph_length
        )

    if current:
        result.append(
            (
                (
                    f"{title} — "
                    f"Bagian {part_number}"
                ),
                "\n\n".join(
                    current
                ),
            )
        )

    return result


# =========================================================
# MARKDOWN -> CHUNKS
# =========================================================

def markdown_to_chunks(
    file_path: Path,
) -> list[
    dict[str, str]
]:
    metadata, body = (
        parse_frontmatter(
            file_path.read_text(
                encoding="utf-8"
            )
        )
    )

    document_title = (
        metadata.get(
            "title",
            (
                file_path.stem
                .replace(
                    "-",
                    " ",
                )
                .title()
            ),
        )
    )

    route = metadata.get(
        "route",
        "",
    )

    category = metadata.get(
        "category",
        "materi",
    )

    main_title = (
        document_title
    )

    section_title = (
        "Ringkasan"
    )

    section_lines: list[
        str
    ] = []

    sections: list[
        tuple[str, str]
    ] = []

    for raw_line in (
        body.splitlines()
    ):
        line = (
            raw_line.rstrip()
        )

        if line.startswith("# "):
            main_title = (
                line[2:].strip()
                or document_title
            )

            continue

        if line.startswith("## "):
            if section_lines:
                sections.append(
                    (
                        section_title,
                        "\n".join(
                            section_lines
                        ),
                    )
                )

            section_title = (
                line[3:].strip()
                or "Bagian"
            )

            section_lines = []

            continue

        section_lines.append(
            line
        )

    if section_lines:
        sections.append(
            (
                section_title,
                "\n".join(
                    section_lines
                ),
            )
        )

    chunks: list[
        dict[str, str]
    ] = []

    for (
        current_title,
        current_content,
    ) in sections:

        split_sections = (
            split_long_section(
                current_title,
                current_content,
            )
        )

        for (
            final_title,
            final_content,
        ) in split_sections:
            chunks.append(
                {
                    "document_name":
                        file_path.name,

                    "document_title":
                        main_title,

                    "route":
                        route,

                    "category":
                        category,

                    "section_title":
                        final_title,

                    "content":
                        final_content,
                }
            )

    return chunks


# =========================================================
# EMBEDDING
# =========================================================

def embed_text(
    text: str,
) -> list[float]:
    with genai.Client(
        api_key=get_api_key()
    ) as client:

        result = (
            client.models.embed_content(
                model=(
                    EMBEDDING_MODEL
                ),
                contents=text,
                config=(
                    types.EmbedContentConfig(
                        output_dimensionality=(
                            EMBEDDING_DIMENSION
                        ),
                    )
                ),
            )
        )

    if not result.embeddings:
        raise RuntimeError(
            "Model embedding tidak "
            "mengembalikan data."
        )

    return [
        float(value)
        for value
        in (
            result
            .embeddings[0]
            .values
        )
    ]


# =========================================================
# DOCUMENT EMBEDDING
# =========================================================

def create_document_embedding(
    document_title: str,
    section_title: str,
    content: str,
) -> list[float]:

    prepared_document = (
        f"title: {document_title} "
        f"- {section_title} | "
        f"text: {content}"
    )

    return embed_text(
        prepared_document
    )


# =========================================================
# QUERY EMBEDDING
# =========================================================

def create_query_embedding(
    query: str,
) -> list[float]:

    prepared_query = (
        "task: question answering | "
        f"query: {query.strip()}"
    )

    return embed_text(
        prepared_query
    )


# =========================================================
# COSINE SIMILARITY
# =========================================================

def cosine_similarity(
    first_vector: list[float],
    second_vector: list[float],
) -> float:

    if (
        len(first_vector)
        != len(second_vector)
    ):
        return 0.0

    dot_product = sum(
        first * second
        for first, second
        in zip(
            first_vector,
            second_vector,
        )
    )

    first_norm = math.sqrt(
        sum(
            value * value
            for value
            in first_vector
        )
    )

    second_norm = math.sqrt(
        sum(
            value * value
            for value
            in second_vector
        )
    )

    if (
        first_norm == 0
        or second_norm == 0
    ):
        return 0.0

    return (
        dot_product
        / (
            first_norm
            * second_norm
        )
    )


# =========================================================
# TOKENIZER
# =========================================================

def tokenize(
    text: str,
) -> set[str]:

    ignored = {
        "apa",
        "apakah",
        "bagaimana",
        "yang",
        "dan",
        "atau",
        "untuk",
        "dari",
        "pada",
        "di",
        "ke",
        "itu",
        "ini",
        "adalah",
        "sebuah",
        "berapa",
        "jelaskan",
        "tolong",
        "saya",
        "aku",
        "kamu",
    }

    return {
        word
        for word in re.findall(
            r"[a-zA-ZÀ-ÿ0-9]+",
            text.lower(),
        )
        if (
            len(word) >= 3
            and word not in ignored
        )
    }


# =========================================================
# KEYWORD SCORE
# =========================================================

def keyword_overlap_score(
    query: str,
    document_text: str,
) -> float:

    query_words = tokenize(
        query
    )

    if not query_words:
        return 0.0

    matched_words = (
        query_words.intersection(
            tokenize(
                document_text
            )
        )
    )

    return (
        len(matched_words)
        / len(query_words)
    )


# =========================================================
# INDEX KNOWLEDGE DIRECTORY
# =========================================================

def index_knowledge_directory() -> dict[
    str,
    Any,
]:

    if not KNOWLEDGE_DIR.exists():
        raise RuntimeError(
            "Folder knowledge tidak "
            "ditemukan: "
            f"{KNOWLEDGE_DIR}"
        )

    markdown_files = sorted(
        KNOWLEDGE_DIR.glob(
            "*.md"
        )
    )

    if not markdown_files:
        raise RuntimeError(
            "Tidak ada file .md "
            "di backend/knowledge."
        )

    create_knowledge_table()

    document_count = 0
    chunk_count = 0

    with (
        get_database_connection()
        as connection
    ):

        connection.execute(
            """
            DELETE FROM
            knowledge_chunks
            """
        )

        connection.commit()

        for file_path in (
            markdown_files
        ):

            if (
                file_path.stat()
                .st_size
                == 0
            ):
                print(
                    (
                        "[LEWATI] "
                        f"{file_path.name}: "
                        "file kosong"
                    )
                )

                continue

            chunks = (
                markdown_to_chunks(
                    file_path
                )
            )

            if not chunks:
                print(
                    (
                        "[LEWATI] "
                        f"{file_path.name}: "
                        "tidak ada bagian"
                    )
                )

                continue

            print(
                (
                    "[PROSES] "
                    f"{file_path.name}: "
                    f"{len(chunks)} bagian"
                )
            )

            for chunk in chunks:

                embedding = (
                    create_document_embedding(
                        chunk[
                            "document_title"
                        ],
                        chunk[
                            "section_title"
                        ],
                        chunk[
                            "content"
                        ],
                    )
                )

                content_hash = (
                    hashlib.sha256(
                        chunk[
                            "content"
                        ].encode(
                            "utf-8"
                        )
                    ).hexdigest()
                )

                connection.execute(
                    """
                    INSERT INTO knowledge_chunks (
                        document_name,
                        document_title,
                        route,
                        category,
                        section_title,
                        content,
                        content_hash,
                        embedding,
                        created_at
                    )
                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    )
                    """,
                    (
                        chunk[
                            "document_name"
                        ],
                        chunk[
                            "document_title"
                        ],
                        chunk[
                            "route"
                        ],
                        chunk[
                            "category"
                        ],
                        chunk[
                            "section_title"
                        ],
                        chunk[
                            "content"
                        ],
                        content_hash,
                        json.dumps(
                            embedding
                        ),
                        (
                            datetime.now(
                                timezone.utc
                            ).isoformat()
                        ),
                    ),
                )

                chunk_count += 1

            connection.commit()

            document_count += 1

    return {
        "documents":
            document_count,

        "chunks":
            chunk_count,

        "database":
            str(DATABASE_PATH),

        "embedding_model":
            EMBEDDING_MODEL,

        "embedding_dimension":
            EMBEDDING_DIMENSION,
    }


# =========================================================
# KNOWLEDGE STATS
# =========================================================

def get_knowledge_stats() -> dict[
    str,
    Any,
]:

    create_knowledge_table()

    with (
        get_database_connection()
        as connection
    ):

        chunks = (
            connection.execute(
                """
                SELECT
                    COUNT(*) AS total
                FROM knowledge_chunks
                """
            )
            .fetchone()["total"]
        )

        documents = (
            connection.execute(
                """
                SELECT
                    COUNT(
                        DISTINCT document_name
                    ) AS total
                FROM knowledge_chunks
                """
            )
            .fetchone()["total"]
        )

    return {
        "documents":
            documents,

        "chunks":
            chunks,

        "database":
            str(DATABASE_PATH),

        "embedding_model":
            EMBEDDING_MODEL,
    }


# =========================================================
# SEARCH KNOWLEDGE
# =========================================================

def search_knowledge(
    query: str,
    top_k: int = 4,
    minimum_score: float = 0.34,
) -> list[
    dict[str, Any]
]:

    clean_query = (
        query.strip()
    )

    if not clean_query:
        return []

    create_knowledge_table()

    with (
        get_database_connection()
        as connection
    ):

        rows = (
            connection.execute(
                """
                SELECT
                    id,
                    document_name,
                    document_title,
                    route,
                    category,
                    section_title,
                    content,
                    embedding
                FROM knowledge_chunks
                """
            )
            .fetchall()
        )

    if not rows:
        return []

    query_embedding = (
        create_query_embedding(
            clean_query
        )
    )

    results: list[
        dict[str, Any]
    ] = []

    for row in rows:

        try:
            document_embedding = (
                json.loads(
                    row["embedding"]
                )
            )

        except (
            TypeError,
            json.JSONDecodeError,
        ):
            continue

        semantic_score = (
            cosine_similarity(
                query_embedding,
                document_embedding,
            )
        )

        lexical_score = (
            keyword_overlap_score(
                clean_query,
                (
                    f"{row['document_title']} "
                    f"{row['section_title']} "
                    f"{row['content']}"
                ),
            )
        )

        final_score = (
            semantic_score * 0.88
            + lexical_score * 0.12
        )

        if (
            final_score
            < minimum_score
        ):
            continue

        results.append(
            {
                "id":
                    row["id"],

                "document_name":
                    row[
                        "document_name"
                    ],

                "document_title":
                    row[
                        "document_title"
                    ],

                "route":
                    row["route"],

                "category":
                    row["category"],

                "section_title":
                    row[
                        "section_title"
                    ],

                "content":
                    row["content"],

                "score":
                    round(
                        final_score,
                        6,
                    ),
            }
        )

    results.sort(
        key=lambda item: (
            item["score"]
        ),
        reverse=True,
    )

    return results[
        :top_k
    ]


# =========================================================
# FORMAT KNOWLEDGE CONTEXT
# =========================================================

def format_knowledge_context(
    results: list[
        dict[str, Any]
    ],
) -> str:

    context_parts: list[
        str
    ] = []

    for index, result in (
        enumerate(
            results,
            start=1,
        )
    ):

        context_parts.append(
            "\n".join(
                [
                    (
                        f"[SUMBER {index}]"
                    ),
                    (
                        "Judul: "
                        f"{result['document_title']}"
                    ),
                    (
                        "Bagian: "
                        f"{result['section_title']}"
                    ),
                    (
                        "Halaman: "
                        f"{result['route'] or '-'}"
                    ),
                    "Isi:",
                    result["content"],
                ]
            )
        )

    return "\n\n".join(
        context_parts
    )