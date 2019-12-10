import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';
import {
  GetUsersRes,
  User,
  AddEligibleUserReq,
  AddEligibleUserRes,
  RegisterUserReq,
  RegisterUserRes,
  ExportUsersToCSVReq
} from '../../../model/models';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  isCanCreate = JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create');

  RegisterUserReq: RegisterUserReq;
  exportUsersToCSVRequest: ExportUsersToCSVReq;

  query = '';
  fq = { // filter Query
    nama: '',
    phone: '',
    email: '',
    merchant_id: ''
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'nama',
    'phone',
    'email',
    'cust_id',
    'merchant_id',
    'status',
    'action',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    // hide action column if not have privilage
    if (!this.isCanCreate) {
      this.displayedColumns = [
        // 'id',
        'nama',
        'phone',
        'cust_id',
        'email',
        'merchant_id',
        'status',
      ];
    }
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log('query :\n', this.query);
          return this.apiService.APIGetUsers(
            window.localStorage.getItem('token'),
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.query
          );
        }),
        map(res => {
          this.dataTableLength = res.total;
          this.isLoadingResults = false;
          if ( res.message === 'Invalid Token' ) {
            window.alert('Login Session Expired!\nPlease Relogin!');
            this.router.navigateByUrl('/login');
            return;
          }
          if ( res.total === undefined) {
            this.snackBar.open('Internal Server Error', 'close', this.matSnackBarConfig);
            return;
          }
          if ( res.total === 0 ) {
            this.isNoData = true;
            return res.data;
          }
          this.isNoData = false;
          return res.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isNoData = true;
          return observableOf([]);
        })
      ).subscribe(res => this.dataTable = new MatTableDataSource(res));
  }

  openFormAddEligibleUser() {
    const dialogRef = this.dialog.open(DialogAddEligibleComponent, {
      width: '50%',
    });

    // after closed dialog
    dialogRef.afterClosed().subscribe(valid => {
      if (valid === true) {
        this.isLoadingResults = true;
        this.paginator.pageIndex = 0;
        this.sort.active = 'id';
        this.sort.direction = 'desc';
        console.log('query :\n', this.query);
        this.apiService.APIGetUsers(
          window.localStorage.getItem('token'),
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.query
        ).subscribe((res: GetUsersRes) => {
          this.dataTable.data = res.data;
          this.isLoadingResults = false;
        });
      }
    });
  }

  // row is get from users.component.html
  openFormRegisterUser(row: User) {
    const arrNama = row.nama.split(' ', 4); // array of nama

    const dialogRef = this.dialog.open(DialogRegisterComponent, {
      width: '50%',
      data: this.RegisterUserReq = {
        firstName: arrNama[0],
        lastName: (arrNama[1] + ' ' + arrNama[2] + ' ' + arrNama[3]).replace(/ undefined|undefined/gi, ''),
        phone: row.phone,
        institution: row.email.split('.', 1)[0],
      },
    });

    dialogRef.afterClosed().subscribe(valid => {
      if (valid === true) {
        this.isLoadingResults = true;
        console.log('query :\n', this.query);
        this.apiService.APIGetUsers(
          window.localStorage.getItem('token'),
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.query
        ).subscribe((res: GetUsersRes) => {
          this.dataTable.data = res.data;
          this.isLoadingResults = false;
        });
      }
    });
  }

  exportToCSV() {
    this.isWaitingDownload = true;
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'user_data_' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Users Data',
      useTextFile: false,
      useBom: true,
      // useKeysAsHeaders: true,
      headers: ['No', 'Name', 'Phone', 'Customer ID', 'Email', 'Merchant ID', 'Status']
    };
    const csvExporter = new ExportToCsv(options);

    console.log('query :\n', this.query);
    this.apiService.APIGetUsers(
      window.localStorage.getItem('token'),
      0,
      null,
      'id',
      'asc',
      this.query
    ).subscribe((res: GetUsersRes) => {
      this.isWaitingDownload = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.data === undefined) {
        this.snackBar.open('Failed export data', 'close', this.matSnackBarConfig);
        return;
      }
      // this.snackBar.open(`Downloading ${res.total} row data`, 'close', this.matSnackBarConfig);
      let no = 1;
      res.data.forEach((e) => {
        if (typeof e === 'object' ) {
          e.id = no++;
        }
      });
      csvExporter.generateCsv(res.data);
    });
  }

  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.nama !== '') {
      this.query = this.query + 'nama.icontains:' + this.fq.nama + ',';
    }
    if (this.fq.phone !== '') {
      this.query = this.query + 'phone:' + this.fq.phone + ',';
    }
    if (this.fq.email !== '') {
      this.query = this.query + 'email:' + this.fq.email + ',';
    }
    if (this.fq.merchant_id !== '') {
      this.query = this.query + 'merchant_id:' + this.fq.merchant_id + ',';
    }
    this.query = this.query.replace(/.$/g, ''); // replace tanda "," terakhir
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }

    console.log('query :\n', this.query);
    this.apiService.APIGetUsers(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetUsersRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if ( res.total === undefined) {
        this.snackBar.open('Internal Server Error', 'close', this.matSnackBarConfig);
        return;
      }
      this.dataTable.data = res.data;
      this.dataTableLength = res.total;
      this.isNoData = false;
      if (res.total === 0) {
        this.isNoData = true;
      }
      this.isLoadingResults = false;
    });
  }

  clearFilter() {
    this.isLoadingResults = true;
    this.query = '';
    this.fq.nama = '';
    this.fq.phone = '';
    this.fq.email = '';
    this.fq.merchant_id = '';
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetUsers(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetUsersRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.data;
      this.dataTableLength = res.total;
      this.isNoData = false;
      if (res.total === 0) {
        this.isNoData = true;
      }
      this.isLoadingResults = false;
    });
  }
}

