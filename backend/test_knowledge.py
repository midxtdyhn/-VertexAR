import sys

from app.services.knowledge_service import (
    get_knowledge_stats,
    search_knowledge,
)


def main() -> None:
    query = " ".join(
        sys.argv[1:]
    ).strip()

    if not query:
        query = input(
            "Masukkan pertanyaan: "
        ).strip()

    if not query:
        print(
            "Pertanyaan tidak boleh kosong."
        )
        return

    try:
        stats = get_knowledge_stats()

        print(
            "\n=== STATUS KNOWLEDGE ==="
        )

        print(
            f"Dokumen         : "
            f"{stats['documents']}"
        )

        print(
            f"Chunk           : "
            f"{stats['chunks']}"
        )

        print(
            f"Model embedding : "
            f"{stats['embedding_model']}"
        )

        print(
            f"Database        : "
            f"{stats['database']}"
        )

        if stats["chunks"] == 0:
            print(
                "\nKnowledge masih kosong."
            )

            print(
                "Jalankan terlebih dahulu:"
            )

            print(
                "python index_knowledge.py"
            )

            return

        results = search_knowledge(
            query=query,
            top_k=5,
            minimum_score=0.0,
        )

        print(
            "\n=== PERTANYAAN ==="
        )

        print(query)

        print(
            "\n=== HASIL PENCARIAN ==="
        )

        if not results:
            print(
                "Tidak ditemukan materi "
                "yang relevan."
            )

            return

        for number, result in enumerate(
            results,
            start=1,
        ):
            content_preview = (
                result["content"]
                .replace("\n", " ")
                .strip()
            )

            if len(content_preview) > 400:
                content_preview = (
                    content_preview[:400]
                    + "..."
                )

            print(
                f"\n{number}. "
                f"{result['document_title']}"
            )

            print(
                f"   Bagian : "
                f"{result['section_title']}"
            )

            print(
                f"   Route  : "
                f"{result['route'] or '-'}"
            )

            print(
                f"   Kategori: "
                f"{result['category']}"
            )

            print(
                f"   Score  : "
                f"{result['score']}"
            )

            print(
                f"   Isi    : "
                f"{content_preview}"
            )

    except Exception as error:
        print(
            "\n=== TERJADI ERROR ==="
        )

        print(
            f"{type(error).__name__}: "
            f"{error}"
        )

        raise


if __name__ == "__main__":
    main()