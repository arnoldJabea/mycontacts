const KEY = 'mycontacts.token'

export function getToken() {
  return localStorage.getItem(KEY)
}

export function setToken(token) {
  localStorage.setItem(KEY, token)
}

export function logout() {
  localStorage.removeItem(KEY)
}
