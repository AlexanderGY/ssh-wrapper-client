import { Component } from '@angular/core';
import { UserDataService } from '../login/user-data.service';
import { BackService } from './back.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})

export class HeaderComponent {
  constructor(public userDataService: UserDataService, public colorService: BackService) {}

  goBack() {

  }
}
