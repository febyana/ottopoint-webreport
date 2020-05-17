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
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { GetUsersEligibilityRes, AddEligibleUserReq, AddEligibleUserRes } from 'src/app/models/models';
//import { ExcelServicesService } from '../../../../services/xlsx.service';
@Component({
  selector: 'app-users-eligibility',
  templateUrl: './users-eligibility.component.html',
  styleUrls: ['./users-eligibility.component.css']
})
export class UsersEligibilityComponent implements OnInit {
  isCanCreate = JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create');

  [x: string]: any;
  query = '';
  fq = { // filter Query
    user_type: undefined,
    name: '',
    phone: '',
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    //'id',
    'phone',
    'user_type', 
    'name',
    'created_at',
    'created_by',
  ];

  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  matSnackBarConfig: MatSnackBarConfig<any>;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private snackBar: MatSnackBar,
    //private excelService: ExcelServicesService,
  ) {}

  ngOnInit() {
    this.tableHeight = (window.screen.height - document.getElementById('heightFilterAndActions').offsetHeight) * 0.57;
    console.log(
      'screen height :\n', window.screen.height,
      '\nheightFilterAndActions :\n', document.getElementById('heightFilterAndActions').offsetHeight);
    // hide action column if not have privilage
    if (!this.isCanCreate) {
      this.displayedColumns = [
        // 'id',
        'no',
        //'id',
        'phone',
        'user_type', 
        'name',
        'created_at',
        'created_by',
      ];
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          //console.log('query :\n', this.query);
          return this.apiService.APIGetUsersEligibility(
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
          if ( res.total === 0 ) {
            this.isNoData = true;
            return;
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
        this.apiService.APIGetUsersEligibility(
          window.localStorage.getItem('token'),
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.query
        ).subscribe((res: GetUsersEligibilityRes) => {
          this.dataTable.data = res.data;
          this.isLoadingResults = false;
        });
      }
    });
  }

  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.user_type !== undefined) {
      this.query = this.query + 'c.user_type.:' + this.fq.user_type + ',';
    }
    if (this.fq.name !== '') {
      this.query = this.query + 'c.name.:' + this.fq.name + ',';
    }
    if (this.fq.phone !== '') {
      this.query = this.query + 'b.phone.:' + this.fq.phone + ',';
    }
    // replace tanda (,) terakhir
    this.query = this.query.replace(/.$/g, '');
    // balik ke page pertama jika filter tidak kosong
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    console.log('query :\n', this.query);
    this.apiService.APIGetUsersEligibility(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetUsersEligibilityRes) => {
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

  clearFilter() {
    this.isLoadingResults = true;
    this.query = '';
    //this.fq.from_date = null;
    //this.fq.through_date =  null;
    this.fq.name = '';
    this.fq.user_type = undefined;
    this.fq.phone = '';
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetUsersEligibility(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetUsersEligibilityRes) => {
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
  styleUrls: ['./users-eligibility.component.css']
})
export class DialogAddEligibleComponent implements OnInit {
  req: AddEligibleUserReq;

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
    public dialogRef: MatDialogRef<DialogAddEligibleComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      //nama: ['', Validators.required],
     // merchant_id: ['', Validators.required],
      phone: ['', [
        Validators.pattern,
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(12)
      ]],
      instutionId: [undefined, Validators.required],
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
      phone: this.dataForm.value.phone,
      instutionId: this.dataForm.value.instutionId
    };
    console.log('query :\n', this.req);
    this.apiService.APIEligibleUser(
      this.req,
      window.localStorage.getItem('token')
    ).subscribe(res => {
      if (res.meta.message == 'SUCCESS') {// #
        window.alert('Succes Add eligible');
        this.dialogRef.close(true);
        this.ngOnInit();
        return;
      }
      if (res.meta.message == 'Partner not found') {
        window.alert('Partner Not Found');
       this.dialogRef.close(true);
       return;
      }
      if (res.meta.message == 'User sudah eligible') {
        window.alert('User sudah eligible');
        this.dialogRef.close(true);
      }
      this.isLoadingResults = false;
      this.snackBar.open(res.meta.message, 'close', this.matSnackBarConfig);
    });
  }
}
