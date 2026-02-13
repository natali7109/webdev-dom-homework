import { handleAddComment } from "./modules/commentHandlers.js";
import { setupEventListeners, setupFormHandlers } from "./modules/eventHandlers.js";
import { nameInput, textInput, addButton, commentsList } from "./modules/domElements.js";
import { renderComments } from "./modules/render.js";
import { getComments, addComment } from "./modules/api.js";

let currentComments = [];

function initApp() {
  document.querySelector(".comments").innerHTML = "Пожалуйста подождите, приложение запускается...";
  console.log("Приложение запускается...");

  getComments()
    .then((comments) => {
      console.log("Загружено комментариев:", comments.length);
      currentComments = comments;
      renderComments(commentsList, comments);
    })
    .catch((error) => {
      console.error(error);
      document.querySelector(".comments").innerHTML = "Не удалось загрузить комментарии";
    });

  // Настраиваем обработчики
  setupFormHandlers(handleAddComment);
  setupEventListeners(commentsList, textInput);
}

document.addEventListener("DOMContentLoaded", initApp);

// Экспортируем для других модулей
export { getComments, addComment, currentComments };
