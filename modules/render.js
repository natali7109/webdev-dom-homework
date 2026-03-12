import { getUserName } from "./auth.js";

function getCurrentUserName() {
  return getUserName();
}

export function renderComments(container, comments, showForm = false) {
  const commentsHtml = comments
    .map((comment) => {
      const likeClass = comment.isLiked ? "-active-like" : "";

      return `<li class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div>${comment.author.name}</div>
          <div>${new Date(comment.date).toLocaleString()}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${likeClass}" data-id="${comment.id}"></button>
          </div>
        </div>
      </li>`;
    })
    .join("");

  // Кнопка выхода (только для авторизованных)
  const logoutButtonHtml = showForm
    ? `
    <div class="logout-section">
      <div class="logout-button-wrapper">
        <button class="add-form-button" id="logout-button">Выйти</button>
      </div>
    </div>
  `
    : "";

  const addFormHtml = showForm
    ? `
    <!-- Форма для ввода комментария -->
    <div class="add-form" id="comment-form">
      <input 
        type="text" 
        class="add-form-name" 
        id="user-name-input"
        value="${getUserName()}" 
        readonly
        style="background-color: rgba(255, 255, 255, 0.1); color: white; opacity: 0.9;"
      />
      <textarea
        type="textarea"
        class="add-form-text"
        id="comment-input"
        placeholder="Введите ваш комментарий"
        rows="4"
      ></textarea>
      <div class="add-form-row">
        <button class="add-form-button" id="add-button">Написать</button>
      </div>
    </div>
    
    <!-- Лоадер отдельно от формы -->
    <div class="form-loading" style="display: none;" id="adding-message">
      Комментарий добавляется...
    </div>`
    : `<div class="login-prompt">
        <p>Чтобы добавить комментарий, <a href="#" class="login-link" id="show-login-link">войдите</a></p>
      </div>`;

  const fullHtml = `
    ${logoutButtonHtml}
    <ul class="comments" id="comments-list">
      ${commentsHtml}
    </ul>
    ${addFormHtml}
    <div class="loader" style="display: none;" id="loader">Загрузка комментариев...</div>
  `;

  container.innerHTML = fullHtml;
}

export function renderLoginForm(container) {
  const loginHtml = `
    <div class="add-form" style="margin-top: 20px;">
      <h3 style="margin-bottom: 15px; color: white; text-align: center;">Форма входа</h3>
      
      <input 
        type="text" 
        id="login-input" 
        class="add-form-name" 
        placeholder="Логин" 
        style="width: 100%; margin-bottom: 10px;"
      />
      
      <input 
        type="password" 
        id="password-input" 
        class="add-form-name" 
        placeholder="Пароль" 
        style="width: 100%; margin-bottom: 10px;"
      />
      
      <div class="login-error" id="login-error" style="display: none; color: #ff6b6b; margin-bottom: 10px; text-align: center;"></div>
      
      <div class="add-form-row">
        <button class="add-form-button" id="login-button">Войти</button>
      </div>
      
      <p style="text-align: center; margin-top: 15px; color: white;"> 
        <a href="#" id="show-register" style="color: white;">Зарегистрироваться</a>
      </p>
    </div>

    <div class="add-form" id="register-form" style="display: none; margin-top: 20px;">
      <h3 style="margin-bottom: 15px; color: white; text-align: center;">Регистрация</h3>
      
      <input 
        type="text" 
        id="register-name" 
        class="add-form-name" 
        placeholder="Имя" 
        style="width: 100%; margin-bottom: 10px;"
      />
      
      <input 
        type="text" 
        id="register-login" 
        class="add-form-name" 
        placeholder="Логин" 
        style="width: 100%; margin-bottom: 10px;"
      />
      
      <input 
        type="password" 
        id="register-password" 
        class="add-form-name" 
        placeholder="Пароль" 
        style="width: 100%; margin-bottom: 10px;"
      />
      
      <div class="login-error" id="register-error" style="display: none; color: #ff6b6b; margin-bottom: 10px; text-align: center;"></div>
      
      <div class="add-form-row">
        <button class="add-form-button" id="register-button">Зарегистрироваться</button>
      </div>
      
      <p style="text-align: center; margin-top: 15px; color: white;">
        Уже есть аккаунт? 
        <a href="#" id="show-login" style="color: #bcec30; text-decoration: none;">Войти</a>
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
      <a href="#" id="back-to-comments" style="color: #bcec30; text-decoration: none;">← Назад к комментариям</a>
    </div>
  `;

  container.innerHTML = loginHtml;
}

export function renderCommentsToContainer(comments) {
  const appContainer = document.getElementById("app-container");
  if (appContainer) {
    renderComments(appContainer, comments, true);
  } else {
    console.error("Контейнер app-container не найден!");
  }
}
