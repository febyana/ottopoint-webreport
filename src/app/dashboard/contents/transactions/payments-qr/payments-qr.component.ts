import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetPaymentQrsResponse,
  ExportPaymentQrsToCSVRequest
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
  dataResponse: GetPaymentQrsResponse[] = [];
  exportToCSVReq: ExportPaymentQrsToCSVRequest;

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

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe
  ) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.apiService.APIGetPaymentQrs(
            window.localStorage.getItem('token'),
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.query
          );
        }),
        map(dataResponse => {
          this.dataTableLength = dataResponse.total;
          if (this.buffTotalData === 0) {
            this.buffTotalData = dataResponse.total;
          }
          this.isLoadingResults = false;
          if ( dataResponse.message === 'Invalid Token' ) {
            window.alert('Login Session Expired!\nPlease Relogin!');
            this.router.navigateByUrl('/login');
            return;
          }
          if ( dataResponse.total === 0 ) {
            this.isNoData = true;
            return;
          }
          this.isNoData = false;
          return dataResponse.payment_qrs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isNoData = true;
          return observableOf([]);
        })
      ).subscribe(dataResponse => this.dataTable = new MatTableDataSource(dataResponse));
  }

  openFormExportToCSV() {
    this.dialog.open(DialogExportPaymentsQRToCSVComponent, {
      width: '50%',
      data: this.exportToCSVReq = {
        total: this.buffTotalData
      }
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
      this.query = this.query + 'merchant_id.icontains:' + this.fq.merchant_id + ',';
    }
    if (this.fq.phone !== '') {
      this.query = this.query + 'phone.icontains:' + this.fq.phone + ',';
    }
    if (this.fq.amount !== '') {
      this.query = this.query + 'amount.icontains:' + this.fq.amount + ',';
    }
    if (this.fq.account_number !== '') {
      this.query = this.query + 'account_number.icontains:' + this.fq.account_number + ',';
    }
    if (this.fq.rrn !== '') {
      this.query = this.query + 'rrn.icontains:' + this.fq.rrn + ',';
    }
    this.query = this.query.replace(/.$/g, ''); // replace tanda (,) terakhir
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    this.apiService.APIGetPaymentQrs(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetPaymentQrsResponse) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.payment_qrs;
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
    this.apiService.APIGetPaymentQrs(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetPaymentQrsResponse) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.payment_qrs;
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
  selector: 'app-dialog-export-to-csv',
  templateUrl: './dialogs/dialog-export-to-csv.html',
  styleUrls: ['./payments-qr.component.css']
})
export class DialogExportPaymentsQRToCSVComponent implements OnInit {
  isLoadingResults = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    public dialogRef: MatDialogRef<DialogExportPaymentsQRToCSVComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExportPaymentQrsToCSVRequest,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close();
  }

  ok() {
    this.isLoadingResults = true;
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
    this.apiService.APIGetPaymentQrs(
      window.localStorage.getItem('token'),
      0,
      this.data.total,
      'id',
      'asc',
      ''
    ).subscribe((res: GetPaymentQrsResponse) => {
      this.isLoadingResults = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.payment_qrs === undefined || res.payment_qrs.length === 0) {
        this.snackBar.open('Failed to export data, data not found', 'close', this.matSnackBarConfig);
        return;
      }
      this.dialogRef.close();
      csvExporter.generateCsv(res.payment_qrs);
      this.snackBar.open(`Downloading ${res.payment_qrs.length} row data`, 'close', this.matSnackBarConfig);
    });
  }
}
