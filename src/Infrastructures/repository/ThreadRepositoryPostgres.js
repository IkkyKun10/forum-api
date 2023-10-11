const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread (payload) {
    const { title, body, owner } = payload
    const date = new Date()
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date]
    }

    const result = await this._pool.query(query)

    return new AddedThread(
      result.rows[0]
    )
  }

  async verifyThreadExisting (threadId) {
    const query = {
      text: 'SELECT * FROM threads where id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan')
    }
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.date, u.username FROM threads t
              INNER JOIN users u ON t.owner = u.id WHERE t.id = $1`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan')
    }

    return new GetDetailThread(
      {
        ...result.rows[0],
        comments: []
      }
    )
  }

  async getRepliesByThreadId (threadId) {
    const query = {
      text: `SELECT r.*, users.username FROM replies r
            LEFT JOIN comments c ON r.comment_id = c.id
            LEFT JOIN users ON r.owner = users.id
            WHERE c.thread_id = $1
            ORDER BY r.date ASC`,
      values: [threadId],
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = ThreadRepositoryPostgres
