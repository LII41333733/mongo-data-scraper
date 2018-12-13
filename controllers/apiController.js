var express = require('express')
var router = express.Router()
var Article = require('../models/Articles.js')
var Comment = require('../models/Comments.js')

router.post('/', function (req, res) {
  let commentBody = {
    name: req.body.name,
    comment: req.body.comment
  }
  var newComment = new Comment(commentBody)

  // Save the new book in the books collection
  newComment.save(function (err, comment) {
    // Send an error to the browser if there's something wrong
    if (err) {
      res.send(err)
    } else {
      Article.findOneAndUpdate({'url': req.body.url}, {
        $push: {
          'comments': comment._id
        }
      }, {
        new: true
      }, function (error, doc) {
        if (error) {
          res.send(error)
        } else {
          res.json(comment)
        }
      })
    }
  })
})

module.exports = router
