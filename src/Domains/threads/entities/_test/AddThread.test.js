const AddThread = require('../AddThread')

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Gojo Satoru',
    }

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'Gojo Satoru',
      body: Infinity,
      owner: 'owner-123',
    }

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Thread object correctly', () => {
    const payload = {
      title: 'Gojo Satoru',
      body: 'Kill by Sukuna',
      owner: 'owner-123',
    }

    const { title, body, owner } = new AddThread(payload)
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
    expect(owner).toEqual(payload.owner)
  })
})