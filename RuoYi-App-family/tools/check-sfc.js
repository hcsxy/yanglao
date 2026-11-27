/**
 * 家属端 SFC 语法自检（不依赖 HBuilderX）
 * 用法：node tools/check-sfc.js
 * 依赖：借用 RuoYi-Vue3-master/node_modules 下的 @vue/compiler-sfc、@babel/parser
 */
const fs = require('fs')
const path = require('path')
const DEPS = path.resolve(__dirname, '../../RuoYi-Vue3-master/node_modules')
const sfc = require(path.join(DEPS, '@vue/compiler-sfc'))
const babel = require(path.join(DEPS, '@babel/parser'))

const ROOT = path.resolve(__dirname, '..')
const files = []
;(function walk(dir) {
  fs.readdirSync(dir).forEach(name => {
    const full = path.join(dir, name)
    if (name === 'node_modules' || name === 'unpackage' || name === '.hbuilderx' || name === 'uni_modules') return
    if (fs.statSync(full).isDirectory()) return walk(full)
    if (name.endsWith('.vue') || name.endsWith('.js')) files.push(full)
  })
})(ROOT)

let bad = 0
files.forEach(file => {
  const rel = path.relative(ROOT, file)
  const src = fs.readFileSync(file, 'utf8')
  const problems = []
  if (file.endsWith('.vue')) {
    const { descriptor, errors } = sfc.parse(src, { filename: file })
    errors.forEach(e => problems.push('SFC: ' + e.message))
    if (descriptor.template && descriptor.template.content.trim()) {
      const r = sfc.compileTemplate({
        source: descriptor.template.content,
        filename: file,
        id: rel,
        compilerOptions: { isCustomElement: tag => tag.startsWith('uni-') || ['block', 'canvas', 'movable-view', 'swiper', 'swiper-item', 'scroll-view', 'rich-text', 'web-view', 'image', 'video'].includes(tag) }
      })
      ;(r.errors || []).forEach(e => problems.push('TEMPLATE: ' + (e.msg || e)))
    }
    if (descriptor.script && descriptor.script.content.trim()) {
      checkScript(descriptor.script.content, 'SCRIPT')
    }
    ;(descriptor.styles || []).forEach((s, i) => {
      if (s.lang === 'scss') {
        const open = (s.content.match(/{/g) || []).length
        const close = (s.content.match(/}/g) || []).length
        if (open !== close) problems.push('STYLE[' + i + ']: 花括号不匹配 ' + open + '/' + close)
      }
    })
  } else if (file.includes('pages') || file.includes('api') || file.includes('utils') || file.includes('store') || file.includes('plugins')) {
    checkScript(src, 'JS')
  }
  function checkScript(code, label) {
    try {
      babel.parse(code, { sourceType: 'module', plugins: ['jsx', 'optionalChaining', 'nullishCoalescingOperator'] })
    } catch (e) {
      problems.push(label + ': ' + e.message)
    }
  }
  if (problems.length) {
    bad++
    console.log('✗ ' + rel)
    problems.forEach(p => console.log('   ' + p))
  }
})
console.log('\n检查完成：' + files.length + ' 个文件，异常 ' + bad + ' 个')
