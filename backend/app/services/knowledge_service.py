import hashlib
import json
import math
import os
import re

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except Exception:
    genai = None
    types = None

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    delete,
    func,
    select,
)

from app.database import engine


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
# EMBEDDING CONFIGURATION
# =========================================================

EMBEDDING_MODEL = os.getenv(
    "GEMINI_EMBEDDING_MODEL",
    "text-embedding-004",
).strip()

EMBEDDING_DIMENSION = 768


# =========================================================
# KNOWLEDGE DATABASE TABLE
#
# Menggunakan SQLAlchemy supaya:
# - SQLite lokal tetap bisa
# - PostgreSQL / Neon di Vercel bisa
# - Tidak crash saat module di-import
# =========================================================

knowledge_metadata = MetaData()

knowledge_chunks = Table(
    "knowledge_chunks",
    knowledge_metadata,

    Column(
        "id",
        Integer,
        primary_key=True,
        autoincrement=True,
    ),

    Column(
        "document_name",
        String(255),
        nullable=False,
        index=True,
    ),

    Column(
        "document_title",
        String(500),
        nullable=False,
    ),

    Column(
        "route",
        String(500),
        nullable=False,
        default="",
    ),

    Column(
        "category",
        String(100),
        nullable=False,
        default="materi",
    ),

    Column(
        "section_title",
        String(500),
        nullable=False,
    ),

    Column(
        "content",
        Text,
        nullable=False,
    ),

    Column(
        "content_hash",
        String(64),
        nullable=False,
    ),

    Column(
        "embedding",
        Text,
        nullable=False,
    ),

    Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
    ),
)


# =========================================================
# DATABASE LABEL
# =========================================================

def database_label() -> str:
    """
    Hanya menampilkan jenis database.
    Tidak membocorkan password DATABASE_URL.
    """

    return engine.dialect.name


# =========================================================
# GEMINI API KEY
# =========================================================

def get_api_key() -> str:
    api_key = os.getenv(
        "GEMINI_API_KEY",
        "",
    ).strip()

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY belum tersedia "
            "di environment backend."
        )

    return api_key


# =========================================================
# CREATE KNOWLEDGE TABLE
# =========================================================

def create_knowledge_table() -> None:
    """
    Membuat tabel knowledge_chunks jika belum ada.

    SQLAlchemy akan menyesuaikan SQL untuk:
    - SQLite
    - PostgreSQL
    """

    knowledge_metadata.create_all(
        bind=engine
    )


# =========================================================
# PARSE MARKDOWN FRONTMATTER
# =========================================================

def parse_frontmatter(
    markdown_text: str,
) -> tuple[
    dict[str, str],
    str,
]:
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

        if (
            not current
            and len(paragraph) > max_chars
        ):
            start = 0

            while start < len(paragraph):
                piece = paragraph[
                    start:
                    start + max_chars
                ].strip()

                if piece:
                    result.append(
                        (
                            (
                                f"{title} — "
                                f"Bagian {part_number}"
                            ),
                            piece,
                        )
                    )

                    part_number += 1

                start += max_chars

            continue

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

    document_title = metadata.get(
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

    values = (
        result
        .embeddings[0]
        .values
    )

    if not values:
        raise RuntimeError(
            "Embedding kosong."
        )

    return [
        float(value)
        for value
        in values
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

    # Bersihkan index lama.
    with engine.begin() as connection:
        connection.execute(
            delete(
                knowledge_chunks
            )
        )

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

        rows_to_insert: list[
            dict[str, Any]
        ] = []

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

            rows_to_insert.append(
                {
                    "document_name":
                        chunk[
                            "document_name"
                        ],

                    "document_title":
                        chunk[
                            "document_title"
                        ],

                    "route":
                        chunk[
                            "route"
                        ],

                    "category":
                        chunk[
                            "category"
                        ],

                    "section_title":
                        chunk[
                            "section_title"
                        ],

                    "content":
                        chunk[
                            "content"
                        ],

                    "content_hash":
                        content_hash,

                    "embedding":
                        json.dumps(
                            embedding
                        ),

                    "created_at":
                        datetime.now(
                            timezone.utc
                        ),
                }
            )

        if rows_to_insert:
            with engine.begin() as connection:
                connection.execute(
                    knowledge_chunks.insert(),
                    rows_to_insert,
                )

            chunk_count += (
                len(rows_to_insert)
            )

            document_count += 1

    return {
        "documents":
            document_count,

        "chunks":
            chunk_count,

        "database":
            database_label(),

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

    with engine.connect() as connection:

        chunks = (
            connection.scalar(
                select(
                    func.count()
                ).select_from(
                    knowledge_chunks
                )
            )
            or 0
        )

        documents = (
            connection.scalar(
                select(
                    func.count(
                        func.distinct(
                            knowledge_chunks
                            .c
                            .document_name
                        )
                    )
                )
            )
            or 0
        )

    return {
        "documents":
            int(documents),

        "chunks":
            int(chunks),

        "database":
            database_label(),

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

    with engine.connect() as connection:

        rows = (
            connection.execute(
                select(
                    knowledge_chunks.c.id,
                    knowledge_chunks.c.document_name,
                    knowledge_chunks.c.document_title,
                    knowledge_chunks.c.route,
                    knowledge_chunks.c.category,
                    knowledge_chunks.c.section_title,
                    knowledge_chunks.c.content,
                    knowledge_chunks.c.embedding,
                )
            )
            .mappings()
            .all()
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
                    row[
                        "embedding"
                    ]
                )
            )

            if not isinstance(
                document_embedding,
                list,
            ):
                continue

            document_embedding = [
                float(value)
                for value
                in document_embedding
            ]

        except (
            TypeError,
            ValueError,
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
                    row[
                        "id"
                    ],

                "document_name":
                    row[
                        "document_name"
                    ],

                "document_title":
                    row[
                        "document_title"
                    ],

                "route":
                    row[
                        "route"
                    ],

                "category":
                    row[
                        "category"
                    ],

                "section_title":
                    row[
                        "section_title"
                    ],

                "content":
                    row[
                        "content"
                    ],

                "score":
                    round(
                        final_score,
                        6,
                    ),
            }
        )

    results.sort(
        key=lambda item: (
            item[
                "score"
            ]
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

                    result[
                        "content"
                    ],
                ]
            )
        )

    return "\n\n".join(
        context_parts
    )