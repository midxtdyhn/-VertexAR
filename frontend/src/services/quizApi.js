const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Terjadi kesalahan saat mengambil data.";

    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      // Respons error bukan JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getActiveQuiz() {
  const response = await fetch(`${API_URL}/api/quizzes/active`);

  return handleResponse(response);
}

export async function getQuizQuestions(quizId) {
  const response = await fetch(
    `${API_URL}/api/quizzes/${quizId}/questions`
  );

  return handleResponse(response);
}

export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
}