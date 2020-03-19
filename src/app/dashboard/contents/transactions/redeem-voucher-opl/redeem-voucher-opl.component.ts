import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsVouchersRedeemOplRes,
  GetProductNameRes,
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
  selector: 'app-redeem-voucher-opl',
  templateUrl: './redeem-voucher-opl.component.html',
  styleUrls: ['./redeem-voucher-opl.component.css']
})
export class RedeemVoucherOplComponent implements AfterViewInit, OnInit {
  [x: string]: any;
  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    product_name: undefined,
    Type: undefined,
    phone: '',
    customerName:'',
    cust_id: '',
    institution: undefined,
    vendor: undefined,
    rrn: '',
    voucher: undefined,
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'purchaseAt',
    'timeRedeem',
    'dateUsage',
    'timeUsage',
    'customerName',
    'customerLastname',
    'customerPhone',
    'customerEmail', 
    'institution',
    'vendor',
    'costInPoints',
    'campaignName',
    'product_code',
    'campaignType',
    'cust_active_point_am',
    'status',
    'dlv_stts',
    'used',
    'rrn',
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
          return this.apiService.APIGetTransactionsVouchersRedeemOPL(
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
      filename: 'transactions_redeem_vouchers_OPL' + Date().toLocaleString(),
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
    this.apiService.APIGetTransactionsVouchersRedeemOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res:GetTransactionsVouchersRedeemOplRes)=>{
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
          date_redeem : e.purchaseAt.substr(0,10),
          Time_Redeem : e.timeRedeem.substr(11,8),
          date_usage : e.dateUsage.substr(0,10),
          timeUsage :e.timeUsage.substr(11,8),
          firstname : e.customerName,
          lastname : e.customerLastname,
          Phone : e.customerPhone,
          Email : e.customerEmail,
          institution: e.institution,
          vendor: e.vendor,
          costInPoints: e.costInPoints,
          product_name: e.campaignName,
          product_code: e.product_code,
          Type: e.campaignType,
          cust_active_point_am: e.cust_active_point_am,
          status: e.status,
          dlv_stts: e.dlv_stts,
          used: e.used,
          rrn: e.rrn,
        };
        arrData.push(objData);
      });
      csvExporter.generateCsv(arrData);
    });
  }

  exportToXLSX() {
    this.isWaitingDownload = true;
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsVouchersRedeemOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemOplRes) => {
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
            date_redeem : e.purchaseAt.substr(0,10),
            Time_Redeem : e.timeRedeem.substr(11,8),
            date_usage : e.dateUsage.substr(0,10),
            timeUsage :e.timeUsage.substr(11,8),
            firstname : e.customerName,
            lastname : e.customerLastname,
            Phone : e.customerPhone,
            Email : e.customerEmail,
            institution : e.institution,
            vendor: e.vendor,
            costInPoints: e.costInPoints,
            product_name: e.campaignName,
            product_code: e.product_code,
            Type: e.campaignType,
            cust_active_point_am: e.cust_active_point_am,
            status: e.status,
            dlv_stts: e.dlv_stts,
            used: e.used,
            rrn: e.rrn,
          };
          arrData.push(objData);
      });
      this.excelService.exportAsExcelFile(arrData, 'transactions_redeem_vouchers_OPL');
    });
  }

  submitFilter() {
    this.isLoadingResults = true;
    this.query = '';
    if (this.fq.from_date !== null) {
      this.query = this.query + `a.date_redeem.gte:${
        this.datePipe.transform(this.fq.from_date, 'yyyy-MM-dd 00:00:00')
      },`;
    }
    if (this.fq.through_date !== null) {
      this.query = this.query + `a.date_usage.lte:${
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
    if (this.fq.vendor !== undefined) {
      this.query = this.query + 'a.vendor.:' + this.fq.vendor + ',';
    }
    if (this.fq.institution !== undefined) {
      this.query = this.query + 'a.institution.:' + this.fq.institution + ',';
    }
    if (this.fq.voucher !== undefined) {
      this.query = this.query + 'a.product_name.:' + this.fq.voucher + ',';
    }
    if (this.fq.Type !== undefined) {
      this.query = this.query + 'a.Type.:' + this.fq.Type + ',';
    }
    if (this.fq.cust_id !== '') {
      this.query = this.query + 'cust_id:' + this.fq.cust_id + ',';
    }
    if (this.fq.rrn !== '') {
      this.query = this.query + 'a.rrn.:' + this.fq.rrn + ',';
    }
    if (this.fq.phone != '') {
      this.query = this.query + `a.phone.:` + this.fq.phone + ',';
    }
    // replace tanda (,) terakhir
    this.query = this.query.replace(/.$/g, '');
    // balik ke page pertama jika filter tidak kosong
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsVouchersRedeemOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemOplRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.dataTable.data = res.data;
      this.dataTableLength = res.total;
      this.isNoData = false;
      console.log('data total table : ',this.dataTableLength)
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
    this.fq.Type = undefined;
    this.fq.cust_id = '';
    this.fq.institution = undefined;
    this.fq.rrn = '';
    this.fq.vendor = undefined;
    this.fq.phone = ``;
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetTransactionsVouchersRedeemOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsVouchersRedeemOplRes) => {
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
