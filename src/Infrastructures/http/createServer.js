const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const ClientError = require('../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')
const users = require('../../Interfaces/http/api/users')
const authentications = require('../../Interfaces/http/api/authentications')
const threads = require('../../Interfaces/http/api/threads')
const comments = require('../../Interfaces/http/api/comments')
const config = require('../../Commons/config/config')
const replies = require('../../Interfaces/http/api/replies')

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response)

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  await server.register(Jwt)
  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    },
    {
      plugin: threads,
      options: { container }
    },
    {
      plugin: comments,
      options: { container }
    },
    {
      plugin: replies,
      options: { container }
    }
  ])

  return server
}

module.exports = createServer
