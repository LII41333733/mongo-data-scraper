const express = require('express')
const router = express.Router()
const Article = require('../models/Articles.js')
const axios = require('axios')
const cheerio = require('cheerio')

router.get('/', function (req, res) {
  axios.get(`https://www.si.com/subcategory/mmqb`)
    .then(function (html) {
    const $ = cheerio.load(html.data);
    // partial tile media image-top margin-24-bottom  type-article
    $('.type-article').each(function (i, element) {
      const link = $(element).children().attr('href')
      const artist = ($(element).children('.article-info').children('.article-info-extended').children('.byline').find('.style-orange').text().trim() == "") ? ("N/A") : ($(element).children('.article-info').children('.article-info-extended').children('.byline').find('.style-orange').text().trim())
      console.log(artist)
      const album = $(element).children('a.review__link').children('.review__title').find('h2.review__title-album').text()
      const artwork = $(element).find('img').attr('src')
      const reviewObj = {
        artist: artist,
        album: album,
        url: `http://www.pitchfork.com${link}`,
        artwork: artwork
      }
      // console.log(reviewObj);
      let Review = new Article(reviewObj)

      Article.find({
        album: reviewObj.album
      }).exec(function (err, doc) {
        if (doc.length) {
          console.log('Review already exists!')
        } else {
          Review.save(function (err, doc) {
            if (err) {
              console.log(err);
              res.send(err)
            } else {
              console.log('review inserted')
            }
          })
        }
      })
    })
  }).then(function () {
    Article.find({}).populate('comments').sort({
      date: -1
    }).exec(function (err, doc) {
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

module.exports = router