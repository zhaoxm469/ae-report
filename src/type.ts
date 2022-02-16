export type AeReportConfig = {
	/** 推送地址 */
	webHookURL: string,
	/** 上报的API地址 */
	reportURL: string,
	/** 上报规则，这里会返回一个后端的响应参数字符串，根据响应参数自己制定规则 */
	resReportingRules: (params: any) => boolean,
	/** 日志上报的时候用户额外新增的参数，这里需要传递一个函数，返回一个对象 */
	extraData?: () => Record<string, any>,
	// 推送到xx群的的标题
	title?: string
}