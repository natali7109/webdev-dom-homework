import { getToken } from "./auth.js";

const BASE_URL = "https://wedev-api.sky.pro/api/v2/natali-cheglova";

// ПОЛУЧИТЬ КОММЕНТАРИИ (можно без авторизации)
export function getComments() {
  return fetch(`${BASE_URL}/comments`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
      }
      return response.json();
    })
    .then((responseData) => {
      return responseData.comments;
    })
    .catch((error) => {
      if (error.message === "Failed to fetch") {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже.");
      }
      throw error;
    });
}

// ДОБАВИТЬ КОММЕНТАРИЙ (нужен токен)
export function addComment({ text }) {
  const token = getToken();

  return fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 401) {
        throw new Error("Чтобы добавить комментарий, нужно авторизоваться");
      }
      if (response.status === 400) {
        return response.json().then((errorData) => {
          throw new Error(errorData.error || "Не верный запрос");
        });
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
      }
      throw new Error("что-то пошло не так");
    })
    .catch((error) => {
      if (error.message === "Failed to fetch") {
        throw new Error("Кажется, у вас сломался интернет, попробуйте позже.");
      }
      throw error;
    });
}

// ЛАЙКНУТЬ КОММЕНТАРИЙ (нужен токен)
export function toggleLike(id) {
  const token = getToken();

  return fetch(`${BASE_URL}/comments/${id}/toggle-like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 401) {
        throw new Error("Чтобы лайкать, нужно авторизоваться");
      }
      throw new Error("Ошибка при лайке");
    })
    .then((data) => data.result);
}

// УДАЛИТЬ КОММЕНТАРИЙ (нужен токен) - если понадобится
export function deleteComment(id) {
  const token = getToken();

  return fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    }
    throw new Error("Ошибка при удалении");
  });
}
