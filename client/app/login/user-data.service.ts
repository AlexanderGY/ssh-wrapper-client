import {Injectable, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserDataService {

  userLogged:EventEmitter<any> = new EventEmitter();

  userLogin() {
    this.userLogged.emit();
  }

  setup:any = {};

  team:any = {
    name: '',
    users: [
      ''
    ]
  };

  clear() {
    this.setup = {};
    this.team = {};
  }
}
