import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true; // set password hide (default true)
  isLoadingResults = false;
  loginForm: FormGroup;
  get f() { return this.loginForm.controls; }
  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      _username: ['', Validators.required],
      _password: ['', Validators.required]
    });
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoadingResults = true;
    this.apiService.APIGetToken(this.loginForm.value._username, this.loginForm.value._password)
    .pipe(
      map(res => {
        if (res.message !== undefined) {
          this.isLoadingResults = false;
          this.snackBar.open(res.message, 'close', this.matSnackBarConfig);
          return;
        }
        window.localStorage.setItem('token', res.token);
        this.isLoadingResults = false;
        this.router.navigateByUrl('/dashboard');
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `\nError: ${error.error.message}`;
        } else {
          // Server-side errors
          errorMessage = `\nError Code: ${error.status}\nMessage: ${error.message}`;
        }
        this.isLoadingResults = false;
        this.snackBar.open('Internal Server Error', 'close', this.matSnackBarConfig);
        return throwError(errorMessage);
      })
    ).subscribe();
  }
}
