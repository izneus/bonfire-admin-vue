import Cookies from 'js-cookie'

// todo 不同项目注意修改自己的键值，预防同框架项目互相干扰
const TokenKey = 'BF_TOKEN'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
