import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  data:any = {
    username: 'admin',
    isAdmin: false
  };
}
