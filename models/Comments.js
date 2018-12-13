var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommentSchema = new Schema({
  name: {
    type: String
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

var Comment = mongoose.model('Comments', CommentSchema)

module.exports = Comment
