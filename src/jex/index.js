import Query from './query'
import User from './user'
import File from './file'
import utils from './utils'

const Jex = global.Jex || {}

Jex.Query = Query
Jex.User = User
Jex.File = File

Jex.utils = utils

export default Jex
