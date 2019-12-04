import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsPaymentsQRRes,
  ExportTransactionsPaymentsQRToCSVRequest
} from '../../../../model/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


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
    phone: '',
    amount: '',
    account_number: '',
    rrn: ''
  };
  buffTotalData = 0;

  displayedColumns: string[] = [
    // 'id',
    'merchant_id',
    'phone',
    'amount',
    'account_number',
    'rrn',
    'created_at',
    'updated_at',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;

  isLoadingResults = true;
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
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'payment_qr_data_' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Payment Qr Data',
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
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.data === undefined || res.data.length === 0) {
        this.snackBar.open('Failed to export data', 'close', this.matSnackBarConfig);
        return;
      }
      csvExporter.generateCsv(res.data);
      this.snackBar.open(`Downloading ${res.data.length} row data`, 'close', this.matSnackBarConfig);
    });
  }

  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.from_date !== null) {
      this.query = this.query + `created_at.gte:${
        this.datePipe.transform(this.fq.from_date, 'yyyy-MM-dd 07:00:00')
      },`;
    }
    if (this.fq.through_date !== null) {
      this.query = this.query + `created_at.lte:${
        this.datePipe.transform(
          this.fq.through_date.setDate(
            this.fq.through_date.getDate() + 1
          ), 'yyyy-MM-dd 06:59:59')
      },`;
      this.fq.through_date.setDate(
        this.fq.through_date.getDate() - 1
      );
    }
    if (this.fq.merchant_id !== '') {
      this.query = this.query + 'merchant_id:' + this.fq.merchant_id + ',';
    }
    if (this.fq.phone !== '') {
      this.query = this.query + 'phone:' + this.fq.phone + ',';
    }
    if (this.fq.amount !== '') {
      this.query = this.query + 'amount:' + this.fq.amount + ',';
    }
    if (this.fq.account_number !== '') {
      this.query = this.query + 'account_number:' + this.fq.account_number + ',';
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
    this.fq.phone = '';
    this.fq.amount = '';
    this.fq.account_number = '';
    this.fq.rrn = '';
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
}

