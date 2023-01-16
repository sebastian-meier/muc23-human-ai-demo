const fs = require('fs')

global.__global = {
  env : {
    isProd: false,
    ...require('dotenv').config().parsed
  }
}
