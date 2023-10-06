const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    options: { auth: 'forumapi_jwt' },
    handler: (request, h) => handler.addThreadHandler(request, h)
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadByIdHandler(request, h)
  }
]

module.exports = routes
