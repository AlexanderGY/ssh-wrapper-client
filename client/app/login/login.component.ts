import {Component} from '@angular/core';
import {User} from './user.class';
import {Http, Headers} from '@angular/http';
import {UserDataService} from './user-data.service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})

export class LoginComponent {

  constructor(private http: Http, public userDataService: UserDataService) {
    this.userDataService.setup = {
      user: '',
      signed: false
    };
    this.userDataService.team = {
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
              this.userDataService.team = data.list;
              this.userDataService.setup = {
                signed: true,
                user: data.user,
                isAdmin: data.isAdmin
              };
              this.userDataService.userLogin();
            }
          });
  }

  addMember() {
    this.userDataService.team.users.push('');
  }

  saveTeam() {
    return this.http.put('/api/user/team', {name: this.userDataService.setup.team, users: this.userDataService.team.users})
          .toPromise()
          .then(res => {
            console.log(res);
          })
  }

  exit() {
    this.userDataService.setup.signed = false;
    this.userDataService.clear();
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
