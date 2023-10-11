const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    options: {
      auth: 'forumapi_jwt',
    },
    handler: (request, h) => handler.addReplieHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    options: {
      auth: 'forumapi_jwt',
    },
    handler: (request, h) => handler.deleteReplieByIdHandler(request, h)
  },
];

module.exports = routes;