const express = require('express')
const router = express.Router()
const Article = require('../models/Articles.js')
const axios = require('axios')
const cheerio = require('cheerio')

var probe = require('probe-image-size');


router.get('/', function (req, res) {
  axios.get(`https://www.si.com/nfl`)
    .then(function (html) {
      const $ = cheerio.load(html.data);

      $('.type-article').each(function (i, element) {


        // let div = '';

        // probe(imageURL).then(result => {
        //   if (result.height < 300) {
        //     div = "small-div"
        //   } else {
        //     div = "big-div"
        //   }
        // });

        // console.log(div)

        let reviewObj = {
          link: `https://www.si.com${$(element).children().attr('href')}`,
          writer: $(element).find('.style-orange').text().trim(),
          title: $(element).children('.article-info').find('.media-heading').text().trim(),
          category: $(element).children('.article-info').find('.unskinned').text().trim(),
          // imageURL: $(element).find('.inner-container img').attr('src'),
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
        })

      })
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
  // let reviewUrl;
  Article.find({
    _id: id
  }).populate('comments').exec(function (err, doc) {
    let review = doc[0]
    let reviewUrl = review.url
    let comments = [...review.comments]
    axios.get(reviewUrl).then(function (html) {
      let $ = cheerio.load(html.data)
      let artist = review.artist
      let album = review.album
      let artwork = review.artwork
      let score = $('.score').text()
      let genre = $('.genre-list').text()
      genre = genre.replace(/([A-Z])/g, ' /$1').trim()
      let reviewText = $('.review-detail__text').clone()
      reviewText.find('.featured-tracks').remove()

      let reviewBody = {
        artist: artist,
        album: album,
        artwork: artwork,
        score: score,
        genre: genre,
        body: reviewText,
        url: reviewUrl,
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