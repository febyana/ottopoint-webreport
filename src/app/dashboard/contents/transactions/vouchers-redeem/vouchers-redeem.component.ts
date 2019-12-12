import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsVouchersRedeemRes,
  GetVouchersNameRes
} from '../../../../model/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from '../../../../services/xlsx.service';

@Component({
  selector: 'app-vouchers-redeem',
  templateUrl: './vouchers-redeem.component.html',
  styleUrls: ['./vouchers-redeem.component.css']
})
export class VouchersRedeemComponent implements AfterViewInit {
  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    voucher: undefined,
    product_code: '',
    product_type: undefined,
    trans_type: undefined,
    cust_id: '',
    institution: undefined,
    rrn: '',
    status: '',
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'voucher',
    'product_code',
    'product_type',
    'trans_type',
    'account_number',
    'cust_id',
    'institution',
    'rrn',
    'amount',
    'status',
    // 'date_time',
    'exp_date',
    'created_at',
    'created_at_time',
    // 'updated_at',
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

  productTypes = [
    {k: 'Pulsa', v: 'Pulsa'},
    {k: 'Game', v: 'Game'},
    {k: 'PLN', v: 'PLN'},
  ];
  vouchersName = [];

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

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.apiService.APIGetVouchersName(
      window.localStorage.getItem('token')
    ).subscribe((res: GetVouchersNameRes) => {
      res.data.forEach(e => {
        this.vouchersName.push({
          k: e,
          v: e,
        });
      });
    });
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          console.log('query :\n', this.query);
          return this.apiService.APIGetTransactionsVouchersRedeem(
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

  exportToCSV() {
    this.isWaitingDownload = true;
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'transactions_vouchers_redeem_' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Trasnsactions Vouchers Redeem \nDownloaded At : ' + Date().toLocaleString(),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['No', 'Account Number', 'Voucher', 'Customer ID', 'RRN',
      // 'Product Code', 'Amount', 'Transactions Type', 'status', 'Institution', 'Transaction Date']
    };
    const csvExporter = new ExportToCsv(options);
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsVouchersRedeem(
      window.localStorage.getItem('token'),
      0,
      null,
      'created_at',
      'asc',
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemRes) => {
      this.isWaitingDownload = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.total === 0) {
        this.snackBar.open('Failed to export data, filtered data not found', 'close', this.matSnackBarConfig);
        return;
      }
      // this.snackBar.open(`Downloading ${res.data.length} row data`, 'close', this.matSnackBarConfig);
      const arrData = [];
      let no = 1;
      res.data.forEach((e) => {
        if (typeof e === 'object' ) {
          const objData = {
            No: no++,
            Voucher_Name: e.voucher,
            Product_Code: e.product_code,
            Product_Type: e.product_type,
            Trasnsaction_Type: e.trans_type,
            Customer_ID: e.cust_id,
            Institution: e.institution,
            Reff_Number: e.rrn,
            Amount: e.account_number,
            Status: e.status.replace(/0|1|2|9| |\(|\)/g, ''),
            Expired_Date: e.exp_date,
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
    this.apiService.APIGetTransactionsVouchersRedeem(
      window.localStorage.getItem('token'),
      0,
      null,
      'created_at',
      'asc',
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemRes) => {
      this.isWaitingDownload = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.total === 0) {
        this.snackBar.open('Failed to export data, filtered data not found', 'close', this.matSnackBarConfig);
        return;
      }
      // this.snackBar.open(`Downloading ${res.data.length} row data`, 'close', this.matSnackBarConfig);
      const arrData = [];
      let no = 1;
      res.data.forEach((e) => {
        if (typeof e === 'object' ) {
          const objData = {
            No: no++,
            Voucher_Name: e.voucher,
            Product_Code: e.product_code,
            Product_Type: e.product_type,
            Trasnsaction_Type: e.trans_type,
            Customer_ID: e.cust_id,
            Institution: e.institution,
            Reff_Number: e.rrn,
            Amount: e.account_number,
            Status: e.status.replace(/0|1|2|9| |\(|\)/g, ''),
            Expired_Date: e.exp_date,
            Transaction_Date: this.datePipe.transform(e.created_at, 'yyyy-MM-dd'),
            Transaction_Time: this.datePipe.transform(e.created_at, 'HH:mm:ss'),
          };
          arrData.push(objData);
        }
      });
      this.excelService.exportAsExcelFile(arrData, 'sample');
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
        this.datePipe.transform(this.fq.through_date, 'yyyy-MM-dd 23:59:59')
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
    if (this.fq.voucher !== undefined) {
      this.query = this.query + 'voucher.icontains:' + this.fq.voucher + ',';
    }
    if (this.fq.product_code !== '') {
      this.query = this.query + 'product_code:' + this.fq.product_code + ',';
    }
    if (this.fq.product_type !== undefined) {
      this.query = this.query + 'product_type:' + this.fq.product_type + ',';
    }
    if (this.fq.trans_type !== undefined) {
      this.query = this.query + 'trans_type:' + this.fq.trans_type + ',';
    }
    if (this.fq.cust_id !== '') {
      this.query = this.query + 'cust_id:' + this.fq.cust_id + ',';
    }
    if (this.fq.rrn !== '') {
      this.query = this.query + 'rrn:' + this.fq.rrn + ',';
    }
    if (this.fq.institution !== undefined) {
      this.query = this.query + 'institution:' + this.fq.institution + ',';
    }
    if (this.fq.status !== '') {
      this.query = this.query + 'status.icontains:' + this.fq.status + ',';
    }
    // replace tanda (,) terakhir
    this.query = this.query.replace(/.$/g, '');
    // balik ke page pertama jika filter tidak kosong
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsVouchersRedeem(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemRes) => {
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
    this.fq.voucher = undefined;
    this.fq.product_code = '';
    this.fq.trans_type = undefined;
    this.fq.cust_id = '';
    this.fq.institution = undefined;
    this.fq.rrn = '';
    this.fq.status = '';
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetTransactionsVouchersRedeem(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemRes) => {
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
