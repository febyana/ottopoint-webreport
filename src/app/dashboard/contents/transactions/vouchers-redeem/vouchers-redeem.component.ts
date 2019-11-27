import { Component, ViewChild, AfterViewInit, Inject, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsVouchersRedeemRes,
} from '../../../../model/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

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
    nama: '',
    phone: '',
    rc: '',
    voucher: '',
    campaign_id: '',
    coupon_id: '',
    product_code: '',
  };

  displayedColumns: string[] = [
    // 'id',
    'nama',
    'phone',
    'rc',
    'voucher',
    'campaign_id',
    'coupon_id',
    'product_code',
    // 'updated_at',
    'created_at'
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

  openFormExportToCSV() {
    this.dialog.open(DialogExportTransactionsVouchersRedeemToCSVComponent, {
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
    if (this.fq.nama !== '') {
      this.query = this.query + 'nama.icontains:' + this.fq.nama + ',';
    }
    if (this.fq.phone !== '') {
      this.query = this.query + 'phone:' + this.fq.phone + ',';
    }
    if (this.fq.rc !== '') {
      this.query = this.query + 'rc.icontains:' + this.fq.rc + ',';
    }
    if (this.fq.voucher !== '') {
      this.query = this.query + 'voucher.icontains:' + this.fq.voucher + ',';
    }
    if (this.fq.campaign_id !== '') {
      this.query = this.query + 'campaign_id.icontains:' + this.fq.campaign_id + ',';
    }
    if (this.fq.coupon_id !== '') {
      this.query = this.query + 'coupon_id.icontains:' + this.fq.coupon_id + ',';
    }
    if (this.fq.product_code !== '') {
      this.query = this.query + 'product_code.icontains:' + this.fq.product_code + ',';
    }
    // replace tanda (,) terakhir
    this.query = this.query.replace(/.$/g, '');
    // balik ke page pertama jika filter tidak kosong
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
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
    this.fq.nama = '';
    this.fq.phone = '';
    this.fq.rc = '';
    this.fq.voucher = '';
    this.fq.campaign_id = '';
    this.fq.coupon_id = '';
    this.fq.product_code = '';
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

@Component({
  selector: 'app-dialog-export-to-csv',
  templateUrl: './dialogs/dialog-export-to-csv.html',
  styleUrls: ['./vouchers-redeem.component.css']
})
export class DialogExportTransactionsVouchersRedeemToCSVComponent implements OnInit {
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
    public dialogRef: MatDialogRef<DialogExportTransactionsVouchersRedeemToCSVComponent>,
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
      nama: '',
      phone: '',
      rc: '',
      voucher: '',
      campaign_id: '',
      coupon_id: '',
      product_code: '',
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
    if (this.filterExportForm.value.nama !== '') {
      query = query + 'nama.icontains:' + this.filterExportForm.value.nama + ',';
    }
    if (this.filterExportForm.value.phone !== '') {
      query = query + 'phone:' + this.filterExportForm.value.phone + ',';
    }
    if (this.filterExportForm.value.rc !== '') {
      query = query + 'rc.icontains:' + this.filterExportForm.value.rc + ',';
    }
    if (this.filterExportForm.value.voucher !== '') {
      query = query + 'voucher.icontains:' + this.filterExportForm.value.voucher + ',';
    }
    if (this.filterExportForm.value.campaign_id !== '') {
      query = query + 'campaign_id.icontains:' + this.filterExportForm.value.campaign_id + ',';
    }
    if (this.filterExportForm.value.coupon_id !== '') {
      query = query + 'coupon_id.icontains:' + this.filterExportForm.value.coupon_id + ',';
    }
    if (this.filterExportForm.value.product_code !== '') {
      query = query + 'product_code.icontains:' + this.filterExportForm.value.product_code + ',';
    }
    query = query.replace(/.$/g, '');
    query = query + '&';
    this.apiService.APIGetTransactionsVouchersRedeem(
      window.localStorage.getItem('token'),
      0,
      null,
      'created_at',
      'asc',
      query
    ).subscribe((res: GetTransactionsVouchersRedeemRes) => {
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
