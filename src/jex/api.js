import request from './request'
import URL from './url'

export function signIn (body) {
  return request({
    url: URL.SIGN_IN,
    method: 'post',
    data: body
  })
}

export function signUp (body) {
  return request({
    url: URL.SIGN_IN,
    method: 'post',
    data: body
  })
}

export function logout () {
  return request({
    url: URL.LOGOUT,
    method: 'post'
  })
}

export function current () {
  return request({
    url: URL.CURRENT,
    method: 'post'
  })
}

export function increment (tableName, body) {
  return request({
    url: URL.INCREMENT(tableName),
    method: 'post',
    data: body
  })
}

export function count (tableName, body) {
  return request({
    url: URL.COUNT(tableName),
    method: 'post',
    data: body
  })
}

export function getJex (tableName, body) {
  return request({
    url: URL.GET(tableName),
    method: 'post',
    data: body
  })
}

export function postJex (tableName, body) {
  return request({
    url: URL.POST(tableName),
    method: 'post',
    data: body
  })
}

export function deleteJex (tableName, body) {
  return request({
    url: URL.DELETE(tableName),
    method: 'post',
    data: body
  })
}
