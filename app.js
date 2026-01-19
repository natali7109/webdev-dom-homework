import { handleAddComment } from "./modules/commentHandlers.js";
import { setupEventListeners, setupFormHandlers } from "./modules/eventHandlers.js";
import { nameInput, textInput, addButton, commentsList } from "./modules/domElements.js";
import { renderComments } from "./modules/render.js";

function initApp() {
  // Настройка обработчиков формы
  setupFormHandlers(nameInput, textInput, addButton, commentsList, handleAddComment);

  // Настройка обработчиков для комментариев
  setupEventListeners(commentsList, textInput);

  // Первоначальный рендеринг
  renderComments(commentsList);
}

// Запуск приложения
document.addEventListener("DOMContentLoaded", initApp);
