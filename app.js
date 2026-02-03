import { handleAddComment } from "./modules/commentHandlers.js";
import { setupEventListeners, setupFormHandlers } from "./modules/eventHandlers.js";
import { nameInput, textInput, addButton, commentsList } from "./modules/domElements.js";
import { renderComments } from "./modules/render.js";
import CommentsApi from "./modules/api.js";

const api = new CommentsApi("natali-cheglova");
let currentComments = [];

// Функция для чтения существующих комментариев из HTML
function getExistingCommentsFromHTML() {
  const commentElements = commentsList.querySelectorAll(".comment");
  const existingComments = [];

  commentElements.forEach((element, index) => {
    const nameEl = element.querySelector(".comment-header div:first-child");
    const dateEl = element.querySelector(".comment-header div:last-child");
    const textEl = element.querySelector(".comment-text");
    const likesEl = element.querySelector(".likes-counter");
    const likeButton = element.querySelector(".like-button");

    existingComments.push({
      id: `html-${index}`, // временный ID для HTML комментариев
      name: nameEl?.textContent || "Аноним",
      date: dateEl?.textContent || new Date().toLocaleString(),
      text: textEl?.textContent || "",
      likes: parseInt(likesEl?.textContent) || 0,
      isLiked: likeButton?.classList.contains("-active-like") || false,
      isFromHTML: true, // флаг, что комментарий из HTML
    });
  });

  console.log(`Найдено ${existingComments.length} комментариев в HTML`);
  return existingComments;
}

async function initApp() {
  console.log("=== initApp запущен ===");

  // 1. Сначала читаем существующие комментарии из HTML
  const htmlComments = getExistingCommentsFromHTML();

  try {
    // 2. Загружаем комментарии с API
    console.log("Загружаем комментарии с API...");
    const apiComments = await api.getComments();
    console.log(`Загружено ${apiComments.length} комментариев с API`);

    // 3. Объединяем: используем API комментарии, если они есть, иначе HTML
    if (apiComments && apiComments.length > 0) {
      currentComments = apiComments;
      console.log("Используем комментарии с API");

      // Очищаем HTML комментарии и рендерим API комментарии
      commentsList.innerHTML = "";
      renderComments(commentsList);
    } else {
      // Если API пустой, используем HTML комментарии
      currentComments = htmlComments;
      console.log("API пустой, используем HTML комментарии");
      // HTML комментарии уже на странице, ничего не делаем
    }
  } catch (error) {
    console.error("Ошибка загрузки с API:", error);

    // При ошибке API используем HTML комментарии
    currentComments = htmlComments;
    console.log("Используем HTML комментарии из-за ошибки API");

    // Покажем сообщение об ошибке
    const errorElement = document.createElement("li");
    errorElement.className = "comment error";
    errorElement.innerHTML = `
      <div class="comment-text" style="color: orange;">
        ⚠ Комментарии загружены локально. Ошибка API: ${error.message}
      </div>
    `;
    commentsList.prepend(errorElement);
  }

  // Настройка обработчиков формы
  setupFormHandlers(nameInput, textInput, addButton, commentsList, handleAddComment);
  setupEventListeners(commentsList, textInput);

  console.log("=== initApp завершен, всего комментариев:", currentComments.length, "===");
}

// Запуск приложения
document.addEventListener("DOMContentLoaded", initApp);

// Экспортируем api и currentComments
export { api, currentComments };
