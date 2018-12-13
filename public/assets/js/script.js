$(document).ready(function () {
  $('.submit').on('click', function (e) {
    e.preventDefault()

    let commentName = $('.comment-name').val().trim()
    let commentBody = $('.comment').val().trim()
    let commentUrl = $('form').data('id').trim()

    let comment = {
      name: commentName,
      comment: commentBody,
      url: commentUrl
    }

    fetch('/api', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    }).then(result => {
      return result.json()
    }).then(data => {
    // console.log(data);
      let commentName = data.name
      let commentBody = data.comment

      let newCommentDiv = $('<div>').addClass('card-panel red lighten-2')
      let newCommentBody = $('<p>').addClass('white-text').html(commentBody)
      let newCommentName = $('<strong>').html(`Written by: ${commentName}`)

      newCommentDiv.append(newCommentBody).append(newCommentName)

      $('.comment-container').append(newCommentDiv)
    })

    $('.comment-name').val('')
    $('.comment').val('')
  })
})
