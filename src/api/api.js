import host from './host.js'
// 区分开发和生产环境
// const ENV = process.env.NODE_ENV
let HOST = host

export default {
  HOST: HOST,
  // 公司名称
  COMPANY_LIST: HOST + '/ep/list.json',
  // 上传接口
  UPLOAD: HOST + '/file/upload.json',
  // 状态查询：报价/询价
  STATUS: HOST + '/selectSellHaseInfoStatusList.json',
  // 询价单：列表
  INQUIRY: HOST + '/inquiryquotation/list.json',
  // 报价单：列表
  OFFER: HOST + '/inquiryquotation/list.json',
  // 报价单(询价单)：修改状态
  OFFER_UPDATE: HOST + '/inquiryquotation/status.json',
  // 采购信息：添加
  BY_INPUT: HOST + '/haseinfo/insert.json',
  // 采购信息：修改
  BY_UPDATE: HOST + '/haseinfo/modify.json',
  // 采购信息：删除
  BY_DELETE: HOST + '/haseinfo/delete.json',
  // 采购信息：列表
  BY_MANAGE: HOST + '/haseinfo/list.json',
  // 采购信息：详情
  BY_PAGE: HOST + '/selectHaseInfo.json',
  // 销售信息：添加/修改
  SL_INPUT: HOST + '/info/updateOrSaveInfo.json',
  // 销售信息：列表
  SL_MANAGE: HOST + '/info/selectALLOrder.json',
  // 销售信息：详情
  SL_PAGE: HOST + '/info/detailsInfo.json',
  // 销售信息：删除
  SL_DELETE: HOST + '/info/delete.json',
  // 表单上传页面
  OR_UPLOAD: HOST + '/center/index.html#/personOrder'
}
