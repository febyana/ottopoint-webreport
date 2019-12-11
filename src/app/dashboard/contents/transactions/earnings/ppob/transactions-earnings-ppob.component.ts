import { Component, ViewChild, AfterViewInit, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsEarningsPPOBRes,
  ExportTransactionsEarningsPPOBToCSVReq
} from '../../../../../model/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transactions-earnings-ppob',
  templateUrl: './transactions-earnings-ppob.component.html',
  styleUrls: ['./transactions-earnings-ppob.component.css']
})
export class TransactionsEarningsPPOBComponent implements AfterViewInit {
  exportToCSVReq: ExportTransactionsEarningsPPOBToCSVReq;

  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    merchant_id: '',
    cust_id: '',
    phone: '',
    type_trans: undefined,
    product_code: '',
    product_type: undefined,
    reff_number: '',
  };
  buffTotalData = 0;

  displayedColumns: string[] = [
    // 'id',
    'no',
    'merchant_id',
    'cust_id',
    'phone',
    'product_name',
    'product_code',
    'product_type',
    'fee_amount',
    'point',
    'type_trans',
    'reff_number',
    // 'type_trx',
    'data',
    // 'updated_at',
    // 'date_time',
    // 'date',
    'status',
    'created_at',
    'created_at_time',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;

  productTypes = [
    {k: 'NU CARE-LAZISNU (Infaq)', v: 'NU CARE-LAZISNU (Infaq)'},
    {k: 'NU CARE-LAZISNU (Zakat)', v: 'NU CARE-LAZISNU (Zakat)'},
    {k: 'game', v: 'game'},
    {k: 'isidompet', v: 'isidompet'},
    {k: 'pulsa', v: 'pulsa'},
    {k: 'plntoken', v: 'plntoken'},
    {k: 'paketdata', v: 'paketdata'},
    {k: 'lazis-NU', v: 'lazis-NU'},
    {k: 'plnpost', v: 'plnpost'},
  ];

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
          return this.apiService.APIGetTransactionsEarningsPPOB(
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
          if ( res.message === 'Invalid Token' ) {
            window.alert('Login Session Expired!\nPlease Relogin!');
            this.router.navigateByUrl('/login');
            return;
          }
          this.dataTableLength = res.total;
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

  // row is get from users.component.html
  showDialogData(rowData: string) {
    this.dialog.open(DialogShowDataComponent, {
      width: '50%',
      data: rowData,
    });
  }

  exportToCSV() {
    this.isWaitingDownload = true;
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'transactions_earnings_ppob_' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Transactions Earnings PPOB \nDownloaded At : ' + Date().toLocaleString(),
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['No', 'Merchant ID', 'Phone', 'Customer ID', 'Fee Amount',
      // 'Product Name', 'Refferance Number', 'Transactions Type', 'Product Type', 'Data',
      // 'Transaction Date', 'Product Code', 'Point']
    };
    const csvExporter = new ExportToCsv(options);
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsEarningsPPOB(
      window.localStorage.getItem('token'),
      0,
      null,
      'created_at',
      'asc',
      this.query
    ).subscribe((res: GetTransactionsEarningsPPOBRes) => {
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
          switch (e.type_trans) {
            case '2001':
              e.type_trans = 'Inqury';
              break;
            case '2002':
              e.type_trans = 'Payment';
              break;
            default:
              break;
          }
          const objData = {
            No: no++,
            Merchant_ID: e.merchant_id,
            Customer_ID: e.cust_id,
            Phone: e.phone,
            Product_Name: e.product_name,
            Product_Code: e.product_code,
            Product_Type: e.product_type,
            Fee_Amount: e.fee_amount,
            Point: e.point,
            Type_Transaction: e.type_trans,
            Reff_Number: e.reff_number,
            Data: e.data,
            Status: e.status.replace(/0|1|2|9| |\(|\)/g, ''),
            Transaction_Date: this.datePipe.transform(e.created_at, 'yyyy-MM-dd'),
            Transaction_Time: this.datePipe.transform(e.created_at, 'HH:mm:ss'),
          };
          arrData.push(objData);
        }
      });
      csvExporter.generateCsv(arrData);
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
    if (this.fq.phone !== '') {
      this.query = this.query + 'phone:' + this.fq.phone + ',';
    }
    if (this.fq.cust_id !== '') {
      this.query = this.query + 'cust_id:' + this.fq.cust_id + ',';
    }
    if (this.fq.type_trans !== undefined) {
      this.query = this.query + 'type_trans.icontains:' + this.fq.type_trans + ',';
    }
    if (this.fq.product_code !== '') {
      this.query = this.query + 'product_code:' + this.fq.product_code + ',';
    }
    if (this.fq.product_type !== undefined) {
      this.query = this.query + 'product_type.icontains:' + this.fq.product_type + ',';
    }
    if (this.fq.reff_number !== '') {
      this.query = this.query + 'reff_number:' + this.fq.reff_number + ',';
    }
    this.query = this.query.replace(/.$/g, ''); // replace tanda (,) terakhir
    console.log('query :\n', this.query);
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    this.apiService.APIGetTransactionsEarningsPPOB(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsEarningsPPOBRes) => {
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
    this.fq.phone = '';
    this.fq.cust_id = '';
    this.fq.type_trans = undefined;
    this.fq.product_code = '';
    this.fq.product_type = undefined;
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetTransactionsEarningsPPOB(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsEarningsPPOBRes) => {
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
  selector: 'app-dialog-show-data',
  templateUrl: './dialogs/dialog-show-data.html',
  styleUrls: ['./transactions-earnings-ppob.component.css']
})
export class DialogShowDataComponent implements OnInit {
  displayedColumns: string[] = [
    'key',
    'value',
  ];
  dataTable = new MatTableDataSource();

  elementDataTable: object[] = [];
  obj = {
    key: '',
    value: ''
  };

  constructor(
    public dialogRef: MatDialogRef<DialogShowDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  ngOnInit() {
    console.log(this.data);
    const arrData = this.data.split(' || ');
    for (const splitData of arrData) {
      const arrSplitData = splitData.split(' : ');
      const keys = arrSplitData[0].split('_');
      arrSplitData[0] = '';
      for (let key of keys) {
        key = key.replace(/^./g, key[0].toUpperCase());
        if (key.length <= 3) {
          key = key.toUpperCase();
        }
        arrSplitData[0] = arrSplitData[0] + key + ' ';
      }
      this.obj = {
        key: arrSplitData[0],
        value: arrSplitData[1],
      };
      this.elementDataTable.push(this.obj);
    }
    this.dataTable.data = this.elementDataTable;
  }

  close(): void {
    this.dialogRef.close();
  }
}
