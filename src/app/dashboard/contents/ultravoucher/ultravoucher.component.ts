import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import {
  GetListUltraVoucherRes, GetSKURes
} from '../../../models/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from '../../../services/xlsx.service';


@Component({
  selector: 'app-ultravoucher',
  templateUrl: './ultravoucher.component.html',
  styleUrls: ['./ultravoucher.component.css']
})
export class UltravoucherComponent implements AfterViewInit, OnInit {
  query = '';
  fq = {
    from_date : null, 
    through_date : null,
    sku :undefined,
    acc_id:'',
    voucher_id:'',
    voucher_code:'',
    status:undefined,
  }

  buffTotalData = 0;

  displayedColumns: string[] = [
    'no',
    'voucher_code',
    'voucher_id',
    'sku',
    'expiry_date_uv',
    'expiry_date_op',
    'status',
    'account_id',
    'order_no',
    'invoice_no',
    'reff_reuse',
  ];

  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;
  
  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;
  
  sku = [];

  matSnackBarConfig : MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition : 'center',
    panelClass : ['snack-bar-exstra-css']
  };

  @ViewChild(MatPaginator, {static:false}) paginator:MatPaginator;
  @ViewChild(MatSort, {static:false}) sort:MatSort;

  constructor(
    private apiService : ApiService,
    private router : Router,
    public dialog : MatDialog,
    public datePipe : DatePipe,
    private snackBar : MatSnackBar,
    private excelService : ExcelServicesService
   ) {}

  ngOnInit() {
    this.apiService.APIGetSKU(
      window.localStorage.getItem('token')
    ).subscribe((res : GetSKURes) => {
      res.data.forEach(e => {
        this.sku.push({
          k:e["name"],
          v:e["id"],
        });
      });
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.apiService.APIGetListUltraVoucher(
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
      filename: 'listultravoucher' + Date().toLocaleString(),
      fieldSeparator : ',',
      quoteStrings : '"',
      decimalSeparator:'.',
      showLabels:true,
      showTitle:true,
      title:'List Ultra Voucher \nDownload At : '+ Date().toLocaleString(),
      useTextFile:false,
      useBom:true,
      useKeysAsHeaders:true,
    };
    const csvExporter = new ExportToCsv(options);
    this.apiService.APIGetListUltraVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res:GetListUltraVoucherRes)=>{
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
          VoucherCode : e.voucher_code,
          VoucherID : e.voucher_id,
          Sku : e.sku,
          ExpiryDateUV : e.expiry_date_uv,
          ExpiryDateOP : e.expiry_date_op,
          Status : e.status,
          AccountID : e.account_id,
          OrderNo : e.order_no,
          InvoiceNO : e.invoice_no,
          ReffReuse : e.reff_reuse
        };
        arrData.push(objData);
      });
      csvExporter.generateCsv(arrData);
    });
  }

  exportToXLSX() {
    this.isWaitingDownload = true;
    this.apiService.APIGetListUltraVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetListUltraVoucherRes) => {
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
            VoucherCode : e.voucher_code,
            VoucherID : e.voucher_id,
            Sku : e.sku,
            ExpiryDateUV : e.expiry_date_uv,
            ExpiryDateOP : e.expiry_date_op,
            Status : e.status,
            AccountID : e.account_id,
            OrderNo : e.order_no,
            InvoiceNO : e.invoice_no,
            ReffReuse : e.reff_reuse
          };
          arrData.push(objData);
      });
      this.excelService.exportAsExcelFile(arrData, 'list_ultravoucher');
    });
  }
  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.from_date !== null) {
      this.query = this.query + `a.created_at.gte:${
        this.datePipe.transform(this.fq.from_date, 'yyyy-MM-dd 00:00:00')
      },`;
    }
    if (this.fq.through_date !== null) {
      this.query = this.query + `a.created_at.lte:${
        this.datePipe.transform(this.fq.through_date, 'yyyy-MM-dd 24:00:00')
      },`;
    }
    if (this.fq.sku !== undefined) {
      this.query = this.query + 'a.sku.:' + this.fq.sku + ',';
    }
    if (this.fq.acc_id !== undefined) {
      this.query = this.query + 'a.account_id.icontains:' + this.fq.acc_id + ',';
    }
    if (this.fq.voucher_id !== '') {
      this.query = this.query + 'a.voucher_id.icontains:' + this.fq.voucher_id + ',';
    }
    if (this.fq.voucher_code !== '') {
      this.query = this.query + 'a.voucher_code.icontains:' + this.fq.voucher_code + ',';
    }
    if (this.fq.status !== undefined) {
      this.query = this.query + 'a.status.:' + this.fq.status + ',';
    }
    this.query = this.query.replace(/.$/g,'');
    if(this.query !== ''){
      this.paginator.pageIndex = 0;
    }
    this.apiService.APIGetListUltraVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetListUltraVoucherRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if ( res.total === undefined) {
        this.snackBar.open('Internal Server Error', 'close', this.matSnackBarConfig);
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
  clearFilter(){
    this.isLoadingResults = true;
    this.query = '';
    this.fq.from_date = null;
    this.fq.through_date =  null;
    this.fq.acc_id = '';
    this.fq.voucher_code = '';
    this.fq.voucher_id = '';
    this.fq.sku = undefined;
    this.fq.status = undefined;
    this.apiService.APIGetListUltraVoucher(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetListUltraVoucherRes) => {
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