@Component({
  selector: 'app-dialog-add-eligible',
  templateUrl: './dialogs/dialog-add-eligible.html',
  styleUrls: ['./users.component.css']
})
export class DialogAddEligibleComponent implements OnInit {
  req: AddEligibleUserReq;

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
    public dialogRef: MatDialogRef<DialogAddEligibleComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      nama: ['', Validators.required],
      merchant_id: ['', Validators.required],
      phone: ['', [
        Validators.pattern,
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ]],
      institution: [undefined, Validators.required],
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
      nama: this.dataForm.value.nama,
      merchant_id: this.dataForm.value.merchant_id,
      phone: this.dataForm.value.phone,
      institution: this.dataForm.value.institution
    };
    console.log('query :\n', this.req);
    this.apiService.APIEligibleUser(
      this.req,
      window.localStorage.getItem('token')
    ).subscribe((res: AddEligibleUserRes) => {
      if (res.data !== null) {// #
        this.dialogRef.close(true);
      }
      this.isLoadingResults = false;
      this.snackBar.open(res.meta.message, 'close', this.matSnackBarConfig);
    });
  }
}

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialogs/dialog-register.html',
  styleUrls: ['./users.component.css']
})
export class DialogRegisterComponent implements OnInit {
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
    public dialogRef: MatDialogRef<DialogRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegisterUserReq,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.data.lastName === '') {
      this.data.lastName = '-';
    }
    this.dataForm = this.formBuilder.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      phone: [this.data.phone, Validators.required],
      institution: [this.data.institution, Validators.required],
    });
  }

  no(): void {
    event.preventDefault();
    this.dialogRef.close();
  }

  yes() {
    event.preventDefault();
    if (this.dataForm.invalid) {
      return;
    }
    this.isLoadingResults = true;
    this.data = {
      firstName: this.dataForm.value.firstName,
      lastName: this.dataForm.value.lastName,
      phone: this.dataForm.value.phone,
      institution: this.dataForm.value.institution
    };
    console.log('query :\n', this.data);
    this.apiService.APIRegisterUser(
      this.data,
      window.localStorage.getItem('token')
    ).subscribe((res: RegisterUserRes) => {
      if (res.data !== null) {
        this.dialogRef.close(true);
        return;
      }
      this.isLoadingResults = false;
      this.dialogRef.close(false);
      this.snackBar.open(res.meta.message, 'close', this.matSnackBarConfig);
      return;
    });
  }
}
