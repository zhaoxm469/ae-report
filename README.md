# 前言

日常前后联调过程中，如果发现接口返回异常，我们往往需要把 接口名称，参数，响应等信息 ，手动复制出来发给给后端同学再去定位。  
如果是测试人员在测试过程中通过请求发现了接口异常，有些时候他并不能快速的把这些信息给到开发人员，然后还得跟他们沟通复现，再去抓包拿到参数等信息。  
所以这个时候 我们如果能监控接口异常自动推送到群里，这样我们就能更快速去的定位问题。

## 安装

``` bash 
# with pnpm 
npm install -S ae-report 

# with npm 
yarn add ae-report 

# with yarn 
npm install -S ae-report 
```

## 使用 

```typescript
// main.ts

import aeReport from 'ae-report'

aeReport.init({
	// webHook 飞书地址
	webHookURL: '',
	// 上报后端地址
	reportURL: 'https://znode.nucarf.cn/nestApi/hyj/addApiErroriLog',
	// 推送到飞书群的title
	title: "司机端项目",
	// 拿到后端返回的完整数据，判断如果code!==200的时候上报异常
	resReportingRules(params) {
		params = JSON.parse(params)
		return params.code !== 200;
	},
	// 添加公共请求参数
	extraData() {
		return {
			userId: getUserId()
		}
	}
})

```

or 

```html
<script src="http://localhost:10001/index.umd.js"></script>

<script>
aeReport.init({
	// webHook 飞书地址
	webHookURL: '',
	// 上报后端地址
	reportURL: 'https://znode.nucarf.cn/nestApi/hyj/addApiErroriLog',
	// 推送到飞书群的title
	title: "司机端项目",
	// 拿到后端返回的完整数据，判断如果code!==200的时候上报异常
	resReportingRules (params) {
		console.log(params);
		params = JSON.parse(params)
		return params.code != 0;
	},
})
</script>
```


## props

| 属性    | 描述    | 类型    |  默认值    | 
| ------- | ------ | -------|  -------| 
|  webHookURL  | 推送到飞书群的完整URL地址   | string  |  -  | 
|  reportURL  | 上报后端地址   | string  |  -  | 
|  title  | 标题   | string  |  -  | 
|  resReportingRules  | 上报规则   | (response:string)=>boolean  |  -  | 
|  extraData  | 额外的参数   | ()=>Record<string,any>  |  -  | 
