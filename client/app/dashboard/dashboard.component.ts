import { Component, OnInit, Pipe } from '@angular/core';
import {UserDataService} from './../login/user-data.service';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl']
})

export class DashboardComponent implements OnInit {
  //TODO resolve it
  stands:Array<any> = [];
  repos:Array<any> = [];
  activeBranch:string = '';
  active:number = 0;
  preloader:boolean = false;
  showStands:boolean = false;
  showMonitors:boolean = false;
  block:any = null;
  monitors:Array<any> = [];
  activeMonitor:any = null;

  constructor(public userDataService: UserDataService, private http: Http) {}

  ngOnInit() {
    if (this.userDataService.setup.user) {
      this.getStands();
    } else {
      this.userDataService.userLogged.subscribe(() => {
        this.getStands();
      })
    }
  }

  getStands() {
    return this.http.get('/api/service/stands')
          .toPromise()
          .then(res => {
            this.stands = res.json().data;
            if (res.json().active) {
              this.repos = res.json().repos;
              this.activeBranch = res.json().active.replace(/[^A-Za-z0-9_]/g, '');
            }
            this.showStands = true;
          })
  }

  changeBranch(stand, branch) {
    return this.http.put('/api/service/change-branch', {stand: stand, branch: branch})
          .toPromise()
          .then(res => {

          })
  }

  setActiveBranch(ab) {
    this.activeBranch = ab;
  }

  setActive(index, src) {
    this.active = index;
    return this.http.post('/api/service/active-branch', {src: src})
            .toPromise()
            .then(res => {
              this.setActiveBranch(res.json().active.replace(/[^A-Za-z0-9_]/g, ''));
            })
  }


  getSSHRequest(command) {
    this.preloader = true;
    return this.http.post('/api/service/ssh', {command})
          .toPromise()
          .then(res => {
            this.preloader = false;
          });
  }

  addNewCommand() {
    this.block.commands.push({title: '', command: ''});
  }

  onSubmit() {
    let block = this.block;
    if (!block.name) {
      return false;
    }
    for (let i = 0; i < block.commands.length; i++) {
      if (!block.commands[i].title || !block.commands[i].command) {
        return false;
      }
    }
    return this.http.post('/api/service/stand', {block})
            .toPromise()
            .then(res => {
              this.stands = res.json().data;
            })
  }
}
