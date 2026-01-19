import { quoteComment, toggleLike } from "./commentHandlers.js";
import { renderComments } from "./render.js";

export function setupEventListeners(commentsList, textInput) {
  commentsList.addEventListener("click", (event) => {
    const commentElement = event.target.closest(".comment");
    if (commentElement && !event.target.closest(".like-button")) {
      const index = parseInt(commentElement.dataset.index);
      if (!isNaN(index)) {
        quoteComment(index, textInput);
      }
    }
  });

  commentsList.addEventListener("click", (event) => {
    const likeButton = event.target.closest(".like-button");
    if (likeButton) {
      event.stopPropagation();
      const index = parseInt(likeButton.dataset.index);
      if (!isNaN(index)) {
        toggleLike(index);
        renderComments(commentsList);
      }
    }
  });
}

export function setupFormHandlers(nameInput, textInput, addButton, commentsList, handleAddComment) {
  addButton.addEventListener("click", () => handleAddComment(nameInput, textInput, commentsList));

  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment(nameInput, textInput, commentsList);
    }
  });
}
