import utils from './utils'
import axios from 'axios'

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

// response interceptor
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
