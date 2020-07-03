import Error from './error'
import request from './request'
import { FILE } from './url'
import { isString } from './dataType'

let list = []

class File {
  constructor (name, parma) {
    if (name && parma) {
      if (!isString(name)) {
        throw new Error(Error.Type)
      }
      let ext = name.substring(name.lastIndexOf('.') + 1)
      list.push({ name: name, route: `${FILE}/${new Date().getTime()}.${ext}`, data: parma })
    }
  }
  
  save () {
    if (!list.length) {
      throw new Error(Error.Type)
    }
    let fileObj
    fileObj = new Promise((resolve, reject) => {
      const data = []
      for (let item of list) {
        request(item.route, 'post', item.data).then((url) => {
          data.push(url)
          if (data.length === list.length) {
            list = []
            resolve(data)
            reject(data)
          }
        }).catch(err => {
          data.push(err)
        })
      }
    })
    return fileObj
  }
}

export default new File()
