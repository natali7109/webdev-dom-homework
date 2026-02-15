import { currentComments } from "../app.js";

export function renderComments(container) {
  console.log("renderComments: рендерим", currentComments.length, "комментариев");

  // Очищаем контейнер
  container.innerHTML = "";

  currentComments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    container.appendChild(commentElement);
  });
}

function createCommentElement(comment) {
  const li = document.createElement("li");
  li.className = "comment";
  li.dataset.id = comment.id;

  const authorName = comment.author?.name || comment.name || "Аноним";

  const commentText = comment.text || "";
  const commentDate = comment.date || new Date().toISOString();
  const likesCount = comment.likes || 0;
  const isLiked = comment.isLiked || false;

  const formattedDate = formatDate(commentDate);
  const formattedText = commentText.replace(/\n/g, "<br>");
  const likeClass = isLiked ? "-active-like" : "";

  li.innerHTML = `
    <div class="comment-header">
      <div>${escapeHtml(authorName)}</div>
      <div>${formattedDate}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">${escapeHtml(formattedText)}</div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${likesCount}</span>
        <button class="like-button ${likeClass}" data-id="${comment.id}"></button>
      </div>
    </div>
  `;

  return li;
}

// Вспомогательные функции
function formatDate(dateString) {
  try {
    // Если дата уже в формате "12.02.22 12:18", оставляем как есть
    if (typeof dateString === "string" && dateString.match(/\d{2}\.\d{2}\.\d{2} \d{2}:\d{2}/)) {
      return dateString;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date
      .toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  } catch (error) {
    return dateString;
  }
}

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
/*
// Эта функция может понадобиться для совместимости
export function getCommentElement(index) {
  return document.querySelector(`.comment[data-index="${index}"]`);
}
*/
