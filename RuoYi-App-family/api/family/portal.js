import request from '@/utils/request'

const BASE = '/elder/family/portal'

// ==================== 我的老人 / 概况 ====================

// 我的老人列表
export function listMyElders() {
  return request({ url: BASE + '/elders', method: 'get' })
}

// 当前家属对该老人的授权范围
export function getAuthScope(elderId) {
  return request({ url: BASE + '/auth/' + elderId, method: 'get' })
}

// 首页概况汇总
export function getSummary(elderId) {
  return request({ url: BASE + '/summary/' + elderId, method: 'get' })
}

// 老人档案（已脱敏）
export function getProfile(elderId) {
  return request({ url: BASE + '/profile/' + elderId, method: 'get' })
}

// ==================== 健康 ====================

// 体征趋势（days 默认 30）
export function listVitals(elderId, days) {
  return request({ url: BASE + '/vitals/' + elderId, method: 'get', params: { days: days } })
}

// 健康记录（recordType：1体征 2护理 3体检 4病历 5随访）
export function listHealthRecords(elderId, params) {
  return request({ url: BASE + '/healthRecords/' + elderId, method: 'get', params: params })
}

// 能力评估记录
export function listAssessments(elderId) {
  return request({ url: BASE + '/assessments/' + elderId, method: 'get' })
}

// 医生巡诊记录
export function listDoctorVisits(elderId) {
  return request({ url: BASE + '/doctorVisits/' + elderId, method: 'get' })
}

// 风险标记
export function listRisks(elderId) {
  return request({ url: BASE + '/risks/' + elderId, method: 'get' })
}

// 不良事件（近 90 天）
export function listAdverse(elderId) {
  return request({ url: BASE + '/adverse/' + elderId, method: 'get' })
}

// ==================== 护理动态 ====================

// 某日护理任务
export function getNursingDaily(elderId, date) {
  return request({ url: BASE + '/nursingTasks/' + elderId, method: 'get', params: { date: date } })
}

// 近 N 天护理完成趋势
export function getNursingTrend(elderId, days) {
  return request({ url: BASE + '/nursingTrend/' + elderId, method: 'get', params: { days: days } })
}

// 交接班摘要
export function listHandovers(elderId, limit) {
  return request({ url: BASE + '/handovers/' + elderId, method: 'get', params: { limit: limit } })
}

// 医嘱清单
export function listMedicalOrders(elderId) {
  return request({ url: BASE + '/medicalOrders/' + elderId, method: 'get' })
}

// ==================== 费用 ====================

// 账单列表
export function listBills(elderId, status) {
  return request({ url: BASE + '/bills/' + elderId, method: 'get', params: { status: status } })
}

// 账单明细
export function getBill(billId) {
  return request({ url: BASE + '/bill/' + billId, method: 'get' })
}

// 消费明细
export function listConsumptions(elderId, params) {
  return request({ url: BASE + '/consumptions/' + elderId, method: 'get', params: params })
}

// 资金账户与流水
export function getAccount(elderId) {
  return request({ url: BASE + '/account/' + elderId, method: 'get' })
}

// ==================== 缴费 ====================

// 账单缴费下单（data: { bizId: 账单ID, amount: 金额(可空=全额), payType }）
export function payBill(data) {
  return request({ url: BASE + '/pay/bill', method: 'post', data: data })
}

// 余额充值下单（data: { elderId, amount, payType }）
export function payRecharge(data) {
  return request({ url: BASE + '/pay/recharge', method: 'post', data: data })
}

// 查询支付单
export function getPayOrder(payId) {
  return request({ url: BASE + '/pay/order/' + payId, method: 'get' })
}

// 沙箱渠道模拟支付（演示/联调用）
export function mockPay(payId) {
  return request({ url: BASE + '/pay/mock/' + payId, method: 'put' })
}
