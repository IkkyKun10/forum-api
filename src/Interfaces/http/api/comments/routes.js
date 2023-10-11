const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      auth: 'forumapi_jwt'
    },
    handler: (request, h) => handler.addCommentHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      auth: 'forumapi_jwt'
    },
    handler: (request, h) => handler.deleteCommentHandler(request, h)
  }
]

module.exports = routes
