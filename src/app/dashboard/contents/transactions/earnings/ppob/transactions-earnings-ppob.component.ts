import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    phone: '',
    cust_id: '',
    type_trans: undefined,
    product_code: '',
    product_type: undefined
  };
  buffTotalData = 0;

  displayedColumns: string[] = [
    // 'id',
    'merchant_id',
    'cust_id',
    'phone',
    'fee_amount',
    'product_code',
    'product_name',
    'product_type',
    'reff_number',
    'type_trans',
    'type_trx',
    'data',
    // 'updated_at',
    'date_time',
    'date',
    'point',
    'created_at',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;

  isLoadingResults = true;
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

  openFormExportToCSV() {
    this.dialog.open(DialogExportTransactionsEarningsPPOBToCSVComponent, {
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
    this.query = this.query.replace(/.$/g, ''); // replace tanda (,) terakhir
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
  selector: 'app-dialog-export-to-csv',
  templateUrl: './dialogs/dialog-export-to-csv.html',
  styleUrls: ['./transactions-earnings-ppob.component.css']
})
export class DialogExportTransactionsEarningsPPOBToCSVComponent implements OnInit {
  filterExportForm: FormGroup;
  get f() { return this.filterExportForm.controls; }

  isLoadingResults = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

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

  constructor(
    public dialogRef: MatDialogRef<DialogExportTransactionsEarningsPPOBToCSVComponent>,
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
      phone: '',
      cust_id: '',
      type_trans: undefined,
      product_code: '',
      product_type: undefined
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
      filename: 'user_data_' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Users Data \nDownloaded At : ' + Date().toLocaleString(),
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
    if (this.filterExportForm.value.phone !== '') {
      query = query + `phone:${this.filterExportForm.value.phone},`;
    }
    if (this.filterExportForm.value.cust_id !== '') {
      query = query + `cust_id:${this.filterExportForm.value.cust_id},`;
    }
    if (this.filterExportForm.value.type_trans !== undefined) {
      query = query + `type_trans:${this.filterExportForm.value.type_trans},`;
    }
    if (this.filterExportForm.value.product_code !== '') {
      query = query + `product_code:${this.filterExportForm.value.product_code},`;
    }
    if (this.filterExportForm.value.product_type !== undefined) {
      query = query + `product_type:${this.filterExportForm.value.product_type},`;
    }
    query = query.replace(/.$/g, '');
    this.apiService.APIGetTransactionsEarningsPPOB(
      window.localStorage.getItem('token'),
      0,
      null,
      'created_at',
      'asc',
      query
    ).subscribe((res: GetTransactionsEarningsPPOBRes) => {
      this.isLoadingResults = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.data === undefined || res.data.length === 0) {
        this.snackBar.open('Failed to export data, filtered data not found', 'close', this.matSnackBarConfig);
        return;
      }
      this.snackBar.open(`Downloading ${res.data.length} row data`, 'close', this.matSnackBarConfig);
      csvExporter.generateCsv(res.data);
      this.dialogRef.close();
    });
  }
}
