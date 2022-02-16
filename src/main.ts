import { reportSendParams } from './config';
import { AeReportConfig } from './type';
import { XhrInterceptor } from './XhrInterceptor'

const config: AeReportConfig = {
	webHookURL: '',
	reportURL: '',
	title: '',
	resReportingRules: () => false
}

class AeReport {
	config: AeReportConfig = config;
	init(useConfig: AeReportConfig) {
		Object.assign(this.config, useConfig)
		this.proxyXhr();
	}

	proxyXhr() {
		// @ts-ignore
		const xhr = new XhrInterceptor(), that = this;

		xhr.add('open', function (requestMethods: string, responseURL: string) {
			// @ts-ignore
			this.reportInfo = Object.assign(reportSendParams, {
				requestMethods,
				title: that.config.title
			});
		})
		xhr.add('setRequestHeader', function (key: string, value: string) {
			// @ts-ignore
			this.reportInfo.requestHeaders[key] = value;
		})

		xhr.add('send', function (requestParams: any) {
			// @ts-ignore
			const _this = this;

			if (_this.reportInfo.requestMethods === "POST") {
				_this.reportInfo.requestParams = requestParams;
			}
			_this.reportInfo.requestTime = Date.now();
		})

		const load = function () {
			// @ts-ignore
			const _this = this;
			_this.reportInfo.responseURL = _this.responseURL;
			_this.reportInfo.responseHeaders = _this.getAllResponseHeaders();
			_this.reportInfo.responseTime = Date.now();
			_this.reportInfo.responseText = _this.responseText;

			// debugger
			// 根据用户设置的规则判断是否需要上报
			let isReport = () => {
				try {
					return that.config.resReportingRules(_this.reportInfo.responseText)
				} catch (err) {
					return false;
				}
			};

			// 如果发生错误的接口是上报接口， 不做重新发送错误到上报接口，避免死循环调用
			const isReportApiError = _this.reportInfo.responseURL !== that.config.reportURL;

			if (_this.status >= 200 && _this.status < 300) {
				if (isReport() && isReportApiError) {
					that.send(_this.reportInfo);
				}
			} else {
				if (isReportApiError) {
					that.send(_this.reportInfo);
				}
			}
		}

		xhr.add('onloadend', load)
	}

	send(params: any) {
		if (this.config.extraData) {
			try {
				if (typeof params === 'object') {
					params.extraData = this.config.extraData();
				}
				if (!params) params = this.config.extraData()

			} catch (err) {
				console.log('send extraData 发生错误')
			}
		}

		const data = JSON.stringify(params);
		const xhr = new XMLHttpRequest();
		xhr.open("POST", this.config.reportURL);
		xhr.setRequestHeader("content-type", "application/json;charset=UTF-8");
		xhr.send(data);
	}
}

export default new AeReport();