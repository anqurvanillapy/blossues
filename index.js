export default class Blossues {
  constructor (user, repo, schema='') {
    this._user = user
    this._repo = repo
    this._issueURL = `${schema}//api.github.com/repos/${user}/${repo}/issues`
    this._pagecnt = { next: 0, last: 0 }
  }

  get user () { return this._user }
  get repo () { return this._repo }
  get pageCount () { return this._pagecnt }

  next () {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(this._issueURL)
        if (!res.ok) reject({ error: 'user/repo not found' })

        const data = await res.json()
        const issues = data.filter(d => {
          // The issue should be created by the repo user and is not a PR. 
          return d.user.login === this._user && !('pull_request' in d)
        })
        
        const page = issues.map(d => {
          return {
            user: d.user.login,
            title: d.title,
            url: d.html_url,
            labels: d.labels,
            created: d.created_at,
            updated: d.updated_at,
            body: d.body
          }
        })

        resolve(page)
      } catch (e) {
        resolve({ error: `fetch error: ${e}` })
      }
    })
  }
}
