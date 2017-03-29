'use strict';

var importScript = (src) => {
	return new Promise(function (resolve, reject) {
		var s = document.createElement('script');
		s.src = src;
		s.onload = resolve;
		s.onerror = reject;
		document.getElementsByTagName('body')[0].appendChild(s);
	});
};

var load = (app) => {
	if (location.origin.match(/localhost/)) {
		importScript('node_modules/systemjs/dist/system.js')
			.then(() => importScript('systemjs.config.js'))
			.then(() => System.import(app))
			.then(() => document.dispatchEvent(new Event('AppLoaded')))
			.catch((err) => console.log(err));
	} else {
		importScript(`${app}/dist/${app}.js`)
			.then(() => document.dispatchEvent(new Event('AppLoaded')))
			.catch((err) => console.log(err));
	}
};
