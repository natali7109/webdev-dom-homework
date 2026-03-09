const TOKEN_KEY = "token";
const USER_KEY = "user";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

// СОХРАНЯЕМ ПОЛЬЗОВАТЕЛЯ
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ПОЛУЧАЕМ ПОЛЬЗОВАТЕЛЯ
export function getUser() {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

// ПОЛУЧАЕМ ИМЯ ПОЛЬЗОВАТЕЛЯ
export function getUserName() {
  const user = getUser();
  return user?.name || "";
}

export function login({ login, password }) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      throw new Error("Ошибка авторизации");
    })
    .then((data) => {
      setToken(data.user.token);
      setUser(data.user);
      return data;
    });
}

export function register({ login, password, name }) {
  return fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify({ login, password, name }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        return response.json().then((errorData) => {
          throw new Error(errorData.error || "Пользователь с таким логином уже существует");
        });
      }
      throw new Error("Ошибка регистрации");
    })
    .then((data) => {
      setToken(data.user.token);
      setUser(data.user);
      return data;
    });
}
