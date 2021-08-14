import { UtilsModule } from './../utils/utils.module';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent implements OnInit {
  public data: any = [];
  public loading = true;

  constructor(private http: HttpClient,
    private router: Router,
    private utils: UtilsModule) {
      this.utils = utils;
    }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.userLogin();
  }

  userLogin() {
    while (true) {
      try {
        this.tryUserLogin();
        break;
      } catch (err) {
        console.log('Failed to connect to backend !');
      }
    }
  }

  tryUserLogin() {
    const url = this.utils.getServerUrl('/config/get');
    this.http.get(url).subscribe((res: any) => {
      if (!res.status) {
        console.log('Status is False !');
        this.router.navigateByUrl('/error');
      }

      if (res.details.valid) {
        this.router.navigateByUrl('/tasks');
        // this.router.navigateByUrl('/config');
        // this.router.navigateByUrl('/configsecondary');
      } else {
        this.router.navigateByUrl('/register');
      }
    }, (err) => {
      // Timeout. Waiting for siosa backend.
      console.log(err);
      setTimeout(() => this.userLogin(), 1000);
    });
  }
}
