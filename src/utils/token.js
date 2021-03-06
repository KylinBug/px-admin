import store from 'store';

const TOKEN = 'access-token';

export function setToken(token) {
  store.set(TOKEN, token);
}

export function getToken() {
  return store.get(TOKEN) || '';
}

export function removeToken() {
  store.remove(TOKEN);
}
