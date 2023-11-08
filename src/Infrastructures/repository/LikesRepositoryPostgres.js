const LikesRepository = require('../../Domains/likes/LikesRepository')

class LikesRepositoryPostgres extends LikesRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addLikeComment (payload) {
    const { commentId, owner } = payload
    const id = `like-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, owner]
    }

    const { rowCount } = await this._pool.query(query)

    return rowCount
  }

  async verifyLikeComment (payload) {
    const { commentId, owner } = payload

    const query = {
      text: 'SELECT 1 FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)

    return result.rowCount
  }

  async getTotalLikeComment (commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [commentId]
    }

    const { rows } = await this._pool.query(query)

    return rows
  }

  async unlikeComment (payload) {
    const { commentId, owner } = payload

    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)

    return result.rowCount
  }
}

module.exports = LikesRepositoryPostgres
