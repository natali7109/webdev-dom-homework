import { handleToggleLike, quoteComment } from "./commentHandlers.js";
import { isAuthenticated } from "./auth.js";

export function setupEventListeners(container, replyInput) {
  console.log("setupEventListeners: настройка обработчиков");

  container.addEventListener("click", (event) => {
    const target = event.target;

    console.log("Клик в контейнере, target:", target.className);

    // 1. Лайк комментария
    if (target.classList.contains("like-button")) {
      event.preventDefault();
      event.stopPropagation();

      const commentId = target.dataset.id;
      console.log("Лайк по комментарию ID:", commentId);

      if (commentId) {
        handleToggleLike(commentId); // ✅ Вызываем новую функцию
      }
      return;
    }

    // 2. Клик для цитирования
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

export function setupFormHandlers(handleAddComment) {
  console.log("setupFormHandlers: настройка формы");

  const addButton = document.querySelector(".add-form-button");
  const textInput = document.querySelector(".add-form-text");

  if (!addButton || !textInput) {
    console.error("Элементы формы не найдены!");
    return;
  }

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

// ✅ НОВАЯ ФУНКЦИЯ для кнопки входа/выхода
export function setupAuthButton() {
  const authButton = document.querySelector(".auth-button");
  if (!authButton) return;

  if (isAuthenticated()) {
    authButton.textContent = "Выйти";
    authButton.classList.add("logout-button");
  } else {
    authButton.textContent = "Войти";
    authButton.classList.remove("logout-button");
  }

  authButton.addEventListener("click", () => {
    if (isAuthenticated()) {
      // Выход
      localStorage.removeItem("token");
      window.location.reload();
    } else {
      // Переход на страницу входа
      window.location.href = "/login.html";
    }
  });
}
