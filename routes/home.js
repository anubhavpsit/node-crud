var express = require('express')
var router = express.Router()

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route
router.get('/', function (req, res) {
  //res.send('Birds home page')
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
router.get('/home', function (req, res) {
    //res.send('Birds home page')
    res.render('index', { title: 'Hey', message: 'Hello there!' })
  })
// define the about route
// router.get('/stores', function (req, res) {
//   res.send('About birds')
// })

module.exports = router