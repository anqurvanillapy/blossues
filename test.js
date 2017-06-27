import fetch from 'node-fetch'
import Blossues from './index'

beforeEach(function () {
  window.fetch = fetch
})

it('should receive a list of issues from GitHub', async function () {
  const fetcher = new Blossues('anqurvanillapy', 'anqurvanillapy.github.io')
  const data = await fetcher.fetchPage()
  expect(data).toBeDefined()
})

it('should not contain any pull requests', async function () {
  const fetcher = new Blossues('babel', 'babel')
  const data = await fetcher.fetchPage()
  expect('pull_request' in data).not.toBeTruthy()
})

it('should be rejected if username/repository is invalid', async function () {
  const fetcher = new Blossues('anqurvanillapy', 'invalid')
  await expect(fetcher.fetchPage()).rejects.toEqual({
    error: 'user/repo not found'
  })
})
