var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var config = require('./config.js')

var version = JSON.parse(fs.readFileSync('./dist/version.json'))
console.log('version', version)

fs.watch('./dist/version.json', (event, filename) => {
	if (filename && event === "change") {
		console.log(`${filename} file Changed`)
		clearTimeout(reloadTimeout)
		reloadTimeout = setTimeout(() => {
			reloadVersion()
		}, 3000)
	}
})

var reloadTimeout = null

function reloadVersion() {
	version = JSON.parse(fs.readFileSync('./dist/version.json'))
	console.log('version', version)
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

//请配置eros.native.json为
//'bundleUpdate': 'http://xxx.com:3001/app/check'
app.all('/app/check', (req, res) => {
	console.log(req.query)
	// App版本相同
	if (req.query.android == version.android || req.query.iOS == version.iOS) {
		//js版本不相同
		if (req.query.jsVersion != version.jsVersion) {
			return res.json({
				"resCode": 0,
				"msg": "发现新版本",
				"data": {
					"diff": false,
					"path": config.jsPath + `/${version.jsVersion}.zip`
				}
			})
		}
	}
	res.json({
		"resCode": 1000,
		"msg": "当前版本已是最新，不需要更新",
		"data": {}
	})
})

app.use('/static', express.static('./dist'))

app.listen(config.port, config.host, () => {
	console.log(`linsten ${config.host}:${config.port}`)
})