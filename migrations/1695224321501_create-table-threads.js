/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNUll: true
    },
    date: {
      type: 'TEXT',
      notNull: true
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    }
  })

  pgm.addConstraint(
    'threads',
    'fk_threads.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = pgm => {
  pgm.dropTable('threads')
  pgm.dropConstraint('threads', 'fk_threads.owner_users.id')
}
