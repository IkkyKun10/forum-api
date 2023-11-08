const pool = require('../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
  async addLikes (
    {
      id = 'likes-111',
      commentId = 'comment-222',
      owner = 'user-333'
    }
  ) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner]
    }

    await pool.query(query)
  },

  async getLikeById (payload) {
    const { commentId, owner } = payload
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const { rows } = await pool.query(query)
    return rows[0]
  },

  async cleanTable () {
    await pool.query('DELETE FROM likes WHERE 1=1')
  }
}

module.exports = LikesTableTestHelper
