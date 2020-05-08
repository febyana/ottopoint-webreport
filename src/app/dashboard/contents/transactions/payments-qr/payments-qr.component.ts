import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsPaymentsQRRes,
  ExportTransactionsPaymentsQRToCSVRequest
} from '../../../../models/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from '../../../../services/xlsx.service';

@Component({
  selector: 'app-payments-qr',
  templateUrl: './payments-qr.component.html',
  styleUrls: ['./payments-qr.component.css']
})
export class PaymentsQRComponent implements AfterViewInit {
  exportToCSVReq: ExportTransactionsPaymentsQRToCSVRequest;

  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    merchant_id: '',
    customer_id: '',
    merchant_phone: '',
    customer_phone: '',
    rrn: ''
  };
  buffTotalData = 0;

  displayedColumns: string[] = [
    // 'id',
    'no',
    'mid_merchant',
    'phone_merchant',
    'mid_customer',
    'phone_customer',
    'rrn',
    'amount',
    'point',
    // 'date_time',
    'created_at',
    'created_at_time',
    // 'updated_at',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  //tableHeight = window.screen.height * 0.35;
  tableHeight: number;

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
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private excelService: ExcelServicesService,
  ) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log('query :\n', this.query);
          return this.apiService.APIGetTransactionsPaymentsQR(
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
          if (this.buffTotalData === 0) {
            this.buffTotalData = res.total;
          }
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

  exportToCSV() {
    this.isWaitingDownload = true;
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'transactions_payments_qr_' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Trasnsactions Payments QR \nDownloaded At : ' + Date().toLocaleString(),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsPaymentsQR(
      window.localStorage.getItem('token'),
      0,
      null,
      'id',
      'asc',
      this.query
    ).subscribe((res: GetTransactionsPaymentsQRRes) => {
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
        if (typeof e === 'object' ) {
          const objData = {
            No: no++,
            MID_Merchant: e.mid_merchant,
            MID_Customer: e.mid_customer,
            Merchant_Phone: e.phone_merchant,
            Customer_Phone: e.phone_customer,
            Reff_Number: e.rrn,
            Amount: e.amount,
            Point: e.point,
            Transaction_Date: this.datePipe.transform(e.created_at, 'yyyy-MM-dd'),
            Transaction_Time: this.datePipe.transform(e.created_at, 'HH:mm:ss'),
          };
          arrData.push(objData);
        }
      });
      csvExporter.generateCsv(arrData);
    });
  }

  exportToXLSX() {
    this.isWaitingDownload = true;
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsPaymentsQR(
      window.localStorage.getItem('token'),
      0,
      null,
      'id',
      'asc',
      this.query
    ).subscribe((res: GetTransactionsPaymentsQRRes) => {
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
        if (typeof e === 'object' ) {
          const objData = {
            No: no++,
            Merchant_ID: e.mid_merchant,
            Customer_ID: e.mid_customer,
            Merchant_Phone: e.phone_merchant,
            Customer_Phone: e.phone_customer,
            Reff_Number: e.rrn,
            Amount: e.amount,
            Point: e.point,
            Transaction_Date: this.datePipe.transform(e.created_at, 'yyyy-MM-dd'),
            Transaction_Time: this.datePipe.transform(e.created_at, 'HH:mm:ss'),
          };
          arrData.push(objData);
        }
      });
      this.excelService.exportAsExcelFile(arrData, 'transactions_payments_qr_');
    });
  }

  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.from_date !== null) {
      this.query = this.query + `created_at.gte:${
        this.datePipe.transform(this.fq.from_date, 'yyyy-MM-dd 00:00:00')
      },`;
    }
    if (this.fq.through_date !== null) {
      this.query = this.query + `created_at.lte:${
        this.datePipe.transform(this.fq.through_date, 'yyyy-MM-dd 24:00:00')
      },`;
      // this.query = this.query + `created_at.lte:${
      //   this.datePipe.transform(
      //     this.fq.through_date.setDate(
      //       this.fq.through_date.getDate() + 1
      //     ), 'yyyy-MM-dd 06:59:59')
      // },`;
      // this.fq.through_date.setDate(
      //   this.fq.through_date.getDate() - 1
      // );
    }
    if (this.fq.merchant_id !== '') {
      this.query = this.query + 'merchant_id:' + this.fq.merchant_id + ',';
    }
    if (this.fq.customer_id !== '') {
      this.query = this.query + 'customer_id:' + this.fq.customer_id + ',';
    }
    if (this.fq.merchant_phone !== '') {
      this.query = this.query + 'merchant_phone:' + this.fq.merchant_phone + ',';
    }
    if (this.fq.customer_phone !== '') {
      this.query = this.query + 'customer_phone:' + this.fq.customer_phone + ',';
    }
    if (this.fq.rrn !== '') {
      this.query = this.query + 'rrn:' + this.fq.rrn + ',';
    }
    this.query = this.query.replace(/.$/g, ''); // replace tanda (,) terakhir
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsPaymentsQR(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsPaymentsQRRes) => {
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
    this.fq.from_date = null;
    this.fq.through_date =  null;
    this.fq.merchant_id = '';
    this.fq.customer_id = '';
    this.fq.merchant_phone = '';
    this.fq.customer_phone = '';
    this.fq.rrn = '';
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetTransactionsPaymentsQR(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsPaymentsQRRes) => {
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

