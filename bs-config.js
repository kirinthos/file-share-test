module.exports = {
	"browser": "google chrome",
	"codeSync": false,
	"files": [
		"./src/**/*.{html,css,ts,json}",
		"./dist/*.{html,css,js}"
	],
	"logLevel": "warn",
	"startPath": "/index.html",
	"server": {
		"baseDir": [ "./src", "." ],
		"middleware": [
			function(req, res, next) {
				var urlMap = {
					"/": "/index.html"
				}

				var url = req.url.split('?')[0];
				if(url in urlMap) {
					req.url = urlMap[url];
				}

				next();
			}
		]
	}
}
