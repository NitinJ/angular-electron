import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  @Input() redirect = true;

  public data: any = [];
  public loading = true;
  public descriptionAccountName = '';
  public descriptionPoeSessionId = '';
  public descriptionLeague = '';
  public descriptionSellStash = '';
  public descriptionPoeClientLogFilePath = '';

  @ViewChild('client_log_file_path')
  public fileInput: any;

  public saving = false;
  public file: File | null = null;
  public poeClientLogFilePath = '';
  public leagues: string[] = [];
  public clientLogFilePath = new FormControl('', [Validators.required]);

  configForm = new FormGroup({
    client_log_file_path : new FormControl('', [Validators.required]),
    league: new FormControl(''),
    poe_session_id: new FormControl(''),
    account_name: new FormControl(''),
  });

  constructor(private http: HttpClient,
    private router: Router,
    private utils: UtilsModule,
    private _snackBar: MatSnackBar) {
    this.utils = utils;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getConfig();
  }

  saveConfig() {
    const data = this.configForm.value;
    console.log(data);
    if (this.configForm.valid) {
      // Send request
      this.updateConfig(data);
    }
  }

  showMessage(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 1000
    });
  }

  updateConfig(data: any) {
    const url = this.utils.getServerUrl('/config/update');
    this.saving = true;
    this.http.post(url, data).subscribe((res: any) => {
      this.saving = false;
      // console.log(res);
      if (!res.status) {
        if (this.redirect) {
          this.router.navigateByUrl('/error');
        }
        this.showMessage('Couldn\'t save config');
      } else {
        let errors_present = false;
        // See if we got any errors.
        for (const field_name in res.details.error) {
          if (res.details.error[field_name] != 'valid') {
            this.configForm.controls[field_name].setErrors({incorrect: true});
            errors_present = true;
          }
        }

        if (!errors_present) {
          this.showMessage('Config saved');
        }
        if (!errors_present && this.redirect) {
          this.router.navigateByUrl('/configsecondary');
        }
      }
    }, () => {
      this.saving = false;
    });
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    this.configForm.controls.client_log_file_path.setValue((this.file as any).path);
  }

  getConfig() {
    const url = this.utils.getServerUrl('/config/get');
    this.http.get(url).subscribe((res: any) => {
      console.log(res);
      if (!res.status) {
        this.showMessage('Couldn\'t get config');
        if (this.redirect) {
          this.router.navigateByUrl('/error');
        }
      }
      if (res.details.valid) {
        this.router.navigateByUrl('/tasks');
      } else {
        // Get all requried fields and show config entry box.
        this.setFields(res.details);
      }
    }, () => {
      if (this.redirect) {
        this.router.navigateByUrl('/error');
      }
      this.showMessage('Couldn\'t get config');
    });
  }

  setFields(details: any) {
    for (const m of details.metadata) {
      if (m.name == 'account_name') {
        this.descriptionAccountName = m.desc;
      } else if (m.name == 'poe_session_id') {
        this.descriptionPoeSessionId = m.desc;
      } else if (m.name == 'client_log_file_path') {
        this.descriptionPoeClientLogFilePath = m.desc;
      } else if (m.name == 'league') {
        this.leagues = m.values;
        this.descriptionLeague = m.desc;
      }
    }
  }
}
