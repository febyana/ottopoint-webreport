import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangePasswordRequest, ChangePasswordResponse } from '../models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
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

}
