import fetch from 'node-fetch'
import Blossues from './index'

beforeEach(function () {
  window.fetch = fetch
})

it('should receive list of issues by original user with valid keys',
  async function () {
    const fetcher = new Blossues(
      'anqurvanillapy', 'anqurvanillapy.github.io', 'https:'
    )
    const data = await fetcher.next()

    expect(typeof data).toEqual('object')

    const nonUserPosts = data.filter(d => d.user !== fetcher.user)
    expect(nonUserPosts.length).toBe(0)

    if (data.length) {
      const validKeys = [
        'user', 'title', 'url', 'labels', 'created', 'updated', 'body'
      ]
      const post = data.pop()
      expect(validKeys.every(k => k in post)).toBeTruthy()
    }
  })

it('should be rejected if username/repository is invalid', async function () {
  const fetcher = new Blossues('anqurvanillapy', 'invalid', 'https:')
  await expect(fetcher.next()).rejects.toEqual({
    error: 'user/repo not found'
  })
})

it('should not contain any pull requests', async function () {
  const fetcher = await new Blossues('babel', 'babel', 'https:')
  const data = await fetcher.next()
  expect('pull_request' in data).not.toBeTruthy()
})
