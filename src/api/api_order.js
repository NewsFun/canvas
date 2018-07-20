import host from './host.js'
//  区分开发和生产环境
// const ENV = process.env.NODE_ENV
let HOST = host
let HOST_OA = host

export default {
  HOST: HOST,
  // 下拉列表
  tranportways: HOST + '/ordercommon/tranportways.json', // 运输方式
  oilvarieties: HOST + '/ordercommon/oilvarieties.json', // 油品类别
  oilppms: HOST + '/ordercommon/oilppms.json', // 油规格
  // 船燃订单（上游订单）买家
  buyerOrderUp: HOST + '/orderignition/buylist.json', // 分页列表
  listbycompany: HOST + '/orderignition/buylistbycompany.json', // 分页列表(按交易对手展示)
  ordersbycompany: HOST + '/orderignition/buyordersbycompany.json', // 查询要展开的订单
  // 卖家船燃订单（上游订单）
  selllist: HOST + '/orderignition/selllist.json', // 分页列表
  selllistbycompany: HOST + '/orderignition/selllistbycompany.json', // 分页列表(按交易对手展示)
  sellordersbycompany: HOST + '/orderignition/sellordersbycompany.json', // 查询要展开的订单

  // 船供订单（下游订单）
  // 买家
  supplybuylist: HOST + '/ordersupply/buylist.json', // 分页列表
  supplyBuylistbycompany: HOST + '/ordersupply/buylistbycompany.json', // 分页列表(按交易对手展示)
  supplyBuyorderSbycompany: HOST + '/ordersupply/buyordersbycompany.json', // 查询要展开的订单
  // 卖家
  supplyselllistbycompany: HOST + '/ordersupply/selllistbycompany.json', // 分页列表(按交易对手展示)
  supplyListbyCompany: HOST + '/ordersupply/sellordersbycompany.json', // 查询要展开的订单
  supplyOrderCompany: HOST + '/ordersupply/selllist.json', // /分页列表
  // 下载模板
  exportRIgnition: HOST_OA + '/exportRIgnition.json', // / 上游（船燃）模板
  exportRSupply: HOST_OA + '/exportRSupply.json', // /下游（船供）模板
  orderBuyerExcel: HOST_OA + '/xls/orderBuyerExcel.xls',
  orderSellerExcel: HOST_OA + '/xls/orderSellerExcel.xls',
  // 导出订单
  buyerExportRIgnitionData: HOST_OA + '/buyerExportRIgnitionData.json', // /上游（船燃）导出买家
  sellerExportRIgnitionData: HOST_OA + '/sellerExportRIgnitionData.json', // /上游（船燃）导出卖家
  buyerExportRSupplyData: HOST_OA + '/buyerExportRSupplyData.json', // /下游（船供）导出买家
  sellerExportRSupplyData: HOST_OA + '/sellerExportRSupplyData.json', // /下游（船供）导出卖家

  // 导入订单
  importRIgnitionData: HOST_OA + '/omImportRIgnitionData.json', // /上游（船燃）导入
  importRSupplyData: HOST_OA + '/omImportRSupplyData.json', // /下游（船供）导入

  // 删除订单
  Delorderignition: HOST + '/orderignition/delete.json', // 船燃订单（上游订单）
  Delordersupply: HOST + '/ordersupply/delete.json', // 船供订单（下游订单）

  // 船燃船供订单文件上传
  fileupload: HOST + '/order/fileupload.json', //  订单文件上传
  deletefile: HOST + '/order/deletefile.json', //  订单文件删除
  submmitfile: HOST + '/orderignition/uploadsubmit.json', //  文件上传提交上游订单
  ordersupplyuploadsubmit: HOST + '/ordersupply/uploadsubmit.json', //  文件上传提交下游订单
  showuploadedfiles: HOST + '/order/uploadedfiles.json' //  已上传的单据查询
}
