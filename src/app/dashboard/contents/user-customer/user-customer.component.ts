import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-customer',
  templateUrl: './user-customer.component.html',
  styleUrls: ['./user-customer.component.css']
})
export class UserCustomerComponent implements OnInit {

  isWaitingDownload = false;

  ts = { // filter Query
    nama: '',
    role: '',
  };

  constructor() { }

  ngOnInit() {

  }

  openFormAddUserRole() {
  //   const dialogRef = this.dialog.open(DialogAddUSerRole, {
  }


}

export class DialogAddUSerRole {
  
}

