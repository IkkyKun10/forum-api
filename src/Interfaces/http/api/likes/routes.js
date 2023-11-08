const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: {
      auth: 'forumapi_jwt'
    },
    handler: (request, h) => handler.actLikeUnlikeHandler(request, h)
  }
]

module.exports = routes
