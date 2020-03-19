import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsRedeemPointOplRes,
  GetVouchersNameRes
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
  selector: 'app-redeem-point-opl',
  templateUrl: './redeem-point-opl.component.html',
  styleUrls: ['./redeem-point-opl.component.css']
})
export class RedeemPointOplComponent implements OnInit {
  [x: string]: any;
  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    product_name: undefined,
    product_type: undefined,
    product_code: '',
    customer_id: '',
    partner: undefined,
    rrn: '',
    voucher: undefined,
  };

  displayedColumns: string[] = [
    // 'id',
    'customer_id',
    'customerPhone',
    'customerEmail', 
    'type_trx',
    'value',
    'product_code',
    'product_type',
    'product_name',
    'comment',
    'createdAt',
    'timeTrx',
    'customerLoyaltyCardNumber',
    'pos',
    'issuer',
    'rrn',
    'partner',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  matSnackBarConfig: MatSnackBarConfig<any>;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private excelService: ExcelServicesService,
  ) {}
  vouchersName = [];
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
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          //console.log('query :\n', this.query);
          return this.apiService.APIGetTransactionsRedeemPointOPL(
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

    const options = {
      filename: 'transactions_redeem_point_OPL' + Date().toLocaleString(),
      fieldSeparator : ',',
      quoteStrings : '"',
      decimalSeparator:'.',
      showLabels:true,
      showTitle:true,
      title:'Transactions Redeem Vouchers OPL \nDownload At : '+ Date().toLocaleString(),
      useTextFile:false,
      useBom:true,
      useKeysAsHeaders:true,
    };
    const csvExporter = new ExportToCsv(options);
    this.apiService.APIGetTransactionsRedeemPointOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res:GetTransactionsRedeemPointOplRes)=>{
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
          customer_id : e.customer_id,
          customerPhone : e.customerPhone,
          customerEmail : e.customerEmail,
          type_trx :e.type_trx,
          value : e.value,
          product_code : e.product_code,
          product_type : e.product_type,
          product_name : e.product_name,
          comment: e.comment,
          date_trx: e.createdAt.substr(0,10),
          time_trx: e.timeTrx.substr(11,8),
          customerLoyaltyCardNumber: e.customerLoyaltyCardNumber,
          pos: e.pos,
          issuer: e.issuer,
          rrn: e.rrn,
          partner: e.partner,
        };
        arrData.push(objData);
      });
      csvExporter.generateCsv(arrData);
    });
  }
  exportToXLSX() {
    this.isWaitingDownload = true;
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsRedeemPointOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsRedeemPointOplRes) => {
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
          customer_id : e.customer_id,
          customerPhone : e.customerPhone,
          customerEmail : e.customerEmail,
          type_trx :e.type_trx,
          value : e.value,
          product_code : e.product_code,
          product_type : e.product_type,
          product_name : e.product_name,
          comment: e.comment,
          date_trx: e.createdAt.substr(0,10),
          time_trx: e.timeTrx.substr(11,8),
          customerLoyaltyCardNumber: e.customerLoyaltyCardNumber,
          pos: e.pos,
          issuer: e.issuer,
          rrn: e.rrn,
          partner: e.partner,
          };
          arrData.push(objData);
      });
      this.excelService.exportAsExcelFile(arrData, 'transactions_redeem_point_OPL');
    });
  }
  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.from_date !== null) {
      this.query = this.query + `a.date_trx.gte:${
        this.datePipe.transform(this.fq.from_date, 'yyyy-MM-dd 00:00:00')
      },`;
    }
      if (this.fq.through_date !== null) {
        this.query = this.query + `a.date_trx.lte:${
          this.datePipe.transform(this.fq.through_date, 'yyyy-MM-dd 24:00:00')
        },`;
    }
    if (this.fq.partner !== undefined) {
      this.query = this.query + 'a.partner.:' + this.fq.partner + ',';
    }
    if (this.fq.voucher !== undefined) {
      this.query = this.query + 'a.product_name.:' + this.fq.voucher + ',';
    }
    if (this.fq.product_type !== undefined) {
      this.query = this.query + 'a.product_type.:' + this.fq.product_type + ',';
    }
    if (this.fq.customer_id !== '') {
      this.query = this.query + 'a.customer_id.:' + this.fq.customer_id + ',';
    }
    if (this.fq.rrn !== '') {
      this.query = this.query + 'a.rrn.:' + this.fq.rrn + ',';
    }
    // replace tanda (,) terakhir
    this.query = this.query.replace(/.$/g, '');
    // balik ke page pertama jika filter tidak kosong
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsRedeemPointOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsRedeemPointOplRes) => {
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
    this.fq.product_code = undefined;
    this.fq.product_type = undefined;
    this.fq.customer_id = '';
    this.fq.partner = undefined;
    this.fq.rrn = '';
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetTransactionsRedeemPointOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsRedeemPointOplRes) => {
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

