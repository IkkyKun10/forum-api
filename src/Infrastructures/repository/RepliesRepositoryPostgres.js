const RepliesRepository = require('../../Domains/reply/RepliesRepository')
const AddedReplies = require('../../Domains/reply/entities/AddedReplies')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReplie (payload) {
    const { commentId, owner, content } = payload
    const id = `replies-${this._idGenerator()}`
    const date = new Date()

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, commentId, owner, content, date]
    }

    const result = await this._pool.query(query)

    const addedReplies = new AddedReplies(
      {
        ...result.rows[0],
        content,
        owner
      }
    )

    return addedReplies
  }

  async verifyReplieExisting (threadId, commentId, replieId) {
    const query = {
      text: `SELECT 1 FROM replies r
            INNER JOIN comments c ON r.comment_id = c.id
            WHERE r.id = $1 AND r.comment_id = $2
            AND c.thread_id = $3 AND r.is_deleted = false`,
      values: [replieId, commentId, threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Replies not fount')
    }

    const { rowCount } = result

    return rowCount
  }

  async verifyReplieOwner (id, owner) {
    const query = {
      text: 'SELECT 1 FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }

    const { rowCount } = result

    return rowCount
  }

  async deleteReplieById (id) {
    const query = {
      text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Replies not fount')
    }

    const { rowCount } = result

    return rowCount
  }
}

module.exports = RepliesRepositoryPostgres
