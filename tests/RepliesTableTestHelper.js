const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReplie ({
    id = 'replies-123',
    commentId = 'comment-123',
    owner = 'user-123',
    content = 'content balasan',
    date = '2023'
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, owner, content, date]
    }

    await pool.query(query)
  },

  async getReplieById (id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async deleteReplieById (id) {
    const query = {
      text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1',
      values: [id]
    }
    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}

module.exports = RepliesTableTestHelper
