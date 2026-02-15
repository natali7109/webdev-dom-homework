export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/natali-cheglova/comments", {
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
        alert("Кажется, у вас сломался интернет, попробуйте позже.");
      }
      throw error;
    });
}

export function addComment({ text, name }) {
  return fetch("https://wedev-api.sky.pro/api/v1/natali-cheglova/comments", {
    method: "POST",
    body: JSON.stringify({
      text: text,
      name: name,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
      }
      if (response.status === 400) {
        throw new Error("Не верный запрос");
      }
      throw new Error("что-то пошло не так");
    })
    .catch((error) => {
      if (error.message === "Failed to fetch") {
        error.message = "Кажется, у вас сломался интернет, попробуйте позже.";
      }
      throw error;
    });
}

// Лайки не поддерживаются API
export function toggleLike(id) {
  return Promise.resolve();
}
