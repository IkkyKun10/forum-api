const GetDetailThread = require('../GetDetailThread')

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'id-123',
      title: 'Gojo Satoru'
    }

    expect(() => new GetDetailThread(payload)).toThrowError('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 12345,
      title: 'Gojo Satoru',
      body: 12345,
      date: '2023-09-22',
      username: 'Gojokun',
      comments: []
    }

    expect(() => new GetDetailThread(payload)).toThrowError('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should get detail Thread correctly', () => {
    const payload = {
      id: 'id-123',
      title: 'Gojo Satoru',
      body: 'Kill by Sukuna',
      date: '2023-09-22',
      username: 'GojoKun',
      comments: []
    }

    const { id, title, body, date, username, comments } = new GetDetailThread(payload)

    expect(id).toEqual(payload.id)
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
    expect(date).toEqual(payload.date)
    expect(username).toEqual(payload.username)
    expect(comments).toEqual(payload.comments)
  })
})
