// 生成家属端 tabBar 图标（透明底、线性描边、双态配色）
// 用法：node tools/gen-tabbar-icons.js   输出到 static/images/tabbar/tab-*.png
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const SIZE = 81          // 像素尺寸
const SS = 4             // 超采样倍数（抗锯齿）
const STROKE = 6.5       // 描边宽度
const COLORS = { _: [0, 229, 255, 255], '': [107, 127, 153, 255] }

/* ---------------- PNG 编码 ---------------- */
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encodePng(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

/* ---------------- 几何图元 ---------------- */
function segDist(px, py, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1]
  const wx = px - a[0], wy = py - a[1]
  const d = vx * vx + vy * vy
  let t = d === 0 ? 0 : (wx * vx + wy * vy) / d
  t = t < 0 ? 0 : t > 1 ? 1 : t
  return Math.hypot(wx - t * vx, wy - t * vy)
}
function polyDist(px, py, pts, closed) {
  let min = 1e9
  const n = closed ? pts.length : pts.length - 1
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const d = segDist(px, py, a, b)
    if (d < min) min = d
  }
  return min
}
// 圆角矩形 → 折线
function roundRect(x, y, w, h, r, steps = 5) {
  const pts = []
  const corners = [
    [x + w - r, y + r, -90, 0], [x + w - r, y + h - r, 0, 90],
    [x + r, y + h - r, 90, 180], [x + r, y + r, 180, 270]
  ]
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = (a0 + ((a1 - a0) * i) / steps) * (Math.PI / 180)
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  return pts
}

/* ---------------- 图标定义（81x81 画布） ---------------- */
const ICONS = {
  // 概况：房屋
  'tab-home': (S) => [
    { poly: [[S * 0.10, S * 0.45], [S * 0.50, S * 0.12], [S * 0.90, S * 0.45]] },
    { poly: [[S * 0.19, S * 0.42], [S * 0.19, S * 0.86], [S * 0.81, S * 0.86], [S * 0.81, S * 0.42]] },
    { poly: [[S * 0.40, S * 0.86], [S * 0.40, S * 0.60], [S * 0.60, S * 0.60], [S * 0.60, S * 0.86]] }
  ],
  // 健康：心形
  'tab-health': (S) => {
    const pts = []
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      pts.push([S / 2 + x * S * 0.0345, S * 0.52 - y * S * 0.0345])
    }
    return [{ poly: pts, closed: true }]
  },
  // 护理动态：护理单（夹板 + 对勾）
  'tab-nursing': (S) => [
    { poly: roundRect(S * 0.17, S * 0.16, S * 0.66, S * 0.68, S * 0.08), closed: true },
    { poly: [[S * 0.34, S * 0.16], [S * 0.34, S * 0.09], [S * 0.66, S * 0.09], [S * 0.66, S * 0.16]] },
    { poly: [[S * 0.31, S * 0.52], [S * 0.44, S * 0.65], [S * 0.70, S * 0.36]] }
  ],
  // 费用：钱包
  'tab-bill': (S) => [
    { poly: roundRect(S * 0.10, S * 0.22, S * 0.80, S * 0.56, S * 0.10), closed: true },
    { poly: [[S * 0.10, S * 0.40], [S * 0.78, S * 0.40], [S * 0.78, S * 0.60], [S * 0.10, S * 0.60]] },
    { circle: [S * 0.66, S * 0.50], r: S * 0.045 }
  ],
  // 我的：人像
  'tab-mine': (S) => [
    { circle: [S * 0.5, S * 0.32], r: S * 0.17 },
    { poly: (() => {
      const pts = []
      for (let i = 0; i <= 40; i++) {
        const a = Math.PI * (1 + i / 40)
        pts.push([S * 0.5 + S * 0.30 * Math.cos(a), S * 0.92 + S * 0.34 * Math.sin(a)])
      }
      return pts
    })() }
  ]
}

/* ---------------- 渲染 ---------------- */
function render(def, rgba, rgb) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let cover = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS
          const py = y + (sy + 0.5) / SS
          let min = 1e9
          for (const p of def) {
            let d
            if (p.circle) {
              d = Math.abs(Math.hypot(px - p.circle[0], py - p.circle[1]) - p.r)
            } else {
              d = polyDist(px, py, p.poly, p.closed)
            }
            if (d < min) min = d
          }
          const a = Math.max(0, Math.min(1, STROKE / 2 + 0.5 - min))
          cover += a
        }
      }
      cover /= SS * SS
      const i = (y * SIZE + x) * 4
      if (cover <= 0.01) continue
      rgba[i] = rgb[0]
      rgba[i + 1] = rgb[1]
      rgba[i + 2] = rgb[2]
      rgba[i + 3] = Math.round(cover * 255)
    }
  }
}

const OUT = path.join(__dirname, '..', 'static', 'images', 'tabbar')
fs.mkdirSync(OUT, { recursive: true })
for (const [name, builder] of Object.entries(ICONS)) {
  const def = builder(SIZE)
  for (const [suffix, rgb] of Object.entries(COLORS)) {
    const rgba = Buffer.alloc(SIZE * SIZE * 4, 0)
    render(def, rgba, rgb)
    const file = path.join(OUT, name + suffix + '.png')
    fs.writeFileSync(file, encodePng(SIZE, SIZE, rgba))
    console.log('生成 ' + path.basename(file) + ' (' + fs.statSync(file).size + ' bytes)')
  }
}
console.log('完成，输出目录 ' + OUT)
