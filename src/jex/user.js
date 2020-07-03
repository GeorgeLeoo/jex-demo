import { current, logout, signIn, signUp } from './api'
import { isBoolean, isString } from './dataType'
import Error from './error'

class User {
  constructor () {
    // Whether to use captcha
    this._isUseCapture = false
    this.signType = {
      SIGN_IN: 'SIGN_IN',
      SIGN_UP: 'SIGN_UP'
    }
  }
  
  useCapture (flg) {
    if (!isBoolean(flg)) {
      throw new Error(Error.Type, 'The flg need a Boolean type.')
    }
    this.isUseCapture = flg
  }
  
  login (username, password, capture) {
    return this._sign({ signType: this.signType.SIGN_IN, username, password, capture })
  }
  
  register ({ username, password, capture, email, phone }) {
    return this._sign({ signType: this.signType.SIGN_UP, username, password, capture, email, phone })
  }
  
  _sign({ signType, username, password, capture, email, phone }) {
    if (!isString(username)) {
      throw new Error(Error.Type, 'The username need a String type.')
    }
    if (!isString(password)) {
      throw new Error(Error.Type, 'The password need a String type.')
    }
    if (!username) {
      throw new Error(Error.Param,'The username can not be undefined or "".')
    }
    if (!password) {
      throw new Error(Error.Param,'The password can not be undefined or "".')
    }
    const body = {
      username: username.trim(),
      password: password.trim()
    }
  
    if (signType === this.signType.SIGN_UP) {
      email && (body.email = email)
      phone && (body.phone = phone)
    }
  
    if (this.isUseCapture) {
      if (!isString(capture)) {
        throw new Error(Error.Type,'The capture need a String type.')
      }
      if (!capture) {
        throw new Error(Error.Param,'The capture code can not be undefined or "".')
      }
      body.capture = capture
    }
    if (signType === this.signType.SIGN_IN) {
      return signIn(body)
    } else if (signType === this.signType.SIGN_UP) {
      return signUp(body)
    } else {
      throw new Error(Error.Param, 'signType is wrong.')
    }
  }
  
  logout () {
    return logout()
  }
  
  current () {
    return current()
  }
}

export default function () {
  return new User()
}
