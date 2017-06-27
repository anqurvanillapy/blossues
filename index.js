export default class Blossues {
  constructor (username, repo) {
    this._username = username
    this._repo = repo
    this._issueURL = `https://api.github.com/repos/${username}/${repo}/issues`
    this._pagecnt = { next: 0, last: 0 }
  }

  get pageCount () { return this._pagecnt }

  fetchPage () {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(this._issueURL)
        if (!res.ok) reject({ error: 'user/repo not found' })

        const data = await res.json()
        let issues = data.filter(d => !('pull_request' in d))
        resolve(issues)
      } catch (e) {
        resolve({ error: `fetch error: ${e}` })
      }
    })
  }
}
