const http = require('http')
const net = require('net')

function req(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const headers = {}
    if (data) { headers['Content-Type'] = 'application/json'; headers['Content-Length'] = Buffer.byteLength(data) }
    if (token) headers['Authorization'] = 'Bearer ' + token
    const p = http.request({ host: '127.0.0.1', port: 8081, method, path, headers }, res => {
      let buf = ''
      res.on('data', d => buf += d)
      res.on('end', () => { try { resolve(JSON.parse(buf)) } catch (e) { resolve({ raw: buf.slice(0, 120) }) } })
    })
    p.on('error', reject)
    if (data) p.write(data)
    p.end()
  })
}
function redisGet(key) {
  return new Promise((resolve, reject) => {
    const s = net.connect(6379, '127.0.0.1')
    let buf = ''
    s.on('data', d => { buf += d.toString(); s.end() })
    s.on('error', reject)
    s.on('end', () => resolve((buf.split('\r\n').filter(x => x && !x.startsWith('$') && !x.startsWith('-'))[0] || '').replace(/^"|"$/g, '')))
    setTimeout(() => s.write('GET ' + key + '\r\n'), 50)
  })
}
;(async () => {
  for (const u of ['test_js001', 'test_js002', 'test_js005', 'test_js012', 'test_js004']) {
    const cap = await req('GET', '/captchaImage')
    const body = { username: u, password: 'admin123' }
    if (cap.captchaEnabled !== false) {
      body.code = await redisGet('captcha_codes:' + cap.uuid)
      body.uuid = cap.uuid
    }
    const r = await req('POST', '/login', null, body)
    let elders = '-'
    if (r.code === 200) {
      const e = await req('GET', '/elder/family/portal/elders', r.token)
      elders = (e.data || []).length + ' 位老人'
    }
    console.log(u + ' -> code=' + r.code + ' ' + (r.msg || '') + ' | ' + elders)
  }
})().catch(e => console.log('ERR', e.message))
