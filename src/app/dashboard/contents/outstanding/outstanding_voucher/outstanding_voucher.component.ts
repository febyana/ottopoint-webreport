import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { OutstandingVoucherRes} from '../../../../models/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from '../../../../services/xlsx.service';

@Component({
  selector: 'app-transactions-earnings-osp',
  templateUrl: './outstanding_voucher.component.html',
  styleUrls: ['./outstanding_voucher.component.css']
})
export class OutstandingVoucherComponent implements AfterViewInit, OnInit {
  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    email: '',
    phone: '',
    partner: '',
  };
  buffTotalData = 0;
  displayedColumns: string[] = [
    'no',
    'date',
    'time',
    // 'customer_id',
    'phone',
    'email',
    'partner',
    'product_name',
    'beginning',
    'redeem_point',
    'used_voucher',
    'unused_voucher',
    'reversal',
    'expired_voucher',
    'ending'
  ];

  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;

  productTypes = [];
  
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
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private excelService: ExcelServicesService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.apiService.APIOutstandingVoucher(
          window.localStorage.getItem('token'),
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.query
        );
      }),
      map(res => {
        this.isLoadingResults = false;
        if (res.message == 'Invalid Token') {
          window.alert('Login Session Expired!\nPlease Relogin!');
          this.router.navigateByUrl('/login');
          return;
        }
        this.dataTableLength = res.total;
        if (res.total === 0) {
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

  exportToCSV() {
    this.isWaitingDownload = true;

    const options = {
      filename: 'outstanding_voucher' + Date().toLocaleString(),
      fieldSeparator : ',',
      quoteStrings : '"',
      decimalSeparator:'.',
      showLabels:true,
      showTitle:true,
      title:'Transactions Outstanding Voucher \nDownload At : '+ Date().toLocaleString(),
      useTextFile:false,
      useBom:true,
      useKeysAsHeaders:true,
    };
    const csvExporter = new ExportToCsv(options);
    this.apiService.APIOutstandingVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res:OutstandingVoucherRes)=>{
      this.isWaitingDownload = false;
      if (res.message  === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!')
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.data === undefined || res.data.length === 0) {
        this.snackBar.open('Failed to export data', 'close', this.matSnackBarConfig);
        return;
      }

      const arrData = [];
      let no = 1; 
      res.data.forEach((e) => {
        const objData = {
          No: no++,
          // Date : e.date,
          // Time : e.time,
          Phone : e.phone,
          Email : e.email,
          Partner : e.partner,
          Beginning : e.beginning,
          // Adding : e.adding,
          // Bonus : e.bonus,
          // Spending : e.spending,
          // P2pAdd : e.p2p_add,
          // P2pSpend : e.p2p_spend,
          // AdjustmentAdd : e.adjustment_add,
          // Adjustmentspend : e.adjustment_spend,
          // ExpiredVoucher : e.expired_point,
          // EndingVoucher : e.ending_point,
        };
        arrData.push(objData);
      });
      csvExporter.generateCsv(arrData);
    });
  }

  exportToXLSX() {
    this.isWaitingDownload = true;
    console.log('query :\n', this.query);
    this.apiService.APIOutstandingVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: OutstandingVoucherRes) => {
      this.isWaitingDownload = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.data === undefined || res.data.length === 0) {
        this.snackBar.open('Failed to export data', 'close', this.matSnackBarConfig);
        return;
      }
      // this.snackBar.open(`Downloading ${res.data.length} row data`, 'close', this.matSnackBarConfig);
      const arrData = [];
      let no = 1;
      res.data.forEach((e) => {
          const objData = {
            No: no++,
            // Date : e.date,
            // Time : e.time,
            Phone : e.phone,
            Email :e.email,
            Partner : e.partner,
            Beginning : e.beginning,
            // Adding : e.adding,
            // Bonus : e.bonus,
            // Spending : e.spending,
            // P2pAdd : e.p2p_add,
            // P2pSpend : e.p2p_spend,
            // AdjustmentAdd : e.adjustment_add,
            // Adjustmentspend : e.adjustment_spend,
            // ExpiredVoucher : e.expired_point,
            // EndingVoucher : e.ending_point,
          };
          arrData.push(objData);
      });
      this.excelService.exportAsExcelFile(arrData, 'outstanding_voucher_');
    });
  }

  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.from_date !== null) {
      this.query = this.query + `a.date.gte:${
        this.datePipe.transform(this.fq.from_date, 'yyyy-MM-dd 00:00:00')
      },`;
    }
    if (this.fq.through_date !== null) {
      this.query = this.query + `a.date.lte:${
        this.datePipe.transform(this.fq.through_date, 'yyyy-MM-dd 24:00:00')
      },`;
    }
    if (this.fq.phone != '') {
      this.query = this.query + `a.phone.:` + this.fq.phone + ',';
    }
    if (this.fq.email != '') {
      this.query = this.query + `a.email.:` + this.fq.email + ',';
    }
    if (this.fq.partner != '') {
      this.query = this.query + `a.partner.icontains:` + this.fq.partner + ',';
    }
    this.query = this.query.replace(/.$/g,'');
    if(this.query !== ''){
      this.paginator.pageIndex = 0;
    }
    this.apiService.APIOutstandingVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res : OutstandingVoucherRes) =>{
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin !');
        this.router.navigateByUrl('/login');
        return
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

  clearFilter(){
    this.isLoadingResults = true;
    this.query = '';
    this.fq.from_date = null;
    this.fq.through_date =  null;
    this.fq.phone = '';
    this.fq.email = '';
    this.fq.partner = '';
    this.apiService.APIOutstandingVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: OutstandingVoucherRes) => {
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


