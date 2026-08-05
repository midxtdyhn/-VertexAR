from app.services.knowledge_service import (
    index_knowledge_directory,
)


def main() -> None:
    print("=" * 58)
    print("MEMBUAT INDEX PENGETAHUAN VERTEXAR")
    print("=" * 58)

    try:
        result = index_knowledge_directory()

        print("\nINDEX SELESAI")
        print(
            f"Dokumen          : "
            f"{result['documents']}"
        )
        print(
            f"Chunk            : "
            f"{result['chunks']}"
        )
        print(
            f"Model embedding  : "
            f"{result['embedding_model']}"
        )
        print(
            f"Dimensi embedding: "
            f"{result['embedding_dimension']}"
        )
        print(
            f"Database         : "
            f"{result['database']}"
        )

    except Exception as error:
        print("\nINDEX GAGAL")
        print(
            f"{type(error).__name__}: "
            f"{error}"
        )

        raise


if __name__ == "__main__":
    main()