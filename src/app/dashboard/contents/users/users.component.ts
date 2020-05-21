import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
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
  ChangeStatusRequest,
  ChangeStatusResponse,
  ExportUsersToCSVReq
} from '../../../models/models';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { ExcelServicesService } from '../../../services/xlsx.service';
// import { DialogStatusUsersComponent } from './dialog-status-users/dialog-status-users.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  isCanCreate = JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create');

  RegisterUserReq: RegisterUserReq;
  ChangeStatusRequest: ChangeStatusRequest;
  exportUsersToCSVRequest: ExportUsersToCSVReq;
  // DialogStatusUserComponent: DialogStatusUsersComponent;

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
    'last_name',
    'phone',
    'email',
    'cust_id',
    'merchant_id',
    'status',
    //'action',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight: number;

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
    private excelService: ExcelServicesService,
  ) {}

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.tableHeight = (window.screen.height - document.getElementById('heightFilterAndActions').offsetHeight) * 0.57;
    console.log(
      'screen height :\n', window.screen.height,
      '\nheightFilterAndActions :\n', document.getElementById('heightFilterAndActions').offsetHeight);
    // hide action column if not have privilage
    if (!this.isCanCreate) {
      this.displayedColumns = [
        // 'id',
        'nama',
        'last_name',
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
          console.log('response users : ', res);
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

  // openFormAddEligibleUser() {
  //   const dialogRef = this.dialog.open(DialogAddEligibleComponent, {
  //     width: '50%',
  //   });

  //   // after closed dialog
  //   dialogRef.afterClosed().subscribe(valid => {
  //     if (valid === true) {
  //       this.isLoadingResults = true;
  //       this.paginator.pageIndex = 0;
  //       this.sort.active = 'id';
  //       this.sort.direction = 'desc';
  //       console.log('query :\n', this.query);
  //       this.apiService.APIGetUsers(
  //         window.localStorage.getItem('token'),
  //         this.paginator.pageIndex,
  //         this.paginator.pageSize,
  //         this.sort.active,
  //         this.sort.direction,
  //         this.query
  //       ).subscribe((res: GetUsersRes) => {
  //         this.dataTable.data = res.data;
  //         this.isLoadingResults = false;
  //       });
  //     }
  //   });
  // }

  // row is get from users.component.html
  openFormRegisterUser() {
    //const arrNama = row.nama.split(' ', 4); // array of nama

    const dialogRef = this.dialog.open(DialogRegisterComponent, {
      width: '50%',
      // data: this.RegisterUserReq = {
      //   firstName: arrNama[0],
      //   lastName: (arrNama[1] + ' ' + arrNama[2] + ' ' + arrNama[3]).replace(/ undefined|undefined/gi, ''),
      //   phone: row.phone,
      //   institution: row.email.split('.', 1)[0],
    });

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
  openFormChangeStatus(row: User) {

    const dialogRef = this.dialog.open(DialogStatusUsersComponent, {
      width: '50%',
      data: this.ChangeStatusRequest = {
        phone: row.phone,
        status: row.status,
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
      filename: 'user' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Users',
      useTextFile: false,
      useBom: true,
      // useKeysAsHeaders: true,
      headers: ['No', 'Name', 'Lastname', 'Phone', 'Customer ID', 'Email', 'Merchant ID', 'Status']
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

  exportToXLSX() {
    this.isWaitingDownload = true;
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
      const arrData = [];
      let no = 1;
      res.data.forEach((e) => {
        if (typeof e === 'object' ) {
          const objData = {
            No: no++,
            Name: e.nama,
            Lastname: e.last_name,
            Phone: e.phone,
            Email: e.email,
            Customer_ID: e.cust_id,
            Merchant_ID: e.merchant_id,
          };
          arrData.push(objData);
        }
      });
      this.excelService.exportAsExcelFile(arrData, 'users_');
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
      this.query = this.query + 'email.icontains:' + this.fq.email + ',';
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

// @Component({
//   selector: 'app-dialog-add-eligible',
//   templateUrl: './dialogs/dialog-add-eligible.html',
//   styleUrls: ['./users.component.css']
// })
// export class DialogAddEligibleComponent implements OnInit {
//   req: AddEligibleUserReq;

//   dataForm: FormGroup;
//   get f() { return this.dataForm.controls; }

//   isLoadingResults = false;

//   matSnackBarConfig: MatSnackBarConfig = {
//     duration: 2000,
//     verticalPosition: 'top',
//     horizontalPosition: 'center',
//     panelClass: ['snack-bar-ekstra-css']
//   };

//   constructor(
//     public dialogRef: MatDialogRef<DialogAddEligibleComponent>,
//     private formBuilder: FormBuilder,
//     private apiService: ApiService,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit() {
//     this.dataForm = this.formBuilder.group({
//       nama: ['', Validators.required],
//       merchant_id: ['', Validators.required],
//       phone: ['', [
//         Validators.pattern,
//         Validators.required,
//         Validators.minLength(11),
//         Validators.maxLength(12)
//       ]],
//       institution: [undefined, Validators.required],
//     });
//   }

//   cancel(): void {
//     event.preventDefault(); // mencegah form untuk refresh page
//     this.dialogRef.close(false);
//   }

//   submit() {
//     event.preventDefault(); // mencegah form untuk refresh page
//     if (this.dataForm.invalid) {
//       return;
//     }
//     this.isLoadingResults = true;
//     this.req = {
//       //nama: this.dataForm.value.nama,
//       //merchant_id: this.dataForm.value.merchant_id,
//       phone: this.dataForm.value.phone,
//       institution: this.dataForm.value.institution
//     };
//     console.log('query :\n', this.req);
//     this.apiService.APIEligibleUser(
//       this.req,
//       window.localStorage.getItem('token')
//     ).subscribe((res: AddEligibleUserRes) => {
//       if (res.data !== null) {// #
//         this.dialogRef.close(true);
//       }
//       this.isLoadingResults = false;
//       this.snackBar.open(res.meta.message, 'close', this.matSnackBarConfig);
//     });
//   }
// }

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialogs/dialog-register.html',
  styleUrls: ['./users.component.css']
})
export class DialogRegisterComponent implements OnInit {
req: RegisterUserReq;

  dataForm: FormGroup;
  router: any;
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
   // @Inject(MAT_DIALOG_DATA) public data: RegisterUserReq,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', [
        Validators.pattern,
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(12)
      ]],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      issuer: [undefined, Validators.required],
    });
  }

  cancel(): void {
    event.preventDefault();
    this.dialogRef.close(false);
  }

  submit() {
    event.preventDefault();
    if (this.dataForm.invalid) {
      return;
    }
    this.isLoadingResults = true;
    this.req = {
      firstname: this.dataForm.value.firstname,
      lastname: this.dataForm.value.lastname,
      phone: this.dataForm.value.phone,
      email: this.dataForm.value.email,
      gender: this.dataForm.value.gender,
      birthdate: this.dataForm.value.birthdate,
      issuer: this.dataForm.value.issuer,
    };
    //console.log('query :\n', this.data);
    this.apiService.APIRegisterUser(
      this.req,
      window.localStorage.getItem('token')
    ).subscribe((res: RegisterUserRes) => {
      if (res.Meta.code == 200) {
        this.snackBar.open(res.Meta.message, 'close', this.matSnackBarConfig);
        this.isLoadingResults = false;
        this.dialogRef.close(true);
        return;
      } else {
        this.snackBar.open(res.Meta.message, 'close', this.matSnackBarConfig);
        this.isLoadingResults = false;
        this.dialogRef.close(true);
      }
    },(err : any) =>{
      alert(err)
    })
  }
}

//// ChngaeStatus

@Component({
  selector: 'app-dialog-status-user',
  templateUrl: './dialogs/dialog-status-user.html',
  styleUrls: ['./users.component.css']
})

export class DialogStatusUsersComponent implements OnInit {
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
    public dialogRef: MatDialogRef<DialogStatusUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangeStatusRequest,
    private formBuilder: FormBuilder,
    // private x: boolean,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      phone: [this.data.phone, Validators.required],
      // status: [this.data.status, Validators.required]
  });
  }

  no(): void {
    event.preventDefault();
    this.dialogRef.close();
  }

  yes() {
    event.preventDefault();
    this.isLoadingResults = true;

    if (this.data.status === true) {
      this.data.status = false
    } else {
      this.data.status = true
    }

    this.data = {
        phone : this.dataForm.value.phone,
        status: this.data.status,
    } 
    console.log('query :\n', this.data);
    this.apiService.APIChangeStatus(
        window.localStorage.getItem('token'),
        this.data,
    ).subscribe((res: ChangeStatusResponse) => {
        this.isLoadingResults = false;
        if (res.data !== null) {
            this.dialogRef.close(true);
            return;
        }
        // this.dialogRef.close(false);
        this.snackBar.open(res.meta.message, 'close', this.matSnackBarConfig);
        return;
    });


  }


  
}