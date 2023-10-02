const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'Gojokun',
      password: 'super_secret',
      fullname: 'Gojo Satoru'
    })
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist add thread and return thread correctly', async () => {
      const addThreadPayload = new AddThread({
        title: 'Gojo Satoru',
        body: 'Kill by sukuna',
        owner: 'user-123'
      })

      const addNewThread = {
        ...addThreadPayload,
        date: '2023',
      }

      const fakeIdGen = () => '123'

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)

      const addedThread = await threadRepositoryPostgres.addThread(addNewThread)

      const thread = await ThreadsTableTestHelper.getDetailThread('thread-123')
      expect(thread).toHaveLength(1)
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Gojo Satoru',
        body: 'Kill by sukuna',
        owner: 'user-123',
      }))
    })

    describe('getDetailThread function', () => {
      beforeEach(async () => {
        await ThreadsTableTestHelper.addThread({
          id: 'thread-456',
          title: 'new title',
          body: 'my body',
          owner: 'user-123',
          date: '2023',
        })
      })

      afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
      })

      it('should return detail thread correctly', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
        const detailThread = await threadRepositoryPostgres.getDetailThread('thread-456')

        expect(detailThread).toStrictEqual(new GetDetailThread({
          id: 'thread-456',
          title: 'new title',
          body: 'my body',
          owner: 'user-123',
          date: '2023',
          username: 'Gojokun',
          comments: [],
        }))
      })
    })

    describe('verifyThreadAvaibility function', () => {
      beforeEach(async () => {
        await ThreadsTableTestHelper.addThread({
          id: 'thread-321',
          title: 'new title',
          body: 'my body',
          owner: 'user-123',
          date: '2023'
        })
      })

      afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
      })

      it('should resolve if thread exists', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        await expect(threadRepositoryPostgres.verifyThreadAvaibility('thread-321')).resolves.toBeUndefined()

      })

      it('should throw NotFoundError when thread not found', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

        await expect(threadRepositoryPostgres.verifyThreadAvaibility('thread-not-found-123')).rejects
          .toThrowError('Thread not found')
      })
    })
  })
})