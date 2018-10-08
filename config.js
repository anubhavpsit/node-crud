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
  host: process.env.DATABASE_SERVER || '127.0.0.1',
  store_icon: 'tmp_images/store/{{store_id}}/store_logo/',
  product_icon: 'tmp_images/product/{{product_id}}/product_logo/',
  store_images: 'tmp_images/store/{{store_id}}/store_images/',
  s3url : 'https://s3.ap-south-1.amazonaws.com/ally-staging-images/'
}

// function(){
//   return database = {
//     database: process.env.DATABASE_NAME || 'unyde_api',
//     username: process.env.DATABASE_USER || 'root',
//     password: process.env.DATABASE_PASSWORD || 'Qwerty1!',
//     host: process.env.DATABASE_SERVER || '127.0.0.1',
//   }
// }
