import {Component, OnInit} from '@angular/core';
import {UserDataService} from './../login/user-data.service';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})

export class HomeComponent implements OnInit {
  constructor(private userDataService:UserDataService, private http: Http) {}

  ngOnInit() {
    return this.http.get('/api/user/settings')
            .toPromise()
            .then(res => {
              if (res.json().data.user) {
                this.userDataService.setup = res.json().data.user;
                this.userDataService.team = res.json().data.user.list;
                this.userDataService.userLogin();
              }
            })
  }
}
