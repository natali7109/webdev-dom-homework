import { escapeHtml } from "./escapeHtml.js";
import { validateComment } from "./validation.js";
import { renderComments } from "./render.js";
import { addComment, getComments, toggleLike } from "./api.js";
import { isAuthenticated } from "./auth.js";
import { currentComments } from "../app.js";

export function handleAddComment() {
  // Находим поле ввода
  const textInputElement = document.getElementById("comment-input");

  if (!textInputElement) {
    console.error("Поле ввода не найдено в DOM!");
    alert("Форма комментария не загружена. Попробуйте обновить страницу.");
    return;
  }

  // Находим кнопку
  const addButtonElement = document.querySelector(".add-form-button");

  if (!addButtonElement) {
    console.error("Кнопка не найдена в DOM!");
    alert("Ошибка загрузки формы");
    return;
  }

  const textValue = textInputElement.value.trim();

  // Проверяем авторизацию
  if (!isAuthenticated()) {
    alert("Чтобы добавить комментарий, нужно авторизоваться");
    const appContainer = document.getElementById("app-container");
    import("./render.js").then(({ renderLoginForm }) => {
      renderLoginForm(appContainer);
      import("./loginHandler.js").then(({ initLoginHandlers }) => {
        initLoginHandlers(appContainer);
      });
    });
    return;
  }

  const validation = validateComment(textValue);
  if (!validation.isValid) {
    alert(validation.message);
    textInputElement.focus();
    return;
  }

  const safeText = escapeHtml(textValue);

  // Находим форму и лоадер
  const addForm = document.querySelector(".add-form");
  const formLoading = document.querySelector(".form-loading");
  const originalText = addButtonElement.textContent;

  // Скрываем форму, показываем загрузку
  addForm.style.display = "none";
  formLoading.style.display = "block";
  addButtonElement.textContent = "Добавляем...";
  addButtonElement.disabled = true;

  return addComment({ text: safeText })
    .then(() => getComments())
    .then((updatedComments) => {
      currentComments.length = 0;
      currentComments.push(...updatedComments);

      // Рендерим  контейнер приложения
      const appContainer = document.getElementById("app-container");
      if (appContainer) {
        renderComments(appContainer, updatedComments, true);
      } else {
        console.error("Контейнер app-container не найден!");
      }

      // Очищаем форму
      textInputElement.value = "";
      textInputElement.focus();
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      alert(error.message);
    })
    .finally(() => {
      addForm.style.display = "";
      formLoading.style.display = "none";
      addButtonElement.textContent = originalText;
      addButtonElement.disabled = false;
    });
}

export function handleToggleLike(commentId) {
  if (!isAuthenticated()) {
    alert("Чтобы ставить лайки, нужно авторизоваться");
    return Promise.resolve();
  }

  // Оптимистичный UI (сразу меняем интерфейс)
  const comment = currentComments.find((c) => c.id === commentId);
  if (comment) {
    comment.isLiked = !comment.isLiked;
    comment.likes = comment.isLiked ? (comment.likes || 0) + 1 : (comment.likes || 0) - 1;

    // Обновляем DOM для этого комментария
    updateCommentInDOM(commentId, comment);
  }

  // Отправляем запрос на сервер
  return toggleLike(commentId).catch((error) => {
    console.error("Ошибка при лайке:", error);
    alert(error.message);

    // Откатываем изменения при ошибке
    if (comment) {
      comment.isLiked = !comment.isLiked;
      comment.likes = comment.isLiked ? (comment.likes || 0) + 1 : (comment.likes || 0) - 1;
      updateCommentInDOM(commentId, comment);
    }
  });
}

// Функция для обновления одного комментария в DOM
function updateCommentInDOM(commentId, commentData) {
  const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
  if (!commentElement) return;

  const likesCounter = commentElement.querySelector(".likes-counter");
  const likeButton = commentElement.querySelector(".like-button");

  if (likesCounter) {
    likesCounter.textContent = commentData.likes || 0;
  }

  if (likeButton) {
    if (commentData.isLiked) {
      likeButton.classList.add("-active-like");
    } else {
      likeButton.classList.remove("-active-like");
    }
  }
}

export function quoteComment(commentId, replyInput) {
  const comment = currentComments.find((c) => c.id == commentId);
  if (!comment) return;

  // Имя автора
  const authorName = comment.author?.name || "Аноним";
  const commentText = comment.text || "";

  // Удаляем HTML
  const textWithoutHtml = commentText.replace(/<[^>]*>/g, "");
  const quotedText = `> ${authorName}:\n> ${textWithoutHtml}\n\n`;

  replyInput.value = quotedText + (replyInput.value || "");
  replyInput.focus();
}
