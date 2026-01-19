import { getComments } from "./comments.js";

export function renderComments(container) {
  const comments = getComments();
  const commentsHtml = comments
    .map((comment, index) => {
      const formattedText = comment.text.replace(/\n/g, "<br>");
      const likeClass = comment.isLiked ? "-active-like" : "";

      return `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${formattedText}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${likeClass}" data-index="${index}"></button>
          </div>
        </div>
      </li>
    `;
    })
    .join("");

  container.innerHTML = commentsHtml;
}

export function getCommentElement(index) {
  return document.querySelector(`.comment[data-index="${index}"]`);
}
