'use strict';

var packages = {
	'@angular/material': {
		defaultExtension: 'js',
		main: 'bundles/material.umd.js'
	},
	'filetransfer': {
		defaultExtension: 'ts',
		main: 'main'
	},
	'rxjs': {
		defaultExtension: 'js'
	},
	'ts': {
		main: 'plugin.js'
	},
	'typescript': {
		main: 'lib/typescript.js',
		meta: {
			'lib/typescript.js': {
				'exports': 'ts'
			}
		}
	},
};

var map = {
	'angular-components': 'common',
	'@angular': 'node_modules/@angular',
	'core-js': 'node_modules/core-js',
	'hammerjs': 'node_modules/hammerjs/hammer.js',
	'reflect-metadata': 'node_modules/reflect-metadata',
	'rxjs': 'node_modules/rxjs',
	'ts': 'node_modules/plugin-typescript/lib/',
	'typescript': 'node_modules/typescript/',
	'zone.js': 'node_modules/zone.js',

	// 3rd party oauth deps
	/*
	'angular2-jwt': 'node_modules/angular2-jwt',
	'angular2-oauth2': 'node_modules/angular2-oauth2',
	'base64-js': 'node_modules/base64-js/lib/b64',
	'buffer': 'node_modules/buffer/index',
	'convert-hex': 'node_modules/convert-hex/convert-hex',
	'convert-string': 'node_modules/convert-string/convert-string',
	'ieee754': 'node_modules/ieee754/index',
	'isarray': 'node_modules/isarray/index',
	'js-base64': 'node_modules/js-base64/base64',
	'sha256': 'node_modules/sha256/lib/sha256',
	*/
};

var angularPackages = [
	'@angular/core',
	'@angular/common',
	'@angular/compiler',
	'@angular/forms',
	'@angular/http',
	'@angular/platform-browser',
	'@angular/platform-browser-dynamic',
	'@angular/router'
];

angularPackages.forEach(function (item) {
	var filename = item.split('/')[1];
	packages[item] = { main: 'bundles/' + filename + '.umd.js' };
	map[item + '/testing'] = 'node_modules/' + item + '/bundles/' + filename + '-testing.umd.js';
});

System.config({
	baseURL: '.',
	defaultJSExtensions: true,
	transpiler: 'ts',
	typescriptOptions: {
		tsconfig: 'tsconfig.json'
    },
	meta: {
      'typescript': {
        "exports": "ts"
     }
    },
	packages: packages,
	map: map,
	paths: {
		'node_modules/*': './node_modules/*'
	}
});
