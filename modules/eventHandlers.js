import { quoteComment, toggleLike } from "./commentHandlers.js";

export function setupEventListeners(container, replyInput) {
  console.log("setupEventListeners: настройка обработчиков");

  container.addEventListener("click", async (event) => {
    const target = event.target;

    console.log("Клик в контейнере, target:", target.className);

    // 1. Лайк комментария (останавливаем дальнейшую обработку)
    if (target.classList.contains("like-button")) {
      event.preventDefault();
      event.stopPropagation();

      const commentId = target.dataset.id;
      console.log("Лайк по комментарию ID:", commentId);

      if (commentId) {
        await toggleLike(commentId);
      }
      return; // Не обрабатываем клик дальше
    }

    // 2. Клик на ЛЮБОЙ части комментария (кроме кнопок)
    // Ищем ближайший элемент .comment
    const commentElement = target.closest(".comment");

    if (commentElement && replyInput) {
      event.preventDefault();
      event.stopPropagation();

      const commentId = commentElement.dataset.id;
      console.log("Клик по комментарию для ответа, ID:", commentId);

      if (commentId && replyInput) {
        quoteComment(commentId, replyInput);
      }
    }
  });

  console.log("Обработчики установлены");
}

export function setupFormHandlers(nameInput, textInput, addButton, container, handleAddComment) {
  console.log("setupFormHandlers: настройка формы");

  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log('Кнопка "Написать" нажата');
    handleAddComment();
  });

  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      console.log("Enter нажат в поле текста");
      handleAddComment();
    }
  });

  console.log("Обработчики формы установлены");
}
