import { escapeHtml } from "./escapeHtml.js";
import { validateComment } from "./validation.js";
import { renderComments } from "./render.js";
import { addComment, getComments, toggleLike } from "./api.js";
import { isAuthenticated } from "./auth.js";
import { currentComments } from "../app.js";
import { commentsList, textInput, addButton } from "./domElements.js";

export function handleAddComment() {
  console.log("=== handleAddComment вызван ===");

  // ✅ Проверяем, авторизован ли пользователь
  if (!isAuthenticated()) {
    alert("Чтобы добавить комментарий, нужно авторизоваться");
    // Можно перенаправить на страницу логина
    window.location.href = "/login.html";
    return;
  }

  const textValue = textInput.value.trim();

  const validation = validateComment(textValue);
  if (!validation.isValid) {
    alert(validation.message);
    textInput.focus();
    return;
  }

  // Экранирование HTML
  const safeText = escapeHtml(textValue);

  // Находим форму и лоадер
  const addForm = document.querySelector(".add-form");
  const formLoading = document.querySelector(".form-loading");
  const originalText = addButton.textContent;

  // Скрываем форму, показываем "Комментарий добавляется..."
  addForm.style.display = "none";
  formLoading.style.display = "block";
  addButton.textContent = "Добавляем...";
  addButton.disabled = true;

  return addComment({
    text: safeText,
  })
    .then((result) => {
      console.log("Сервер ответил:", result);
      console.log("Запрашиваем обновленный список...");
      return getComments();
    })
    .then((updatedComments) => {
      console.log("Обновленный список:", updatedComments);

      // Обновляем currentComments
      currentComments.length = 0;
      currentComments.push(...updatedComments);

      // Перерисовываем
      renderComments(commentsList, updatedComments);

      // Очищаем форму
      textInput.value = "";
      textInput.focus();

      console.log("=== Комментарий успешно добавлен ===");
    })
    .catch((error) => {
      console.error("Ошибка при добавлении комментария:", error);
      alert(error.message);
    })
    .finally(() => {
      addForm.style.display = "";
      formLoading.style.display = "none";
      addButton.textContent = originalText;
      addButton.disabled = false;
    });
}

export function handleToggleLike(commentId) {
  console.log("=== handleToggleLike для ID:", commentId);

  // ✅ Проверяем, авторизован ли пользователь
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
  console.log("quoteComment вызван для ID:", commentId);

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
