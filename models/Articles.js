const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  // author: just a string
  artist: {
    type: String
  },
  // title: just a string
  album: {
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
  artwork: {
    type: String
  },
  url: {
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
