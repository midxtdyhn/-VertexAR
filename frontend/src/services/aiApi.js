const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
)
  .trim()
  .replace(/\/+$/, "");


async function readResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Terjadi kesalahan saat menghubungi AI VertexAR. Kode: ${response.status}`;

    throw new Error(message);
  }

  return data;
}


async function requestApi(
  endpoint,
  options = {}
) {
  const controller =
    new AbortController();

  const timeoutId =
    window.setTimeout(() => {
      controller.abort();
    }, 30000);

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          Accept: "application/json",
          ...(options.headers || {}),
        },

        signal: controller.signal,
      }
    );

    return await readResponse(
      response
    );
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Server AI terlalu lama merespons. Silakan coba kembali."
      );
    }

    if (
      error instanceof TypeError
    ) {
      throw new Error(
        "Tidak dapat terhubung ke server AI VertexAR. Pastikan backend sedang aktif."
      );
    }

    if (
      error instanceof Error
    ) {
      throw error;
    }

    throw new Error(
      "Terjadi kesalahan saat menghubungi AI VertexAR."
    );
  } finally {
    window.clearTimeout(
      timeoutId
    );
  }
}


export async function sendAiMessage({
  message,
  history = [],
}) {
  return requestApi(
    "/api/ai/chat",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        message,
        history,
      }),
    }
  );
}


export async function checkAiHealth() {
  return requestApi(
    "/api/ai/health",
    {
      method: "GET",
    }
  );
}