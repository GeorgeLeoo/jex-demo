export const SIGN_IN = `/user/sign-in`
export const SIGN_UP = `/user/sign-up`
export const LOGOUT = `/user/logout`
export const CURRENT = `/user/current`
export const FILE = `/user/file`
export const INCREMENT = (tableName) => `/increment/${tableName}`
export const COUNT = (tableName) => `/get/count/${tableName}`
export const GET = (tableName) => `/get/${tableName}`
export const POST = (tableName) => `/post/${tableName}`
export const DELETE = (tableName) => `/delete/${tableName}`

export default {
  SIGN_IN,
  SIGN_UP,
  LOGOUT,
  CURRENT,
  INCREMENT,
  COUNT,
  GET,
  POST,
  DELETE
}
