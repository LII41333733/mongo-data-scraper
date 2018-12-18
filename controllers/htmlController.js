const express = require('express')
const router = express.Router()
const Article = require('../models/Articles.js')
const axios = require('axios')
const cheerio = require('cheerio')



router.get('/', function (req, res) {
  axios.get(`https://www.si.com/nfl`)
    .then(function (html) {
      const $ = cheerio.load(html.data);

      $('.type-article').each(function (i, element) {


        let reviewObj = {
          blogLink: `https://www.si.com${$(element).children().find('.headline a').attr('href')}`,
          writer: $(element).find('.style-orange').text().trim(),
          title: $(element).children('.article-info').find('.media-heading').text().trim(),
          category: $(element).children('.article-info').find('.unskinned').text().trim(),
          description: $(element).find('.summary').text().trim(),
          imageURL: $(element).find('.inner-container img').attr('src')
        }

        let Review = new Article(reviewObj)

        Article.find({
          title: reviewObj.title
        }).exec(function (err, doc) {
          // console.log(doc)
          if (doc.length) {
            // console.log('Review already exists!')
          } else {
            Review.save(function (err, doc) {
              if (err) {
                console.log(err);
                res.send(err)
              } else {
                // console.log('review inserted')
              }
            })
          }
        }).catch(function (err) {
          console.log(err);
          res.send(err);
        })

      })
    }).catch(function (err) {
      console.log(err);
      res.send(err);
    }).then(function () {
      Article.find({}).populate('comments').sort({
        date: -1
      }).exec(function (err, doc) {
        // console.log(doc)
        if (err) {
          res.send(err)
        } else {
          let reviewList = {
            reviewList: doc
          }
          res.render('index', reviewList)
        }
      })
    }).catch(function (err) {
      console.log(err);
      res.send(err);
    })
})

router.get('/review/:id', function (req, res) {
  let id = req.params.id

  Article.find({
    _id: id
  }).populate('comments').exec(function (err, doc) {
    // console.log(doc)
    const review = doc[0]
    const blogLink = review.blogLink
    let comments = [...review.comments]
    axios.get(blogLink).then(function (html) {
      let $ = cheerio.load(html.data)
      let writer = review.writer
      let title = review.title
      let category = review.category
      let imageURL = review.imageURL
      let reviewText = $('.article.body').clone()

      let reviewBody = {
        writer: writer,
        title: title,
        category: category,
        reviewText: reviewText,
        blogLink: blogLink,
        imageURL: imageURL,
        comments: comments
      }

      res.render('review', reviewBody)
    })
  }).catch(err => {
    console.log(err);
    res.json(err);
  })
})

module.exports = router;