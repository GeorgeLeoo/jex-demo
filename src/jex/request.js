import axios from 'axios'
import utils from './utils'
import { getToken, setToken, setUid } from './auth'

const t = Math.round(new Date().getTime() / 1000)
const rand = utils.randomString()

let header = {
  'content-type': 'application/json',
  'X-Jex-Safe-Timestamp': t,
  'X-Jex-Noncestr-Key': rand
}

const request = axios.create({
  baseURL: 'http://localhost:5900/jex/',
  timeout: 12000,
  headers: header
})

request.interceptors.request.use(async config => {
  const token = getToken()
  if (token) {
    config.headers['X-Jex-Token'] = getToken()
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response interceptor
request.interceptors.response.use(
  response => {
    const url = response.config.url
    const data = response.data
    if (url === '/user/sign-in') {
      setToken(data.data.token)
      setUid(data.data.uid)
    }
    return data
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
