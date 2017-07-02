import {Component} from '@angular/core';
import {User} from './user.class';
import {Http, Headers} from '@angular/http';
import {MenuService} from './../header/menu.service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent {

  constructor(private http: Http, public menuService: MenuService) {
    this.menuService.setup = {
      user: '',
      signed: false
    };
    this.menuService.team = {
      users: [
        ''
      ]
    };
  }

  signinUser(val) {
    return this.http.post('/api/user/login', {val})
          .toPromise()
          .then(res => {
            let data = res.json();
            if (data.error) {
              console.log('Password or login incorrect');
            } else {
              this.menuService.team = data.list;
              this.menuService.setup = {
                signed: true,
                user: data.user,
                isAdmin: data.isAdmin
              };
              this.menuService.userLogin();
            }
          });
  }

  addMember() {
    this.menuService.team.users.push('');
  }

  saveTeam() {
    return this.http.put('/api/user/team', {name: this.menuService.setup.team, users: this.menuService.team.users})
          .toPromise()
          .then(res => {
            console.log(res);
          })
  }

  exit() {
    this.menuService.setup.signed = false;
    this.menuService.clear();
    return this.http.delete('/api/user/session')
          .toPromise()
          .then(res => {
            console.log(res);
          })
  }

  onSubmit(form:any) {
    this.signinUser(form.value);
  }
}
