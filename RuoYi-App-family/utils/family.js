/**
 * 家属端公共方法：当前老人缓存 + 字典文本映射 + 格式化
 * 枚举语义与后端表注释保持一致（elder_profile / health_record / nursing_task / bill / account_flow 等）
 */
const ELDER_KEY = 'family_current_elder'
import { listMyElders } from '@/api/family/portal'

let eldersCache = null

export function getCurrentElder() {
  const v = uni.getStorageSync(ELDER_KEY)
  return v ? String(v) : ''
}

export function setCurrentElder(elderId) {
  if (elderId) {
    uni.setStorageSync(ELDER_KEY, String(elderId))
  } else {
    uni.removeStorageSync(ELDER_KEY)
  }
}

/** 从老人列表里取当前选中的老人，失效则回退第一个 */
export function pickElder(elders) {
  if (!elders || !elders.length) return null
  const cur = getCurrentElder()
  const hit = elders.find(item => String(item.elderId) === String(cur))
  return hit || elders[0]
}

/** 拉取我的老人列表（带缓存） */
export function loadElderList(force) {
  if (eldersCache && !force) return Promise.resolve(eldersCache)
  return listMyElders().then(res => {
    eldersCache = res.data || []
    return eldersCache
  })
}

/** 取当前选中的老人卡片（带列表缓存），无绑定返回 null */
export function loadCurrentElder(force) {
  return loadElderList(force).then(list => {
    const hit = pickElder(list)
    if (hit) setCurrentElder(hit.elderId)
    return hit
  })
}

/** 老人列表变化时（如切换、退出登录）清缓存 */
export function clearElderCache() {
  eldersCache = null
}

/* ---------------- 字典文本 ---------------- */
export const GENDER = { '0': '男', '1': '女', '2': '未知' }

// elder_profile.status
export const LIVE_STATUS = { '0': '未入住', '1': '在住', '2': '请假', '3': '已退住' }
export const LIVE_STATUS_TAG = { '0': 'tag-gray', '1': 'tag-green', '2': 'tag-orange', '3': 'tag-gray' }

// elder_chronic_tag.chronic_code
export const CHRONIC = {
  'HYT': '高血压',
  'TNB': '糖尿病',
  'ZS0': '失智症',
  'PB0': '帕金森',
  'CVD': '心脑血管',
  'OPR': '骨质疏松'
}

// health_record.record_type
export const RECORD_TYPE = { '1': '体征', '2': '护理', '3': '体检', '4': '病历', '5': '随访' }

// nursing_task.status / time_slot
export const TASK_STATUS = { '0': '待执行', '1': '已执行', '2': '已取消' }
export const TASK_STATUS_TAG = { '0': 'tag-orange', '1': 'tag-green', '2': 'tag-gray' }
export const TIME_SLOTS = ['晨间', '午间', '晚间', '临睡前']

// bill.status
export const BILL_STATUS = { '0': '未结算', '1': '部分结算', '2': '已结算', '3': '已作废' }
export const BILL_STATUS_TAG = { '0': 'tag-red', '1': 'tag-orange', '2': 'tag-green', '3': 'tag-gray' }

// account_flow
export const FLOW_TYPE = { '1': '充值', '2': '押金', '3': '账单扣费', '4': '消费扣费', '5': '退费', '6': '押金退还', '7': '结息' }
export const PAY_WAY = { cash: '现金', wechat: '微信', alipay: '支付宝', bank: '银行转账', pos: 'POS', adjust: '系统调整' }

// consumption.settle_way
export const SETTLE_WAY = { '1': '余额即扣', '2': '计入月账单' }

// medical_order
export const ORDER_TYPE = { '1': '长期医嘱', '2': '临时医嘱' }
export const ORDER_STATUS = { '0': '执行中', '1': '已停', '2': '已作废' }
export const ORDER_STATUS_TAG = { '0': 'tag-green', '1': 'tag-gray', '2': 'tag-red' }
export const FREQ = { qd: '每日1次', bid: '每日2次', tid: '每日3次', qid: '每日4次', qn: '每晚1次', qw: '每周1次', prn: '必要时', st: '立即' }

// risk_tag
export const RISK_TYPE = { '1': '跌倒', '2': '压疮', '3': '噎食', '4': '走失', '5': '自伤', '6': '烫伤', '7': '管路滑脱', '8': '其他' }
export const RISK_LEVEL = { '1': '低风险', '2': '中风险', '3': '高风险' }
export const RISK_LEVEL_TAG = { '1': 'tag-blue', '2': 'tag-orange', '3': 'tag-red' }

// assessment
export const ASSESS_TYPE = { '1': '综合能力评估', '2': '风险评估', '3': '专项评估', '4': '复评' }
export const ASSESS_STATUS = { '0': '草稿', '1': '已定稿' }

// doctor_visit
export const VISIT_TYPE = { '1': '例行巡诊', '2': '会诊', '3': '转诊' }

// adverse_event
export const ADVERSE_TYPE = { '1': '跌倒', '2': '压疮', '3': '噎食', '4': '走失', '5': '烫伤', '6': '管路滑脱', '7': '自伤/他伤', '8': '其他' }
export const ADVERSE_LEVEL = { '1': '轻微', '2': '中度', '3': '严重' }
export const ADVERSE_LEVEL_TAG = { '1': 'tag-blue', '2': 'tag-orange', '3': 'tag-red' }
export const ADVERSE_STATUS = { '0': '已上报', '1': '处置中', '2': '已闭环' }
export const ADVERSE_STATUS_TAG = { '0': 'tag-orange', '1': 'tag-blue', '2': 'tag-green' }

// handover_record
export const HANDOVER_STATUS = { '0': '待确认', '1': '已接班' }

// pay_order
export const PAY_STATUS = { '0': '待支付', '1': '已支付', '2': '已关闭', '3': '已退款' }
export const PAY_STATUS_TAG = { '0': 'tag-orange', '1': 'tag-green', '2': 'tag-gray', '3': 'tag-blue' }
export const PAY_TYPE = { wechat: '微信支付', alipay: '支付宝', cash: '现金', bank: '银行转账', pos: 'POS' }

/* ---------------- 格式化 ---------------- */
export function fmtDate(value) {
  if (!value) return '--'
  const s = String(value)
  if (s.indexOf('T') > -1) return s.slice(0, 10)
  return s.slice(0, 10)
}

export function fmtDateTime(value) {
  if (!value) return '--'
  const s = String(value)
  if (s.indexOf('T') > -1) return s.slice(0, 16).replace('T', ' ')
  return s.slice(0, 16)
}

/** 金额：保留 2 位并补 0，空值给 0.00 */
export function money(value) {
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

/** 今天/昨天的日期字符串 yyyy-MM-dd */
export function dayString(offset) {
  const d = new Date()
  if (offset) d.setDate(d.getDate() + offset)
  const m = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)
  return d.getFullYear() + '-' + m + '-' + day
}

/** 取收缩压（血压字符串 130/78） */
export function systolic(bloodPressure) {
  if (!bloodPressure) return null
  const v = parseInt(String(bloodPressure).split('/')[0], 10)
  return isNaN(v) ? null : v
}

export default {
  getCurrentElder,
  setCurrentElder,
  pickElder,
  loadElderList,
  loadCurrentElder,
  clearElderCache,
  fmtDate,
  fmtDateTime,
  money,
  dayString,
  systolic
}
