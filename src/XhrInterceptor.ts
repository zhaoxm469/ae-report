/*
 * @Author: zhaoxingming
 * @Date: 2022-02-16 15:41:28
 * @LastEditTime: 2022-02-16 16:41:34
 * @LastEditors: vscode
 * @Description: AOP，拦截原生XMLHttpRequest 方法，调用之前增加自己的钩子逻辑
 *
 */
export class XhrInterceptor {
	xhr: XMLHttpRequest | null = null;
	hooks: Record<string, Function> = {};
	constructor() {
		const XMLHttpRequest = window.XMLHttpRequest;
		const that = this;

		(window as any).XMLHttpRequest = function () {
			const xhr = new XMLHttpRequest();
			that.xhr = xhr;
			that.overwrite();
			return xhr;
		}
	}
	add(methodsName: keyof XMLHttpRequest, callback: Function) {
		this.hooks[methodsName] = callback;
	}
	overwrite() {
		const { xhr, hooks } = this;

		Object.keys(this.hooks).forEach(hookName => {
			const old = (xhr as any)[hookName];
			(xhr as any)[hookName] = function () {
				try {
					hooks[hookName].apply(xhr, arguments);
				} catch (err) {
					console.error(err)
				}
				return old && old.apply(this, arguments)
			}
		})
	}
}
