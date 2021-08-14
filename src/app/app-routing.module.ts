import { ConfigsecondaryComponent } from './configsecondary/configsecondary.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home';
import { TasksComponent } from './tasks';
import { RegisterComponent } from './home/register';
import { ConfigComponent } from './config/config.component';
import { ErrorComponent } from './error/error.component';
import { SettingsComponent } from './settings/settings.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'config', component: ConfigComponent},
  { path: 'configsecondary', component: ConfigsecondaryComponent},
  { path: 'error', component: ErrorComponent},
  { path: 'settings', component: SettingsComponent},

  // otherwise redirect to home
  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
