import { count, deleteJex, getJex, increment, postJex } from './api'
import { isObject, isString, isNumber } from './dataType'
import Error from './error'

class Query {
  constructor (tableName) {
    // The name of the table is the same as the table name on the back end
    this.tableName = tableName
    this.queryOptions = {}
    this.orderOptions = {}
    this.selects = []
    this.unSelects = []
    this.equalOptions = {}
    this.orOptions = []
    this.andOptions = []
    this.statOptions = []
    this.referenceOptions = []
  }
  
  // statTo (operation, field) {
  //   const operationMap = {
  //     groupby: 'groupby',
  //     groupcoun: 'groupcoun',
  //     sum: 'sum',
  //     average: 'average',
  //     max: 'max',
  //     min: 'min',
  //     having: 'having',
  //   }
  // }
  
  /**
   * Associative table
   * format：
   * { 'tableName': { select:['column1', 'column2', ...], unselect: ['column3', 'column4', ...] } }
   * @param references: array
   */
  reference (...references) {
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
      options.map(option => {
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
  }
  
  /**
   * Counts a field.
   * @param _id: number
   * @param incrementObj: object
   * @returns {AxiosPromise}
   */
  increment (_id, incrementObj = {}) {
    if (!isString(_id)) {
      throw new Error(Error.Type, 'Parameter _id must be a string type.')
    }
    if (!_id) {
      throw new Error(Error.Param, 'Parameter _id can not be empty string.')
    }
    if (Object.keys(incrementObj).length === 0) {
      throw new Error(Error.Param, 'At a minimum, set the field name of the increment')
    }
    return increment(this.tableName, { _id, incrementObj })
  }
  
  /**
   *
   * @param skipNumber: number
   */
  skip (skipNumber) {
    if (!isNumber(skipNumber)) {
      throw new Error(Error.Type, 'Parameter skipNumber need a number type.')
    }
    this.skipNumber = skipNumber
  }
  
  /**
   *
   * @param limitNumber: number
   */
  limit (limitNumber) {
    if (!isNumber(limitNumber)) {
      throw new Error(Error.Type, 'Parameter limitNumber need a number type.')
    }
    this.limitNumber = limitNumber
  }
  
  /**
   * set data
   * @param field: string
   * @param value: string
   */
  set (field, value) {
    if (!field) {
      throw new Error(Error.Type, 'Parameter field must be required.')
    }
    if (!value) {
      throw new Error(Error.Type, 'Parameter value must be required.')
    }
    this.queryOptions[field] = value
  }
  
  /**
   * order list
   * key only can be desc or asc
   * @param field: string
   * @param type: string
   */
  order (field, type) {
    const orderMap = ['desc', 'asc']
    if (!field) {
      throw new Error(Error.Type, 'Parameter field must be required.')
    }
    if (!type) {
      throw new Error(Error.Type, 'Parameter type must be required.')
    }
    if (orderMap.includes(type)) {
      this.orderOptions[field] = type
    } else {
      throw new Error('type类型不正确')
    }
  }
  
  /**
   * get list count
   * If condition is empty object, you will get all count.
   * @param condition: object [query condition]
   * @returns {AxiosPromise}
   */
  count (condition = {}) {
    return count(this.tableName, condition)
  }
  
  /**
   * Condition query of equal query.
   * @param field: string
   * @param operator: string
   * @param value: string
   * @returns {{}}
   */
  equalTo (field, operator, value) {
    if (!isString(field) || !isString(operator) || !isString(value)) {
      throw new Error(Error.Type, 'Parameter field, operator and value must be string type.')
    }
    if (!field || !operator || !value) {
      throw new Error(Error.Type, 'Parameter field, operator and value can not be empty string.')
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
  }
  
  /**
   * Condition query of or query.
   * @param querys: array
   */
  or (...querys) {
    if (querys.length === 0 ) {
      throw new Error(Error.Param, 'Parameters can not be empty.')
    }
    this.orOptions = querys
  }
  
  /**
   * Condition query of and query.
   * @param querys: array
   */
  and (...querys) {
    if (querys.length === 0 ) {
      throw new Error(Error.Param, 'Parameters can not be empty.')
    }
    this.andOptions = querys
  }
  
  /**
   * Set the columns you want.
   * Select and unSelect methods can only have one, who writes on top who is useful.
   * @param fields: array
   */
  select (...fields) {
    if (fields.length === 0 ) {
      throw new Error(Error.Param, 'Parameters can not be empty.')
    }
    if (this.unSelects.length === 0) {
      this.selects = fields
    }
  }
  
  /**
   * Set the columns you don't need.
   * @param fields： array
   */
  unSelect (...fields) {
    if (fields.length === 0 ) {
      throw new Error(Error.Param, 'Parameters can not be empty.')
    }
    if (this.selects.length === 0) {
      this.unSelects = fields
    }
  }
  
  /**
   * get data
   * This method can be used in conjunction with
   * [set, order, select, unSelect, and, or, equalTo, limit, skip, reference, statTo] method.
   * @param query： string | object
   * @returns {AxiosPromise}
   */
  get (query) {
    let body = {}
    if (isString(query)) {
      body.query = { _id: query }
    }
    if (isObject(query)) {
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
    
    if ((this.skipNumber && !this.limitNumber) || (!this.skipNumber && this.limitNumber)) {
      throw new Error(Error.Param, 'The skip method and limit method must exist at the same time.')
    }
    
    if (this.skipNumber && this.limitNumber) {
      body.page = {
        skipNumber: this.skipNumber,
        limitNumber: this.limitNumber
      }
    }
    
    if (Object.keys(this.orderOptions).length > 0) {
      body.order = this.orderOptions
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
    return getJex(this.tableName, body)
  }
  
  /**
   * save data
   * When there is only one argument, the data is inserted.
   * When there are two parameters, the data is modified.
   * When you need to modify a record,
   * the set method takes precedence over the save method.
   * This method can be used in conjunction with set method.
   * @param data: required
   * @param query: not always be required
   * @returns {AxiosPromise}
   */
  save (data = {}, query = {}) {
    if (!isObject(data) || !isObject(query)) {
      throw new Error(Error.Type, 'Parameter data or query need an object type.')
    }
    if (this.queryOptions._id) {
      query = { _id: this.queryOptions._id }
    }
    const keys = Object.keys(data)
    if (keys.length === 0) {
      throw new Error(Error.Param, 'Parameter data can not be empty object.')
    }
    const body = Object.assign({}, this.queryOptions, data, query)
    return postJex(this.tableName, body)
  }
  
  /**
   * remove data
   * If data is a string type, we need to pass in the _id of the record.
   * If data is a object type, we need to pass in
   * the other deletion conditions of the record.
   * This method can be used in conjunction with set method.
   * @param data： string | object
   * @returns {AxiosPromise}
   */
  remove (data) {
    if (!isString(data) || !isObject(data)) {
      throw new Error(Error.Type, 'Parameter data need string type or object type.')
    }
    let body = {}
    if (isString(data)) {
      if (!data) {
        throw new Error(Error.Param, 'Parameter data can not be empty string.')
      }
      body = {
        _id: data
      }
    }
    if (isObject(data)) {
      body = Object.assign({}, data, this.queryOptions)
      if (Object.keys(body).length === 0) {
        throw new Error(Error.Param, 'Parameter data can not be empty object.')
      }
    }
    return deleteJex(this.tableName, body)
  }
}

export default function (tableName) {
  return new Query(tableName)
}
