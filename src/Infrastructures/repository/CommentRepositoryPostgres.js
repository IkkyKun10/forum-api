const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const { isEmpty } = require('lodash')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment (payload) {
    const { threadId, username, content, owner } = payload
    const id = `comment-${this._idGenerator()}`
    const date = new Date()
    const isDeleted = false

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, threadId, username, date, content, isDeleted, owner],
    }

    const result = await this._pool.query(query)

    return new AddedComment(result.rows[0])
  }

  async verifyComment ({ commentId, owner }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    }

    const result = await this._pool.query(query)
    if (isEmpty(result.rows)) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk melihat ini')
    }
  }

  async findCommentById (commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Comment Not Found')
    }
  }

  async getAllCommentInThread (threadId) {
    const query = {
      text: `SELECT c.id, c.content, c.date, u.username, c.is_deleted FROM comments c INNER JOIN users u
              ON c.owner = u.id WHERE c.thread_id = $1
              ORDER BY c.date ASC`,
      values: [threadId],
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async deleteComment (commentId) {
    const query = {
      text: 'UPDATE comments set is_deleted = true WHERE id = $1 RETURNING id',
      values: [commentId],
    }

    const result = await this._pool.query(query)
    const { id } = result.rows[0]

    return {
      id
    }
  }
}

module.exports = CommentRepositoryPostgres