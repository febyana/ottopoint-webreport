import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetDataPartnerRes,
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
  selector: 'app-data-partner',
  templateUrl: './data-partner.component.html',
  styleUrls: ['./data-partner.component.css']
})
export class DataPartnerComponent implements OnInit {
  [x: string]: any;
  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    name: '',
    status: undefined,
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'partner_id',
    'name',
    'created_at', 
    'address',
    'business_type',
    'tax_number',
    'pic_name',
    'pic_email',
    'phone',
    'user_type',
    'status',
    'approve_date',
    'action',
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
 // tslint:disable-next-line:use-lifecycle-interface
 ngOnInit() {
  if (!this.isCanCreate) {
    this.displayedColumns = [
      // 'id',
      'no',
      'partner_id',
      'name',
      'created_at', 
      'address',
      'business_type',
      'tax_number',
      'pic_name',
      'pic_email',
      'phone',
      'user_type',
      'status',
      'approve_date',
      'action',
      'action1',
      'action2',
    ];
  }
}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          //console.log('query :\n', this.query);
          return this.apiService.APIGetDataPartner(
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
      filename: 'Data_Partner' + Date().toLocaleString(),
      fieldSeparator : ',',
      quoteStrings : '"',
      decimalSeparator:'.',
      showLabels:true,
      showTitle:true,
      title:'List Data Partner \nDownload At : '+ Date().toLocaleString(),
      useTextFile:false,
      useBom:true,
      useKeysAsHeaders:true,
    };
    const csvExporter = new ExportToCsv(options);
    this.apiService.APIGetDataPartner(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res:GetDataPartnerRes)=>{
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
          partner_id : e.partner_id,
          name : e.name,
          created_at : e.created_at.substr(0,10),
          address :e.address,
          business_type : e.business_type,
          tax_number : e.tax_number,
          pic_name : e.pic_name,
          pic_email : e.pic_email,
          phone: e.phone,
          user_type: e.user_type,
          status: e.status,
          approve_date: e.approve_date,
        };
        arrData.push(objData);
      });
      csvExporter.generateCsv(arrData);
    });
  }
  exportToXLSX() {
    this.isWaitingDownload = true;
    console.log('query :\n', this.query);
    this.apiService.APIGetDataPartner(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetDataPartnerRes) => {
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
          partner_id : e.partner_id,
          name : e.name,
          created_at : e.created_at.substr(0,10),
          address :e.address,
          business_type : e.business_type,
          tax_number : e.tax_number,
          pic_name : e.pic_name,
          pic_email : e.pic_email,
          phone: e.phone,
          user_type: e.user_type,
          status: e.status,
          approve_date: e.approve_date.substr(0,10),
          };
          arrData.push(objData);
      });
      this.excelService.exportAsExcelFile(arrData, 'List_Data_Partner');
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
    if (this.fq.status !== undefined) {
      this.query = this.query + 'a.status.:' + this.fq.status + ',';
    }
    if (this.fq.name !== '') {
      this.query = this.query + 'a.name.:' + this.fq.name + ',';
    }
    // replace tanda (,) terakhir
    this.query = this.query.replace(/.$/g, '');
    // balik ke page pertama jika filter tidak kosong
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    console.log('query :\n', this.query);
    this.apiService.APIGetDataPartner(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetDataPartnerRes) => {
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
    this.fq.status = undefined;
    this.fq.name = '';
    console.log('query :\n', this.query);
    this.sort.active = 'id';
    this.sort.direction = 'desc';
    this.apiService.APIGetDataPartner(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetDataPartnerRes) => {
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