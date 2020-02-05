import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangePasswordRequest, ChangePasswordResponse } from '../models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { UserCustomerComponent } from './contents/user-customer/user-customer.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mode = 'side';
  constructor(
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (window.localStorage.getItem('token') == null) {
      this.router.navigateByUrl('/login');
    }
    const partsToken = window.localStorage.getItem('token').split('.');
    window.localStorage.setItem( 'user_info', decodeURIComponent((window as any).escape(window.atob(partsToken[1]))) );
    if (window.screen.width <= 510) {
      this.mode = 'over';
    }
  }

  logout() {
    window.localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  openFormChangePassword() {
    const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      width: '50%',
    });

  }

  openUserCustomer() {
    this.router.navigateByUrl('/users_customer');
  }


}

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog/dialog-change-password.html',
  styleUrls: ['./dashboard.component.css']
})
export class DialogChangePasswordComponent implements OnInit {
  req: ChangePasswordRequest;

  dataForm: FormGroup;
  get f() { return this.dataForm.controls; }

  isLoadingResults = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    public dialogRef: MatDialogRef<DialogChangePasswordComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  cancel(): void {
    event.preventDefault(); // mencegah form untuk refresh page
    this.dialogRef.close(false);
  }

  submit() {
    event.preventDefault(); // mencegah form untuk refresh page
    if (this.dataForm.invalid) {
      return;
    }
    this.isLoadingResults = true;
    this.req = {
      old_password: this.dataForm.value.old_password,
      new_password: this.dataForm.value.new_password,
      confirm_password: this.dataForm.value.confirm_password,
    };
    console.log('query :\n', this.req);
    this.apiService.APIChangePassword(
      window.localStorage.getItem('token'),
      this.req
    ).subscribe((res: ChangePasswordResponse) => {
      if (res.code !== null) {// #
        this.dialogRef.close(true);
      }
      this.isLoadingResults = false;
      this.snackBar.open(res.message, 'close', this.matSnackBarConfig);
    });
  }
}
