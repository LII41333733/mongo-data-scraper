const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  // author: just a string
  writer: {
    type: String
  },
  // title: just a string
  title: {
    type: String,
    // validate: {
    //   validator: function (v, cb) {
    //     Article.find({ album: v }, function (docs) {
    //       cb(docs.length === 0)
    //     })
    //   },
    //   message: 'Entry already exists!'
    // }
  },
 category: {
    type: String
  },
  imageURL: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ]
})

const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article
