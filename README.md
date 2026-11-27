# 🏥 连锁养老机构管理系统（YangLao）

> 一套面向**连锁化、集团化养老机构**的数字化整体解决方案 —— 从集团管控、营销获客、入住评估、护理执行到财务结算、智能物联、家属端服务，全流程闭环。

基于 [RuoYi](https://gitee.com/y_project) 前后端分离框架深度定制，后端采用 **Spring Boot 3 + Java 17**，前端 **Vue 3 + Element Plus**，移动端 **uni-app** 一套代码同时覆盖 App / 小程序 / H5。

⭐ 如果这个项目对你有帮助，欢迎点亮 Star，你的支持是我持续更新的动力！

---

## ✨ 项目亮点

### 🏢 真正的"连锁集团版"，而非单机构系统
- **集团 → 院区 → 楼栋 → 楼层 → 房间 → 床位** 六级数据权限与逐级下钻
- 集团驾驶舱：多院区入住率、营收、欠费率排名与异常预警看板
- 集团统一标准（护理等级、评估量表、费用科目、SOP 库）下发，院区引用可调价、超阈值自动触发总部审批
- 跨院区转住：档案与账户资金一键迁移

### 🛏️ 可视化床态图 + 床位全生命周期
- 色彩化床态卡片（空闲 / 预定 / 在住 / 请假 / 就医 / 留观 / 维修），悬浮即览老人护理等级、余额、慢病标签
- 预定→入住→换床→请假→退住完整链路，**换床自动按天分段重算费用**
- 床位收益分析、空床损失估算、未来 7/15/30 天空床预测

### 💰 业财一体的自动账单引擎
- 月度账单自动生成：在住状态 × 房型/护理等级矩阵定价 × 请假减免 × 日常消费
- 月中入住 / 退住 / 换床 / 调级 **按天分段计费**，杜绝人工算错
- 多级催费流程（系统消息 → 短信/微信 → 上报院长/总部）、坏账核销审批
- 老人资金账户 + 押金独立台账 + 退住一键结算（多退少补）
- 电子发票、POS / 微信 / 支付宝 / 银行代扣多通道对账

### 🩺 专业评估体系，对标政策标准
- 内置**民政部评估标准、长期护理保险评估标准**，量表模板可自定义下发
- 坠床、压疮（Braden）、噎食、烫伤、管路滑脱、走失等八大风险评估
- 评估结果自动联动自理能力 → 护理级别 → 餐饮类型
- 民政监管数据 / 年报数据按模板一键导出报送

### 👨‍⚕️ 护理闭环 + 移动端扫码执行
- 护理计划 → 任务生成 → **移动端扫码执行** → 工时统计 → 质控考核全链路
- 长期/临时医嘱、每日配药单、护理交接班、不良事件上报与整改闭环
- 护理执行自动扣减耗材库存，服务记录家属端实时可查

### 📡 智能物联（IoT）接入
- 智能床垫（呼吸/心率/离床）、雷达跌倒探测、门磁、定位手环、呼叫器统一接入
- 告警分级处置闭环：报警 → 派单 → 到场 → 处置 → 记录 → 自动通知家属
- 设备健康监控（离线 / 低电 / 未佩戴），夜间离床统计、报警时效分析

### 📞 内置呼叫中心（FreeSWITCH）
- 独立 `ruoyi-freeswitch` 模块，Web 软电话基于 SIP over WebSocket（sip.js）
- 点击拨号、通话弹屏、通话记录与线索自动关联

### 👪 家属端小程序/APP，让信任看得见
- 账单查看、在线充值、续费代扣授权、请假申请、探视预约、代点餐、物资商城
- 健康档案摘要与护理服务记录**按家属授权粒度可见**（健康/账单/探视权限独立开关）
- 满意度评价低分自动转工单，形成服务改进闭环

---

## 🧱 系统架构

```
yanglao/
├── RuoYi-Vue-springboot3/     # 后端服务（Spring Boot 3.5 / Java 17 / Maven 多模块）
│   ├── ruoyi-admin            # 管理后台入口
│   ├── ruoyi-elder            # ★ 养老核心业务模块（15大业务域）
│   ├── ruoyi-freeswitch       # ★ 呼叫中心模块（FreeSWITCH / ESL / WebSocket）
│   ├── ruoyi-system           # 系统管理（用户/角色/菜单/数据权限）
│   ├── ruoyi-framework        # 框架核心（安全/拦截/数据源）
│   ├── ruoyi-quartz           # 定时任务（账单生成、床位释放、告警巡检）
│   ├── ruoyi-generator        # 代码生成器
│   └── sql/                   # 数据库脚本（分阶段建表 + 模块化演示数据）
├── RuoYi-Vue3-master/         # 管理端前端（Vue 3.5 / Vite / Element Plus / ECharts）
├── RuoYi-App-master/          # 护理员工作台移动端（uni-app）
└── RuoYi-App-family/          # 家属端小程序/APP（uni-app）
```

## 🖥️ 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Spring Boot 3.5.16 · Java 17 · MyBatis · Druid · JWT · Quartz · SpringDoc |
| 管理前端 | Vue 3.5 · Vite · Element Plus · Pinia · ECharts · sip.js |
| 移动端 | uni-app（Vue2）· 一套代码编译 App / 微信小程序 / H5 |
| 数据库 | MySQL 8.0 · Redis |
| 语音呼叫 | FreeSWITCH · ESL · WebRTC |
| 物联接入 | 设备网关（ruoyi-elder gateway）· 告警推送 |

## 📋 功能模块总览

| 模块 | 核心能力 |
|------|----------|
| 集团总部管控 | 驾驶舱、集团标准库、审批流（折扣/转住/减免/坏账）、合并报表、民政报送 |
| 营销与 CRM | 多渠道线索、客户画像、参观/试住、渠道 ROI、转介绍分销 |
| 床位管理 | 可视化床态、全生命周期操作、收益分析、空床预测、维修消杀闭环 |
| 缴费与财务 | 矩阵定价、资金账户、自动账单引擎、多级催费、退住结算、发票对账 |
| 入住与退住 | 预约试住、电子签约、床头卡二维码、请假销假、外出就医、探视来访 |
| 档案与评估 | 老人档案、八项风险评估、健康档案、医生巡诊、合同管理 |
| 护理与医护 | 护理计划、扫码执行、医嘱、配药、排班、工时、质控考核、不良事件 |
| 餐饮膳食 | 菜品食谱、一周食谱大屏投放、报餐统计、个性化点餐、家属代点餐 |
| 康乐活动 | 活动计划、付费课程报名、志愿者管理与星级评定 |
| 物资设备 | 出入库、盘点、申领、固定资产、报修工单、集团集采、家属物资商城 |
| 智能物联 | 床垫/雷达/定位/呼叫接入、告警分级闭环、设备健康监控、IoT 报表 |
| 统计报表 | 运营、财务、营销、床位收益、经营利润表，全量支持 Excel 导出 |
| 系统管理 | 多院区多租户、数据权限隔离、操作审计、数据脱敏、隐私授权 |

> 完整功能清单见根目录 `功能需求清单`。

## 🚀 快速开始

### 环境要求
- JDK 17+ · Maven 3.6+ · MySQL 8.0+ · Redis 5+ · Node.js 18+
- （可选，启用呼叫中心）FreeSWITCH + mod_xml_curl

### 1. 初始化数据库
```sql
CREATE DATABASE yanglao DEFAULT CHARACTER SET utf8mb4;
```
按顺序导入 `RuoYi-Vue-springboot3/sql/` 下的脚本：
1. `ry_20260417.sql`、`quartz.sql` —— 框架基础表
2. `elder_phase1.sql` ~ `elder_phase10.sql` —— 养老业务表与菜单
3. `elder_callcenter.sql`、`elder_invoice.sql` —— 呼叫中心与发票
4. `elder_testdata_*.sql` —— 按需导入演示数据（床位/财务/护理/IoT 等）

### 2. 启动后端
修改 `ruoyi-admin/src/main/resources/application-druid.yml` 数据库连接与 Redis 配置：
```bash
cd RuoYi-Vue-springboot3
mvn clean package
java -jar ruoyi-admin/target/ruoyi-admin.jar
# Windows 也可直接运行 bin/ry.bat
```

### 3. 启动管理端
```bash
cd RuoYi-Vue3-master
npm install
npm run dev
```
访问 http://localhost:80 ，默认账号 `admin / admin123`

### 4. 移动端 / 家属端
- `RuoYi-App-master`（护理员端）、`RuoYi-App-family`（家属端）均为 **HBuilderX 工程**
- 用 HBuilderX 导入项目 → 修改 `config.js` 中的 `baseUrl` 指向后端地址 → 运行到浏览器 / 微信开发者工具
- 家属端演示账号：`test_js001 / admin123`

## 📸 功能预览

> （发布前建议补充：集团驾驶舱、床态图、账单引擎、护理执行、家属端截图）

| 集团驾驶舱 | 可视化床态图 | 自动账单 |
|---|---|---|
| ![](docs/screens/dashboard.png) | ![](docs/screens/bedmap.png) | ![](docs/screens/bill.png) |

## 🗺️ Roadmap

- [ ] 支付通道（微信/支付宝）沙箱联调示例
- [ ] 长护险结算对接完善版
- [ ] BI 经营预测（移动平均/季节性模型）
- [ ] 容器化一键部署（Docker Compose）
- [ ] 国际化多语言

## 🤝 贡献

欢迎 Issue 和 PR！

1. Fork 本项目
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'feat: add some feature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 发起 Pull Request

## 📮 联系方式

有任何使用问题、功能建议或合作意向，欢迎联系我：

- **微信 / QQ**：`hcs2201`

## 📄 许可证

本项目基于 [MIT](./LICENSE) 许可证开源，框架部分版权归 [若依 RuoYi](https://gitee.com/y_project) 所有。

---

<div align="center">

**如果这个项目对你有启发，请给我一个 ⭐ Star —— 这对我很重要！**

Made with ❤️ for 智慧养老行业

</div>
