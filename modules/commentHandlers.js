import { escapeHtml } from "./escapeHtml.js";
import { validateComment } from "./validation.js";
import { renderComments } from "./render.js";
import { addComment, getComments } from "./api.js";
import { currentComments } from "../app.js";
import { commentsList, nameInput, textInput } from "./domElements.js";

export function handleAddComment() {
  console.log("=== handleAddComment вызван ===");

  const nameValue = nameInput.value.trim();
  const textValue = textInput.value.trim();

  const validation = validateComment(nameValue, textValue);
  if (!validation.isValid) {
    alert(validation.message);
    validation.focusElement === "name" ? nameInput.focus() : textInput.focus();
    return;
  }

  // Экранирование HTML
  const safeName = escapeHtml(nameValue);
  const safeText = escapeHtml(textValue);

  // НАХОДИМ ФОРМУ И ЛОАДЕР
  const addForm = document.querySelector(".add-form");
  const formLoading = document.querySelector(".form-loading");
  const addButton = document.querySelector(".add-form-button");
  const originalText = addButton.textContent;

  // СКРЫВАЕМ ФОРМУ, ПОКАЗЫВАЕМ "Комментарий добавляется..."
  addForm.style.display = "none";
  formLoading.style.display = "block";
  addButton.textContent = "Добавляем...";
  addButton.disabled = true;

  return addComment({
    text: safeText,
    name: safeName,
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
      renderComments(commentsList);

      // Очищаем форму
      nameInput.value = "";
      textInput.value = "";
      nameInput.focus();

      console.log("=== Комментарий успешно добавлен ===");
    })
    .catch((error) => {
      console.error("Ошибка при добавлении комментария:", error);
      alert(`Ошибка: ${error.message}\n\nПопробуйте еще раз.`);
    })
    .finally(() => {
      addForm.style.display = "";
      formLoading.style.display = "none";
      addButton.textContent = originalText;
      addButton.disabled = false;
    });
}

export async function toggleLike(commentId) {
  console.log("=== toggleLike (локальный) для ID:", commentId);

  // Находим комментарий
  const commentIndex = currentComments.findIndex((c) => c.id === commentId || c.id == commentId);
  if (commentIndex === -1) {
    console.log("Комментарий не найден");
    return;
  }

  // Меняем состояние локально
  const comment = currentComments[commentIndex];
  comment.isLiked = !comment.isLiked;
  comment.likes = comment.isLiked
    ? (comment.likes || 0) + 1
    : Math.max(0, (comment.likes || 0) - 1);

  console.log("Новое состояние:", {
    isLiked: comment.isLiked,
    likes: comment.likes,
  });

  // Перерисовываем этот комментарий
  updateCommentInDOM(commentId, comment);

  console.log("=== Лайк обработан локально ===");
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

  // Имя из author.name
  const authorName = comment.author ? comment.author.name : "Аноним";
  const commentText = comment.text || "";

  // Удаляем HTML
  const textWithoutHtml = commentText.replace(/<[^>]*>/g, "");
  const quotedText = `> ${authorName}:\n> ${textWithoutHtml}\n\n`;

  replyInput.value = quotedText + (replyInput.value || "");
  replyInput.focus();
}
