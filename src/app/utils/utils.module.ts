import { APP_CONFIG } from './../../environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UtilsModule {
  getServerUrl(path: string) {
    return APP_CONFIG.backendUrl + path;
  }
  getCloudServerUrl(path: string) {
    return 'https://siosa-poe.com/api/v1' + path;
  }
}
