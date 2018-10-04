// module.export = default {
//   database: {
//     database: process.env.DATABASE_NAME || 'unyde_api',
//     username: process.env.DATABASE_USER || 'root',
//     password: process.env.DATABASE_PASSWORD || 'Qwerty1!',
//     host: process.env.DATABASE_SERVER || 'localhost',
//   }
// };
module.exports.default = {
  database: process.env.DATABASE_NAME || 'unyde_api',
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'Qwerty1!',
  host: process.env.DATABASE_SERVER || '127.0.0.1'
}

// function(){
//   return database = {
//     database: process.env.DATABASE_NAME || 'unyde_api',
//     username: process.env.DATABASE_USER || 'root',
//     password: process.env.DATABASE_PASSWORD || 'Qwerty1!',
//     host: process.env.DATABASE_SERVER || '127.0.0.1',
//   }
// }
