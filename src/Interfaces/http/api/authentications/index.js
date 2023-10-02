const routes = require('./routes')
const AuthenticationsHandler = require('./handler')

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container)
    server.route(routes(authenticationsHandler))
  }
}
