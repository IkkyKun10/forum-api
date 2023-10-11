const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')

describe('Thread Repository Postgres Test', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser(
      {
        id: 'user-123',
        username: 'Gojokun',
        password: 'super_secret',
        fullname: 'Gojo Satoru'
      }
    )
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('add Thread Test', () => {
    it('should persist add thread and return thread correctly', async () => {
      const addThread = new AddThread(
        {
          title: 'Gojo Satoru',
          body: 'Kill by sukuna',
          owner: 'user-123'
        }
      )

      const fakeIdGen = () => '12345'

      const threadRepoPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)

      const actualAddedThread = await threadRepoPostgres.addThread(addThread)

      const thread = await ThreadsTableTestHelper.getThreadById('thread-12345')

      const expectedAddedThread = new AddedThread(
        {
          id: 'thread-12345',
          title: 'Gojo Satoru',
          body: 'Kill by sukuna',
          owner: 'user-123'
        }
      )
      expect(thread).toHaveLength(1)
      expect(actualAddedThread).toStrictEqual(expectedAddedThread)
    })

    describe('verify Thread existing Test', () => {
      beforeEach(async () => {
          await ThreadsTableTestHelper.addThread(
            {
              id: 'thread-54321',
              title: 'new title',
              body: 'new body',
              owner: 'user-123',
              date: '2023'
            }
          )
        }
      )

      afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
      })

      it('should throw NotFoundError when thread not found', async () => {
        const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {})

        await expect(threadRepoPostgres.verifyThreadExisting('thread-not-found-123')).rejects
          .toThrowError('Thread tidak ditemukan')
      })

      it('should resolve if thread exists', async () => {
        const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {})

        await expect(threadRepoPostgres.verifyThreadExisting('thread-54321')).toBeDefined()
        await expect(threadRepoPostgres.verifyThreadExisting('thread-54321')).resolves.toBeUndefined()
      })
    })

    describe('get Detail Thread Test', () => {
      beforeEach(async () => {
        await ThreadsTableTestHelper.addThread(
          {
            id: 'thread-4567890',
            title: 'new title',
            body: 'new body',
            owner: 'user-123',
            date: '2023'
          }
        )
      })

      afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
      })

      it('should return detail thread by id not found', async () => {
        const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {})
        const detailThreadById = threadRepoPostgres.getThreadById('thread-detail-not-found-123')

        await expect(detailThreadById).rejects.toThrowError('Thread tidak ditemukan')
      })

      it('should return detail thread by id correctly', async () => {
        const threadRepoPostgres = new ThreadRepositoryPostgres(pool, {})
        const detailThreadById = await threadRepoPostgres.getThreadById('thread-4567890')

        const expectedDetailThreadById = new GetDetailThread(
          {
            id: 'thread-4567890',
            title: 'new title',
            body: 'new body',
            owner: 'user-123',
            date: '2023',
            username: 'Gojokun',
            comments: []
          }
        )

        expect(detailThreadById).toStrictEqual(expectedDetailThreadById)
      })
    })
  })
})
