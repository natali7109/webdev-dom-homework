export function renderLogin(container) {
  const loginHtml = `
    <div class="login-container">
      <h2>Вход</h2>
      
      <div class="login-form">
        <input 
          type="text" 
          id="login-input" 
          class="login-input" 
          placeholder="Логин" 
        />
        
        <input 
          type="password" 
          id="password-input" 
          class="login-input" 
          placeholder="Пароль" 
        />
        
        <div class="login-error" id="login-error" style="display: none; color: red;"></div>
        
        <button class="login-button" id="login-button">Войти</button>
        
        <p class="register-link">
          Нет аккаунта? 
          <a href="#" id="show-register">Зарегистрироваться</a>
        </p>
      </div>

      <div class="register-form" style="display: none;">
        <h2>Регистрация</h2>
        
        <input 
          type="text" 
          id="register-name" 
          class="login-input" 
          placeholder="Имя" 
        />
        
        <input 
          type="text" 
          id="register-login" 
          class="login-input" 
          placeholder="Логин" 
        />
        
        <input 
          type="password" 
          id="register-password" 
          class="login-input" 
          placeholder="Пароль" 
        />
        
        <div class="login-error" id="register-error" style="display: none; color: red;"></div>
        
        <button class="login-button" id="register-button">Зарегистрироваться</button>
        
        <p class="register-link">
          Уже есть аккаунт? 
          <a href="#" id="show-login">Войти</a>
        </p>
      </div>
    </div>
  `;

  container.innerHTML = loginHtml;
}
