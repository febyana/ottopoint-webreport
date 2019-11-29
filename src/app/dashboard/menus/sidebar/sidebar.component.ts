import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None // biar bisa merubah style bawaan
})
export class SidebarComponent implements OnInit {
  isAdmin: boolean;

  constructor() { }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('user_info')).userType === 'admin';
  }

}
