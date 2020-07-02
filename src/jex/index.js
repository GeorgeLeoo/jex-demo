const Jex = function () {}
const request = axios.create({
  baseURL: 'http://localhost:5900/jex/',
  timeout: 12000
})
Jex.User = function () {
  this.isUseCapture = false
  return {
    useCapture: (flg) => {
      this.isUseCapture = flg
    },
    login: (username, password, capture) => {
      return new Promise((resolve, reject) => {
        if (!username) {
          reject('用户名不能为空')
          return
        }
        if (!password) {
          reject('密码不能为空')
          return
        }
        const body = {
          username: username.trim(),
          password: password.trim()
        }
        if (this.isUseCapture) {
          if (!capture) {
            reject('验证码不能为空')
            return
          }
          body.capture = capture
        }
        request({
          url: `/user/sign-in`,
          method: 'post',
          data: body
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    register: ({ username, password, capture, email, phone }) => {
      return new Promise((resolve, reject) => {
        if (!username) {
          reject('用户名不能为空')
          return
        }
        if (!password) {
          reject('密码不能为空')
          return
        }
        const body = {
          username: username.trim(),
          password: password.trim()
        }
        email && (body.email = email)
        phone && (body.phone = phone)
        
        if (this.isUseCapture) {
          if (!capture) {
            reject('验证码不能为空')
            return
          }
          body.capture = capture
        }
        request({
          url: `/user/sign-up`,
          method: 'post',
          data: body
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout: () => {
      return new Promise((resolve, reject) => {
        request({
          url: `/user/logout`,
          method: 'post'
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    current: () => {
      return new Promise((resolve, reject) => {
        request({
          url: `/user/current`,
          method: 'post'
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
Jex.Query = function (tableName) {
  this.tableName = tableName
  this.map = {}
  this.order = {}
  this.selects = []
  this.unSelects = []
  this.equalOptions = {}
  this.orOptions = []
  this.andOptions = []
  this.statOptions = []
  this.referenceOptions = []
  
  return {
    statTo(operation, field) {
      const operationMap = {
        groupby: 'groupby',
        groupcoun: 'groupcoun',
        sum: 'sum',
        average: 'average',
        max: 'max',
        min: 'min',
        having: 'having',
      }
    },
    /**
     * 关联表
     * 格式：
     * { 'TableName': { select:['column1', 'column2', ...], unselect: ['column3', 'column4', ...] } }
     * TableName: 表名
     * select：要显示字段名称
     * unselect： 不要显示字段名称
     */
    reference: (...references) => {
      // [{ 'Users': { select: ['username', 'email'], unselect: ['password'] } }]
      const simple = references.every(v => typeof v === 'string')
      if (simple) {
        references.map(path => {
          this.referenceOptions.push({ path })
        })
        return
      }
      references.map(v => {
        const ref = Object.keys(v)[0]
        const refValue = v[ref]
        const refObject = { path: ref }
        const options = Object.keys(refValue)
        const select = {}
        options.map( option => {
          if (option === 'select') {
            refValue[option].map(val => {
              select[val] = 1
            })
          }
          if (option === 'unselect') {
            refValue[option].map(val => {
              select[val] = 0
            })
          }
        })
        if (Object.keys(select).length !== 0) {
          refObject.select = select
        }
        this.referenceOptions.push(refObject)
      })
    },
    increment: (_id, incrementObj = {}) => {
      return new Promise(((resolve, reject) => {
        if (typeof _id !== 'string') {
          reject('_id必须是字符串')
          return
        }
        if (!_id) {
          reject('_id不能为空')
          return
        }
        if (Object.keys(incrementObj).length === 0) {
          reject('至少要设置计数的字段名称')
          return
        }
        request({
          url: `/increment/${this.tableName}`,
          method: 'post',
          data: {
            _id,
            incrementObj
          }
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      }))
    },
    skip: (skipNumber) => {
      this.skipNumber = skipNumber
    },
    limit: (limitNumber) => {
      this.limitNumber = limitNumber
    },
    set: (key, value) => {
      this.map[key] = value
    },
    // 排序
    order: (key, type) => {
      if (['desc', 'asc'].includes(type)) {
        this.order[key] = type
      } else {
        throw new Error('type类型不正确')
      }
    },
    // 获取数量
    count: (condition = {}) => {
      return new Promise((resolve, reject) => {
        request({
          url: `/get/count/${this.tableName}`,
          method: 'post',
          data: condition
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 比较函数
     * @param field 字段名
     * @param operator  操作符 >、<、===、<=、>=、!==
     * @param value 字段值
     */
    equalTo: (field, operator, value) => {
      if (!field || !operator || !value) {
        throw new Error('参数一个都不能少')
      }
      const operatorMap = {
        '>': '$gt',
        '<': '$lt',
        '===': '$eq',
        '>=': '$gte',
        '<=': '$lte',
        '!==': '$ne',
      }
      const equalOptionsValue = this.equalOptions[field]
      if (equalOptionsValue) {
        equalOptionsValue[operatorMap[operator]] = value
      } else {
        this.equalOptions[field] = { [operatorMap[operator]]: value }
      }
      return { [field]: { [operatorMap[operator]]: value } }
    },
    // 或查询
    or: (...querys) => {
      this.orOptions = querys
    },
    // 且查询
    and: (...querys) => {
      this.andOptions = querys
    },
    // select 和 unSelect 只能有一个，谁写在上面谁有用
    // 查询指定列
    select: (...fields) => {
      if (this.unSelects.length === 0) {
        this.selects = fields
      }
    },
    // 那些列不选
    unSelect: (...fields) => {
      if (this.selects.length === 0) {
        this.unSelects = fields
      }
    },
    // 查询
    get: (query) => {
      return new Promise((resolve, reject) => {
        let body = {}
        if (typeof query === 'string') {
          body.query = query
        }
        if (typeof query === 'object') {
          body = {
            query
          }
        }
        
        if (this.orOptions.length === 0 && this.andOptions.length === 0) {
          if (Object.keys(this.equalOptions).length > 0) {
            body.query = Object.assign({}, body.query, this.equalOptions)
          }
        }
        
        if (this.orOptions.length > 0) {
          body.query = Object.assign({}, body.query, { $or: this.orOptions })
        }
        
        if (this.andOptions.length > 0) {
          body.query = Object.assign({}, body.query, { $and: this.andOptions })
        }
        
        body.page = {
          skipNumber: this.skipNumber,
          limitNumber: this.limitNumber
        }
        if (Object.keys(this.order).length > 0) {
          body.order = this.order
        }
        if (this.selects.length > 0) {
          body.selects = this.selects
        }
        if (this.unSelects.length > 0) {
          body.unSelects = this.unSelects
        }
        if (this.referenceOptions.length > 0) {
          if (this.referenceOptions.length === 1) {
            body.reference = this.referenceOptions[0]
          } else {
            body.reference = this.referenceOptions
          }
        }
        request({
          url: `/get/${this.tableName}`,
          method: 'post',
          data: body
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 保存或更新
    save: (data = {}, query = {}) => {
      return new Promise((resolve, reject) => {
        if (this.map._id && Object.keys(query).length > 0) {
          reject('setId和query只能使用一个方法')
          return
        }
        if (this.map._id) {
          query = { _id: this.map._id }
        }
        const body = Object.assign({}, this.map, data)
        const keys = Object.keys(body)
        if (keys.length === 0) {
          reject('参数不能为空')
          return
        }
        request({
          url: `/post/${this.tableName}`,
          method: 'post',
          data: {
            data: body,
            query
          }
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除
    remove: (data) => {
      return new Promise((resolve, reject) => {
        let body = {}
        if (typeof data === 'string') {
          body._id = data
        }
        if (typeof data === 'object') {
          body = data
        }
        if (Object.keys(body).length === 0) {
          reject('请传入参数')
          return
        }
        request({
          url: `/delete/${this.tableName}`,
          method: 'post',
          data: body
        }).then((res) => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

Jex.File = function () {
  return {
    save: () => {}
  }
}
