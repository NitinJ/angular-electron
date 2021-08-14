import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';

@Component({
  selector: 'app-config-secondary',
  templateUrl: './configsecondary.component.html',
  styleUrls: ['./configsecondary.component.scss'],
})
export class ConfigsecondaryComponent implements OnInit {
  @Input() redirect = true;

  public data: any = [];
  public loading = true;
  public saving = true;
  public descriptionSellStash = '';

  configForm = new FormGroup({
    currency : new FormControl('', [Validators.required]),
    sell: new FormControl('', [Validators.required]),
    dump: new FormControl('', [Validators.required]),
  });
  public stashes: string[] = [];

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

  showMessage(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 1000
    });
  }

  saveConfig() {
    const data = this.configForm.value;
    console.log(data);
    if (this.configForm.valid) {
      // Send request
      this.updateConfig(data);
    }
  }

  updateConfig(data: any) {
    const url = this.utils.getServerUrl('/config/update');
    this.saving = true;
    data = {
      currency: [data.currency],
      dump: [data.dump],
      sell: data.sell,
    };
    this.http.post(url, data).subscribe((res: any) => {
      this.saving = false;
      console.log(res);
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
          this.router.navigateByUrl('/tasks');
        }
      }
    }, () => {
      this.saving = false;
    });
  }

  getConfig() {
    const url = this.utils.getServerUrl('/config/get');
    this.http.get(url).subscribe((res: any) => {
      console.log(res);
      if (!res.status) {
        if (this.redirect) {
          this.router.navigateByUrl('/error');
        }
        this.showMessage('Couldn\'t save config');
      }
      // this.setFields(res.details);
      if (!res.details.valid) {
        this.router.navigateByUrl('/config');
      } else {
        // Get all requried fields and show config entry box.
        this.setFields(res.details);
      }
    }, () => {
      if (this.redirect) {
        this.router.navigateByUrl('/error');
      }
      this.showMessage('Couldn\'t save config');
    });
  }

  setFields(details: any) {
    for (const m of details.metadata) {
      if (m.name == 'sell') {
        this.stashes = m.values;
        this.descriptionSellStash = m.desc;
      }
    }
  }
}
