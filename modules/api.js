export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/natali-cheglova/comments", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      return responseData.comments;
    });
}

export function addComment({ text, name }) {
  return fetch("https://wedev-api.sky.pro/api/v1/natali-cheglova/comments", {
    method: "POST",
    body: JSON.stringify({
      text: text,
      name: name,
    }),
  }).then((response) => {
    console.log("Статус ответа:", response.status);

    if (response.status === 201) {
      return response.json();
    } else {
      return response.json().then((errorData) => {
        throw new Error(errorData.error || "Ошибка добавления");
      });
    }
  });
}

// Лайки не поддерживаются API
export function toggleLike(id) {
  return Promise.resolve();
}
