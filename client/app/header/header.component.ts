import { Component } from '@angular/core';
import { MenuService } from './menu.service';
import { BackService } from './back.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent {
  constructor(public menuService: MenuService, public colorService: BackService) {}

  goBack() {

  }
}
