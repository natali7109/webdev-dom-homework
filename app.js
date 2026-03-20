localStorage.removeItem("token");
localStorage.removeItem("user");
console.log("Принудительный выход при загрузке страницы");

import { renderComments, renderLoginForm } from "./modules/render.js";
import { initLoginHandlers } from "./modules/loginHandler.js";
import { setupEventListeners, setupFormHandlers, setupLoginLink } from "./modules/eventHandlers.js";
import { getComments, addComment } from "./modules/api.js";
import { isAuthenticated } from "./modules/auth.js";
import { handleAddComment } from "./modules/commentHandlers.js";

let currentComments = [];

function initApp() {
  const appContainer = document.getElementById("app-container");
  const path = window.location.pathname;

  // Если мы на странице входа
  if (path.includes("login")) {
    renderLoginForm(appContainer);
    initLoginHandlers(appContainer);
    return;
  }

  // загружаем комментарии (видят все)
  appContainer.innerHTML = '<div class="loader">Загрузка комментариев...</div>';

  getComments()
    .then((comments) => {
      currentComments = comments;

      // ПОТОМ проверяем авторизацию
      if (!isAuthenticated()) {
        renderComments(appContainer, comments, false);
      } else {
        renderComments(appContainer, comments, true);
      }
    })
    .catch((error) => {
      console.error(error);
      appContainer.innerHTML = '<div class="error">Не удалось загрузить комментарии</div>';
    })
    .finally(() => {
      setTimeout(() => {
        setupLoginLink();

        if (isAuthenticated()) {
          const textInput = document.getElementById("comment-input");
          const addButton = document.getElementById("add-button");

          if (textInput && addButton) {
            setupFormHandlers(handleAddComment);
          }

          const commentsList = document.getElementById("comments-list");
          if (commentsList) {
            setupEventListeners(commentsList, textInput);
          }
        } else {
          const commentsList = document.getElementById("comments-list");
          if (commentsList) {
            setupEventListeners(commentsList, null);
          }
        }
      }, 0);
    });
}

document.addEventListener("DOMContentLoaded", initApp);

export { getComments, addComment, currentComments };
