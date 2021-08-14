import { UtilsModule } from './../utils/utils.module';
import { ConfigsecondaryComponent } from './../configsecondary/configsecondary.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { jsonValidator } from './json.validator';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  panelOpenState = false;
  loading = true;

  starting: string|null = null;
  task: string|null = null;
  state = 0;

  rollerFormGroup = new FormGroup({
    rollerConfig: new FormControl('', [Validators.required, jsonValidator])
  });

  @ViewChild(ConfigsecondaryComponent) stashesConfig!: ConfigsecondaryComponent;

  constructor(private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private utils: UtilsModule) {
  }

  ngOnInit(): void {
    setInterval(() => this.updateTaskStatus(), 500);
  }

  updateTaskStatus() {
    const url = this.utils.getServerUrl('/task/get');
    this.http.get(url).subscribe((res: any) => {
      if (!res.status) {
        return;
      }
      this.loading = false;
      if (res.details.task == null) {
        this.task = null;
        this.state = 0;
        return;
      }

      this.task = res.details.task;
      this.state = res.details.state;
    }, (err) => {
      if (err.status == 504) {
        this.loading = true;
      }
    }
    );
  }

  tabChanged(event: MatTabChangeEvent) {
    if (event.index == 1) {
      this.stashesConfig.getConfig();
    }
  }

  showError(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 1000
    });
  }

  openSettings() {
    this.router.navigateByUrl('/settings');
  }

  startTask(task: string) {
    if (!task || this.state == 2) {
      return;
    }
    const url = this.utils.getServerUrl('/task/create/') + task;
    let data = {};
    if (task == 'roller') {
      if (!this.rollerFormGroup.controls.rollerConfig.valid) {
        return;
      }
      try {
        data = JSON.parse(this.rollerFormGroup.controls.rollerConfig.value);
      } catch (e) {
        return;
      }
    }

    this.starting = task;
    this.http.post(url, data).subscribe((res: any) => {
      this.starting = null;
      if (!res.status) {
        this.showError('Couldn\'t start task');
      }
      this.starting = null;
    }, (err) => {
      this.showError('Couldn\'t start task');
      this.starting = null;
    });
  }

  stopTasks() {
    if (this.state != 1) {
      return;
    }
    const url = this.utils.getServerUrl('/task/stop');
    this.http.post(url, {}).subscribe((res: any) => {
      if (!res.status) {
        this.showError('Couldn\'t stop task');
      }
    }, (err) => {
      this.showError('Couldn\'t stop task');
    });
  }
}
