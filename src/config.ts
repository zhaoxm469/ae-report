// 错误上报默认结构
export const reportSendParams = {
	// 发生的页面
	path: window.location.href,
	// 响应参数
	responseText: "",
	// 请求地址
	responseURL: "",
	// 请求Header参数
	requestHeaders: {},
	// 响应Header参数
	responseHeaders: "",
	// 请求方法
	requestMethods: "",
	// 请求参数
	requestParams: "",
	// 发送请求时间
	requestTime: "",
	// 响应成功时间
	responseTime: "",
	// 用户传入的额外信息
	extraData: {}
}