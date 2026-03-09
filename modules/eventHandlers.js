import { handleToggleLike, quoteComment } from "./commentHandlers.js";
import { isAuthenticated } from "./auth.js";

export function setupLoginLink() {
  const loginLink = document.getElementById("show-login-link");

  loginLink?.addEventListener("click", (e) => {
    e.preventDefault();

    // показать форму входа
    const appContainer = document.getElementById("app-container");
    import("./render.js").then(({ renderLoginForm }) => {
      renderLoginForm(appContainer);
      import("./loginHandler.js").then(({ initLoginHandlers }) => {
        initLoginHandlers(appContainer);
      });
    });
  });
}

export function setupEventListeners(container, replyInput) {
  container.addEventListener("click", (event) => {
    const target = event.target;

    //  Лайк комментария
    if (target.classList.contains("like-button")) {
      event.preventDefault();
      event.stopPropagation();

      const commentId = target.dataset.id;

      if (commentId) {
        handleToggleLike(commentId);
      }
      return;
    }

    //  Клик для цитирования
    const commentElement = target.closest(".comment");

    if (commentElement && replyInput) {
      event.preventDefault();
      event.stopPropagation();

      const commentId = commentElement.dataset.id;

      if (commentId && replyInput) {
        quoteComment(commentId, replyInput);
      }
    }
  });
}

export function setupFormHandlers(handleAddComment) {

  const addButton = document.querySelector(".add-form-button");
  const textInput = document.querySelector(".add-form-text");

  if (!addButton || !textInput) {
    console.error("Элементы формы не найдены!");
    return;
  }

  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleAddComment();
  });

  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  });
}

// ФУНКЦИЯ для кнопки входа/выхода
export function setupAuthButton() {
  const authButton = document.querySelector(".auth-button");
  if (!authButton) return;

  if (isAuthenticated()) {
    authButton.textContent = "Выйти";
    authButton.classList.add("logout-button");
  } else {
    authButton.textContent = "Войти";
    authButton.classList.remove("logout-button");
  }

  authButton.addEventListener("click", () => {
    if (isAuthenticated()) {
      // Выход
      localStorage.removeItem("token");
      window.location.reload();
    } else {
      const appContainer = document.getElementById("app-container");
      import("./render.js").then(({ renderLoginForm }) => {
        renderLoginForm(appContainer);
        import("./loginHandler.js").then(({ initLoginHandlers }) => {
          initLoginHandlers(appContainer);
        });
      });
    }
  });
}

export function setupLogoutButton() {
  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.reload();
    });
  }
}
