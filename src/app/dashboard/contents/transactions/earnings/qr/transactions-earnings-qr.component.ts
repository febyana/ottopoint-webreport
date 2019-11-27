import { Component, ViewChild, AfterViewInit, Inject, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionQrsResponse,
  ExportTransactionQrsToCSVRequest
} from '../../../../../model/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-transactions-earnings-qr',
  templateUrl: './transactions-earnings-qr.component.html',
  styleUrls: ['./transactions-earnings-qr.component.css']
})
export class TransactionsEarningsQRComponent implements AfterViewInit {
  dataResponse: GetTransactionQrsResponse[] = [];
  exportToCSVReq: ExportTransactionQrsToCSVRequest;

  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    sender_phone: '',
    recipient_phone: ''
  };

  displayedColumns: string[] = [
    'merchant_id',
    'amount',
    'date_time',
    'created_at',
    'updated_at',
    'point',
    'cust_id',
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
          return this.apiService.APIGetTransactionQrs(
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
          return dataResponse.transaction_qrs;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isNoData = true;
          return observableOf([]);
        })
      ).subscribe(dataResponse => this.dataTable = new MatTableDataSource(dataResponse));
  }

  openFormExportToCSV() {
    this.dialog.open(DialogExportTransactionEarningsQRToCSVComponent, {
      width: '50%',
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
    if (this.fq.sender_phone !== '') {
      this.query = this.query + 'cust_id.icontains:' + this.fq.sender_phone + ',';
    }
    if (this.fq.recipient_phone !== '') {
      this.query = this.query + 'cust_id.icontains:' + this.fq.recipient_phone + ',';
    }
    this.query = this.query.replace(/.$/g, ''); // replace tanda (,) terakhir
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    this.apiService.APIGetTransactionQrs(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionQrsResponse) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.transaction_qrs;
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
    this.fq.sender_phone = '';
    this.fq.recipient_phone = '';
    this.apiService.APIGetTransactionQrs(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionQrsResponse) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.transaction_qrs;
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
  styleUrls: ['./transactions-earnings-qr.component.css']
})
export class DialogExportTransactionEarningsQRToCSVComponent implements OnInit {
  filterExportForm: FormGroup;
  get f() { return this.filterExportForm.controls; }

  isLoadingResults = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    public dialogRef: MatDialogRef<DialogExportTransactionEarningsQRToCSVComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.filterExportForm = this.formBuilder.group({
      from_date: null,
      through_date: null,
      sender_phone: '',
      recipient_phone: ''
    });
  }

  cancel(): void {
    event.preventDefault();
    this.dialogRef.close();
  }

  submit() {
    this.isLoadingResults = true;
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'transactions_qr' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Trasnsactions Qr \nDownloaded At : ' + Date().toLocaleString(),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);
    let query = '';
    if (this.filterExportForm.value.from_date !== null) {
      query = query + `created_at.gte:${
        this.datePipe.transform(this.filterExportForm.value.from_date, 'yyyy-MM-dd 07:00:00')
      },`;
    }
    if (this.filterExportForm.value.through_date !== null) {
      query = query + `created_at.lte:${
        this.datePipe.transform(
          this.filterExportForm.value.through_date.setDate(
            this.filterExportForm.value.through_date.getDate() + 1
          ), 'yyyy-MM-dd 06:59:59')
      },`;
      this.filterExportForm.value.through_date.setDate(
        this.filterExportForm.value.through_date.getDate() - 1
      );
    }
    if (this.filterExportForm.value.sender_phone !== '' || this.filterExportForm.value.recipient_phone !== '') {
      query = query + 'cust_id:';
      if (this.filterExportForm.value.sender_phone !== '') {
        query = query + this.filterExportForm.value.sender_phone;
      }
      query = query + ' || ';
      if (this.filterExportForm.value.recipient_phone !== '') {
        query = query + this.filterExportForm.value.recipient_phone;
      }
      query = query + ',';
    }
    query = query.replace(/.$/g, '');
    query = query + '&';
    this.apiService.APIGetTransactionQrs(
      window.localStorage.getItem('token'),
      0,
      null,
      'created_at',
      'asc',
      query
    ).subscribe((res: GetTransactionQrsResponse) => {
      this.isLoadingResults = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.transaction_qrs === undefined || res.transaction_qrs.length === 0) {
        this.snackBar.open('Failed to export data, filtered data not found', 'close', this.matSnackBarConfig);
        return;
      }
      this.snackBar.open(`Downloading ${res.transaction_qrs.length} row data`, 'close', this.matSnackBarConfig);
      csvExporter.generateCsv(res.transaction_qrs);
      this.dialogRef.close();
    });
  }
}
