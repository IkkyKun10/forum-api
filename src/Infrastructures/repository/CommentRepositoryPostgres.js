const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment (payload) {
    const { threadId, content, owner, username } = payload
    const id = `comment-${this._idGenerator()}`
    const date = new Date()
    const isDeleted = false

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, threadId, username, date, content, isDeleted, owner]
    }

    const result = await this._pool.query(query)

    const addedComment = new AddedComment(result.rows[0])

    return addedComment
  }

  async verifyCommentIsOwnership ({ commentId, owner }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak punya akses untuk melakukan aksi ini')
    }
  }

  async getCommentById (commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan')
    }
  }

  async getCommentsByThreadId (threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.content, c.date, c.is_deleted FROM comments c 
             INNER JOIN users u ON c.owner = u.id WHERE c.thread_id = $1
              ORDER BY c.date, c.id ASC`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async verifyCommentsExisting (commentId, threadId) {
    const query = {
      text: 'SELECT * FROM comments where id = $1 AND thread_id = $2',
      values: [commentId, threadId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Comments tidak ditemukan')
    }
  }

  async deleteCommentById (commentId) {
    const query = {
      text: 'UPDATE comments set is_deleted = true WHERE id = $1 RETURNING id',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    const { id } = result.rows[0]

    return {
      id
    }
  }
}

module.exports = CommentRepositoryPostgres
