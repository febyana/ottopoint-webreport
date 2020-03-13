import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../../services/api.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetTransactionsEarningsOSPRes,
  ExportTransactionsEarningsPPOBToCSVReq,
  GetPPOBProductTypesRes,
  GetTransactionsEarningsOPLRes,
} from '../../../../../models/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from '../../../../../services/xlsx.service';

@Component({
  selector: 'app-transactions-earnings-earningopl',
  templateUrl: './transactions-earnings-earningopl.component.html',
  styleUrls: ['./transactions-earnings-earningopl.component.css']
})
export class TransactionsEarningsEarningoplComponent implements AfterViewInit, OnInit {
  query = '';
  fq = { // filter Query
    from_date: null,
    through_date: null,
    merchant_id: '',
    cust_id: '',
    phone: '',
    type_trans: undefined,
    product_name: '',
    partner: '',
    product_type: undefined,
    reff_number: '',
  };
  buffTotalData = 0;

  displayedColumns: string[] = [
  'no'
  , 'customer_id'
  , 'phone'
  , 'email'
  , 'transactions_type'
  , 'value_point'
  , 'product_code'
  , 'product_type' 
  , 'product_name'
  // , 'denom'
  // , 'selling_price'
  , 'comment'
  , 'created_At'
  , 'transactions_time'
  , 'loyaltycardno'
  , 'pos'
  , 'issuer'
  , 'reff_number'
  , 'partner'
  ];

  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight = window.screen.height * 0.35

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;

  productTypes = [];

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
    private excelService: ExcelServicesService,
  ) { }

  ngOnInit() {
    this.apiService.APIGetPPOBProductTypes(
      window.localStorage.getItem('token')
    ).subscribe((res : GetPPOBProductTypesRes) => {
      res.data.forEach(e => {
        this.productTypes.push({
          k:e,
          v:e,
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
        return this.apiService.APIGetTransactionsEarningOPL(
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
          window.alert('Login Session Expired!\nPlease Relogin');
          this.router.navigateByUrl('/login');
          return;
        }
        this.dataTableLength = res.total;
        if(res.total === 0) {
          this.isNoData = true;
          return;
        }
        this.isNoData = false;
        return res.data
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isNoData = true;
        return observableOf([]);
      })
    ).subscribe(res => this.dataTable = new MatTableDataSource(res));
  
  }
  showDialogData(rowData: string) {
    this.dialog.open(DialogShowDataComponent, {
      width : '50%',
      data : rowData,
    });
  }

  exportToCSV() {
    this.isWaitingDownload = true;

    const options = {
      filename: 'transactions_earnings_opl_' + Date().toLocaleString(),
      fieldSeparator : ',',
      quoteStrings : '"',
      decimalSeparator:'.',
      showLabels:true,
      showTitle:true,
      title:'Transactions Earnings OPL \nDownload At : '+ Date().toLocaleString(),
      useTextFile:false,
      useBom:true,
      useKeysAsHeaders:true,
    };
    const csvExporter = new ExportToCsv(options);
    this.apiService.APIGetTransactionsEarningOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res:GetTransactionsEarningsOPLRes)=>{
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
          CustomerID : e.customer_id,
          Phone : e.phone,
          Email : e.email,
          TransactionsType : e.transactions_type,
          ValuePoint : e.value_point,
          ProductCode : e.product_code,
          ProductName : e.product_name,
          ProductType : e.product_type,
          Denom : e.denom,
          SellingPrice : e.selling_price,
          Comment : e.comment,
          TransactionDate : e.created_At,
          TransactionTime : e.transactions_time,
          OPLCardNumber : e.loyaltycardno,
          Pos : e.pos,
          Issuer: e.issuer,
          ReffNo : e.reff_number,
          Partner : e.partner,
        };
        arrData.push(objData);
      });
      csvExporter.generateCsv(arrData);
    });
  }

  exportToXLSX() {
    this.isWaitingDownload = true;
    console.log('query :\n', this.query);
    this.apiService.APIGetTransactionsEarningOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsEarningsOPLRes) => {
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
            CustomerID : e.customer_id,
            Phone : e.phone,
            Email : e.email,
            TransactionsType : e.transactions_type,
            ValuePoint : e.value_point,
            ProductCode : e.product_code,
            ProductName : e.product_name,
            ProductType : e.product_type,
            Denom : e.denom,
            SellingPrice : e.selling_price,
            Comment : e.comment,
            TransactionDate : e.created_At,
            TransactionTime : e.transactions_time,
            OPLCardNumber : e.loyaltycardno,
            Pos : e.pos,
            Issuer: e.issuer,
            ReffNo : e.reff_number,
            Partner : e.partner,
          };
          arrData.push(objData);
      });
      this.excelService.exportAsExcelFile(arrData, 'transactions_earnings_opl_');
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
    if (this.fq.phone !== '') {
      this.query = this.query + 'a.customer_phone.:' + this.fq.phone + ',';
    }
    if (this.fq.cust_id !== '') {
      this.query = this.query + 'a.customer_id.:' + this.fq.cust_id + ',';
    }
    if (this.fq.reff_number !== '') {
      this.query = this.query + 'a.reff_number.:' + this.fq.reff_number + ',';
    }
    if (this.fq.product_name !== '') {
      this.query = this.query + 'a.product_name.icontains:' + this.fq.product_name + ',';
    }
    if (this.fq.partner !== '') {
      this.query = this.query + 'a.partner.icontains:' + this.fq.partner + ',';
    }
    if (this.fq.product_type !== undefined) {
      this.query = this.query + 'a.product_type.:' + this.fq.product_type + ',';
    }
    this.query = this.query.replace(/.$/g,'');
    if (this.query !== '') {
      this.paginator.pageIndex = 0;
    }
    this.apiService.APIGetTransactionsEarningOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsEarningsOPLRes) => {
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


  clearFilter(){
    this.isLoadingResults = true;
    this.query = '';
    this.fq.from_date = null;
    this.fq.through_date =  null;
    this.fq.phone = '';
    this.fq.cust_id = '';
    this.fq.type_trans = undefined;
    this.fq.product_name = '';
    this.fq.product_type = undefined;
    this.fq.partner = '';
    this.fq.reff_number = '';
    this.apiService.APIGetTransactionsEarningOPL(
      window.localStorage.getItem('token'),
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction,
      this.query
    ).subscribe((res: GetTransactionsEarningsOPLRes) => {
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
  styleUrls: ['./transactions-earnings-earningopl.component.css']
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



