export default class CommentsApi {
  constructor(personalKey) {
    this._baseUrl = `https://wedev-api.sky.pro/api/v1/${personalKey}/comments`;
    console.log("API создан с URL:", this._baseUrl);
  }

  // Получить список комментариев
  async getComments() {
    try {
      console.log("Запрос к:", this._baseUrl);
      const response = await fetch(this._baseUrl);
      console.log("Ответ получен, статус:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Данные от API:", data);

      if (data && data.comments !== undefined) {
        console.log(`Найдено ${data.comments.length} комментариев в data.comments`);
        return data.comments;
      } else if (data && data.комментарии !== undefined) {
        console.log(`Найдено ${data.комментарии.length} комментариев в data.комментарии`);
        return data.комментарии;
      } else if (Array.isArray(data)) {
        console.log(`API вернул массив из ${data.length} элементов`);
        return data;
      } else {
        console.warn("Неожиданная структура ответа:", data);
        return [];
      }
    } catch (error) {
      console.error("Ошибка в getComments:", error);
      throw error;
    }
  }

  // Добавить новый комментарий
  async addComment({ text, name }) {
    try {
      console.log("API: addComment вызван с:", { text, name });

      const response = await fetch(this._baseUrl, {
        method: "POST",
        body: JSON.stringify({
          text: text,
          name: name,
        }),
      });

      console.log("API: addComment ответ, статус:", response.status);
      console.log("API: addComment заголовки:", response.headers);

      if (response.status === 201) {
        const result = await response.json();
        console.log("API: addComment успех:", result);
        return result;
      } else {
        const errorText = await response.text();
        console.error("API: addComment ошибка, текст:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || errorData.ошибка || `Ошибка ${response.status}`);
        } catch (e) {
          throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("API: addComment исключение:", error);
      throw error;
    }
  }

  // Лайкнуть комментарий
  async toggleLike(id) {
    try {
      console.log(`API: toggleLike для комментария ${id}`);

      const response = await fetch(`${this._baseUrl}/${id}/toggle-like`, {
        method: "POST",
      });

      console.log("API: toggleLike ответ, статус:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("API: toggleLike успех:", result);
        return result;
      } else {
        const errorText = await response.text();
        console.error("API: toggleLike ошибка:", errorText);
        throw new Error(`Ошибка лайка: ${response.status}`);
      }
    } catch (error) {
      console.error("API: toggleLike исключение:", error);
      throw error;
    }
  }
}
