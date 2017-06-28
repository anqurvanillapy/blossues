import qs from 'querystring'

export default class Blossues {
  constructor (user, repo, scheme='') {
    this._u = user
    this._r = repo
    this._s = scheme
    this._pagecnt = { next: 0, last: 0 }
    this._perpage = 0
  }

  get user () { return this._u }
  get repo () { return this._r }

  set user (v) { this._u = v }
  set repo (v) { this._r = v }

  next () {
    let options = {}
    if (this._pagecnt.next) options.page = this._pagecnt.next
    if (this._perpage) options.per_page = this._perpage
    let url = `${this._s}//api.github.com/repos/${this._u}/${this._r}/issues`
    if (Object.keys(options).length) url += `?${qs.stringify(options)}`

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(url)
        if (!res.ok) reject({ error: 'user/repo not found' })

        this._parseLinkHeader(res.headers.get('link'))

        const data = await res.json()
        const issues = data.filter(d => {
          // The issue should be created by the repo user and is not a PR. 
          return d.user.login === this._u && !('pull_request' in d)
        })
        
        const page = issues.map(iss => {
          return {
            user: iss.user.login,
            title: iss.title,
            url: iss.html_url,
            labels: iss.labels,
            created: iss.created_at,
            updated: iss.updated_at,
            body: iss.body
          }
        })

        resolve(page)
      } catch (e) {
        reject({ error: `fetch error: ${e}` })
      }
    })
  }

  _parseLinkHeader (lh) {
    if (!lh) return

    const links = lh.split(',')
    links.forEach(link => {
      let [l, rel] = link.split('>; rel="')
      l = l.slice(l.indexOf('<') + 1)
      rel = rel.slice(0, -1)
      this._pagecnt[rel] = parseInt(qs.parse(l.split('?')[1]).page)
    })
  }
}
