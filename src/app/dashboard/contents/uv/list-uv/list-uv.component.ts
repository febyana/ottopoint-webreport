import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import {
  ReportUVResp, GetVoucherNameUV, GetVoucherTypeUV, GetVoucherCategoryUV
} from '../../../../models/models';

@Component({
  selector: 'app-list-uv',
  templateUrl: './list-uv.component.html',
  styleUrls: ['./list-uv.component.css']
})
export class ListUvComponent implements OnInit {

  vn = ''; // voucherName
  vt = ''; // voucherType
  s = ''; // status
  c = ''; // category
  fq = { // filter Query
    voucherName: undefined,
    voucherType: undefined,
    status: undefined,
    category: undefined,
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'voucherName',
    'voucherType',
    'voucherId',
    'status',
    'stock',
    'sku',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private router: Router,
    // public dialog: MatDialog,
    // public datePipe: DatePipe,
    // private snackBar: MatSnackBar,
    // private excelService: ExcelServicesService,
  ) {}

  status = [
    {k: 'Active', v: 'Active'},
    {k: 'Inactive', v: 'Inactive'},
  ];

  voucher_name = [];
  voucher_type = []; 
  categorys = []; 
  ngOnInit() {
    // VoucherName
    this.apiService.APIGetVoucherNameUV(
      window.localStorage.getItem('token')
    ).subscribe((res: GetVoucherNameUV) => {
     console.log('Response VoucherName :\n', res);
      res.voucherName.forEach(e => {
        this.voucher_name.push({
          k: e.name,
          v: e.name,
        });
      });
    });

    // VoucherType
    this.apiService.APIGetVoucherTypeUV(
      window.localStorage.getItem('token')
    ).subscribe((res: GetVoucherTypeUV) => {
      res.voucherType.forEach(e => {
        this.voucher_type.push({
          k: e.name,
          v: e.name,
        });
      });
    });

    // Category
    this.apiService.APIGetVoucherCategoryUV(
      window.localStorage.getItem('token')
    ).subscribe((res: GetVoucherCategoryUV) => {
      res.voucherName.forEach(e => {
        this.categorys.push({
          k: e.name,
          v: e.name,
        });
      });
    });

  }

  ngAfterViewInit() {

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          //console.log('query :\n', this.query);
          return this.apiService.APIReportVoucherUV(
            window.localStorage.getItem('token'),
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.c, this.vt, this.vn, this.s
          );
        }),
        map(res => {
          this.dataTableLength = res.totalVoucher;
          this.isLoadingResults = false;
          if ( res.message === 'Invalid Token' ) {
            window.alert('Login Session Expired!\nPlease Relogin!');
            this.router.navigateByUrl('/login');
            return;
          }
          if ( res.totalVoucher === 0 ) {
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


  submitFilter() {
    this.isLoadingResults = true;
    this.c = '';
    this.vt = ''; 
    this.vn = ''; 
    this.s = '';
    
    if (this.fq.voucherName !== undefined) {
      this.vn = this.fq.voucherName ;
    }
    if (this.fq.voucherType !== undefined) {
      this.vt = this.fq.voucherType ;
    }
    if (this.fq.status !== undefined) {
      this.s = this.fq.status ;
    }
    if (this.fq.category !== undefined) {
      this.c = this.fq.category ;
    }
    // console.log('query :\n', this.query);
    // if (this.query !== '') {
    //   this.paginator.pageIndex = 0;
    // }
    this.apiService.APIReportVoucherUV(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.c, this.vt, this.vn, this.s
    ).subscribe((res: ReportUVResp) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.data;
      this.dataTableLength = res.totalVoucher;
      this.isNoData = false;
      if (res.totalVoucher === 0) {
        this.isNoData = true;
      }
      this.isLoadingResults = false;
    });
  }

  clearFilter() {
    this.isLoadingResults = true;
    this.c = '';
    this.vt = ''; 
    this.vn = ''; 
    this.s = '';
    this.fq.voucherName = undefined;
    this.fq.voucherType = undefined;
    this.fq.status = undefined;
    this.fq.category = undefined;
    // console.log('query :\n', this.query);
    this.apiService.APIReportVoucherUV(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.c, this.vt, this.vn, this.s
    ).subscribe((res: ReportUVResp) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.data;
      this.dataTableLength = res.totalVoucher;
      this.isNoData = false;
      if (res.totalVoucher === 0) {
        this.isNoData = true;
      }
      this.isLoadingResults = false;
    });
  }


}
