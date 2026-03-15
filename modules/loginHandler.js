import { login, register } from "./auth.js";
import { renderComments } from "./render.js";
import { getComments } from "./api.js";
import { currentComments } from "../app.js";
import { setupEventListeners, setupFormHandlers, setupLoginLink } from "./eventHandlers.js";
import { handleAddComment } from "./commentHandlers.js";

export function initLoginHandlers(container) {
  // НАХОДИМ ФОРМЫ
  const loginForm = document.querySelector(".add-form");
  const registerForm = document.getElementById("register-form");

  // Элементы входа
  const loginInput = document.getElementById("login-input");
  const passwordInput = document.getElementById("password-input");
  const loginButton = document.getElementById("login-button");
  const loginError = document.getElementById("login-error");

  // Элементы регистрации
  const registerName = document.getElementById("register-name");
  const registerLogin = document.getElementById("register-login");
  const registerPassword = document.getElementById("register-password");
  const registerButton = document.getElementById("register-button");
  const registerError = document.getElementById("register-error");

  // Кнопки переключения
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const backButton = document.getElementById("back-to-comments");

  // Переключение на регистрацию
  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  // Переключение на вход
  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // Кнопка назад
  backButton?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
  });

  // Вход
  loginButton?.addEventListener("click", () => {
    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (!loginValue || !passwordValue) {
      loginError.textContent = "Заполните все поля";
      loginError.style.display = "block";
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Вход...";

    login({ login: loginValue, password: passwordValue })
      .then(() => {
        return getComments();
      })
      .then((comments) => {
        currentComments.length = 0;
        currentComments.push(...comments);

        // Рендерим комментарии с формой для авторизованных
        renderComments(container, comments, true);

        // Перенастраиваем все обработчики после рендеринга
        setTimeout(() => {
          console.log("🔄 Настройка обработчиков после входа");

          const textInput = document.getElementById("comment-input");
          const commentsList = document.getElementById("comments-list");

          // Настраиваем обработчики для комментариев
          if (commentsList) {
            setupEventListeners(commentsList, textInput);
          }

          // Настраиваем форму добавления комментария
          if (textInput) {
            setupFormHandlers(handleAddComment);
          }

          // Настраиваем ссылку входа
          setupLoginLink();
        }, 100);
      })
      .catch((error) => {
        loginError.textContent = error.message;
        loginError.style.display = "block";
      })
      .finally(() => {
        loginButton.disabled = false;
        loginButton.textContent = "Войти";
      });
  });

  // Регистрация
  registerButton?.addEventListener("click", () => {
    const nameValue = registerName.value.trim();
    const loginValue = registerLogin.value.trim();
    const passwordValue = registerPassword.value.trim();

    if (!nameValue || !loginValue || !passwordValue) {
      registerError.textContent = "Заполните все поля";
      registerError.style.display = "block";
      return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Регистрация...";

    register({ name: nameValue, login: loginValue, password: passwordValue })
      .then(() => {
        return getComments();
      })
      .then((comments) => {
        currentComments.length = 0;
        currentComments.push(...comments);

        // Рендерим комментарии с формой для авторизованных
        renderComments(container, comments, true);

        // Перенастраиваем все обработчики после рендеринга
        setTimeout(() => {
          console.log("🔄 Настройка обработчиков после регистрации");

          const textInput = document.getElementById("comment-input");
          const commentsList = document.getElementById("comments-list");

          if (commentsList) {
            setupEventListeners(commentsList, textInput);
          }

          if (textInput) {
            setupFormHandlers(handleAddComment);
          }

          setupLoginLink();
        }, 100);
      })
      .catch((error) => {
        registerError.textContent = error.message;
        registerError.style.display = "block";
      })
      .finally(() => {
        registerButton.disabled = false;
        registerButton.textContent = "Зарегистрироваться";
      });
  });
}
