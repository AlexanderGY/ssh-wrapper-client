import {Component, OnInit} from '@angular/core';
import {MenuService} from './../header/menu.service';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  constructor(private menuService:MenuService, private http: Http) {}
  
  ngOnInit() {
    return this.http.get('/api/user/settings')
            .toPromise()
            .then(res => {
              if (res.json().data.user) {
                this.menuService.setup = res.json().data.user;
                this.menuService.team = res.json().data.user.list;
                this.menuService.userLogin();
              }
            })
  }
}
