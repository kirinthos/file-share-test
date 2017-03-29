import { Inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { App } from './app';
import { DownloadFile } from './components/download-file';
import { UploadFile } from './components/upload-file';

// Provided by webview
declare var applicationHost: any;

export function hostServiceFactory() {
	return (typeof applicationHost === 'undefined') ? new HostServiceImpl() : applicationHost;
}

const appRoutes: Routes = [
	{ path: 'download', component: DownloadFile },
	{ path: '', component: UploadFile }
];

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		RouterModule.forRoot(appRoutes),
		MaterialModule.forRoot()
	],
	declarations: [ App, DownloadFile, UploadFile ],
	providers: [ ],
	entryComponents: [
		App
	],
	bootstrap: [App]
})
export class AppModule {
}
