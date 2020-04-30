import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetDataPartnerRes,GetDataPartner,GetDataPartnerResp,DataPatnerView,ViewStore,FileDownload, 
  EditDataPartner, EditDataPartnerReq, DownloadFileRes,
  ChangeStatusPartnerRes,
  ChangeStatusPartner,
} from '../../../../models/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ExcelServicesService } from '../../../../services/xlsx.service';
import {MatSelectionList, JAN} from '@angular/material';
import { JSDocTagName } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-data-partner',
  templateUrl: './data-partner.component.html',
  styleUrls: ['./data-partner.component.css']
})
export class DataPartnerComponent implements OnInit {
  ChangeStatusPartner: ChangeStatusPartner;

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
  DataPatner: GetDataPartner;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  matSnackBarConfig: MatSnackBarConfig<any>;

  constructor(
    // public dialogRef: MatDialogRef<DialogViewDataPatnerComponent>,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private excelService: ExcelServicesService,
  ) {}

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
      'is_active',
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

    openFormChangeStatusPartner(row: GetDataPartner) {

    const dialogRef = this.dialog.open(DialogStatusPartnerComponent, {
      width: '50%',
      data: this.ChangeStatusPartner = {
        id: row.id,
        is_active: row.is_active,
      },

    });

    dialogRef.afterClosed().subscribe(valid => {
      if (valid === true) {
        this.isLoadingResults = true;
        console.log('query :\n', this.query);
        this.apiService.APIGetDataPartner(
          window.localStorage.getItem('token'),
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.sort.active,
          this.sort.direction,
          this.query
        ).subscribe((res: GetDataPartnerRes) => {
          this.dataTable.data = res.data;
          this.isLoadingResults = false;
        });
      }
    });
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

  View(row:GetDataPartner){
    console.log(row.name)
    const dialogRef = this.dialog.open(DialogViewDataPatnerComponent, {
      width: '50%',
      data : this.DataPatner = row
    });

  }

  Edit(row:GetDataPartner){
    console.log(row.name)
    const dialogRef = this.dialog.open(DialogEditDataPatnerComponent, {
      width: '50%',
      data : this.DataPatner = row
    });

  }
}

// ========= Dialog View Data Partner ==========

@Component({
  selector: 'app-dialog-view-datapatner',
  templateUrl: './dialog-view/dialog-view-datapatner.html',
  styleUrls: ['./data-partner.component.css']
})
export class DialogViewDataPatnerComponent implements OnInit {

  fileSelectionList: MatSelectionList;
  constructor(
    public dialogRef: MatDialogRef<DialogViewDataPatnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetDataPartner,
    private apiService: ApiService,
    public dialog: MatDialog,
  ) {}

  dataPatner    : DataPatnerView ;
  dataStore     : ViewStore[];
  dataFile      : FileDownload[];
  countFile     : number;
  countStore    : number;
  textClock     : boolean;
  pathSelected  : string;


  getData(){
    this.textClock = true;
    this.apiService.APIGetPatnerByID(
      this.data.id,
      window.localStorage.getItem('token')
    ).subscribe((res:GetDataPartnerResp) =>{
      if (res.Meta.code != 200){
        this.dialogRef.close();
        alert(res.Meta.message);
      }
      
        this.dataPatner = res.Data;
        this.dataStore = res.Data.store;

        this.dataFile = res.Data.file;
        this.countFile = (res.Data.file).length;
        this.countStore = (res.Data.store).length;
        

    },(err : any) =>{
      alert(err)
    });
  }


  downloadFile(pth){
    console.log(pth)
    this.apiService.APIDownloadFile(pth, window.localStorage.getItem('token')
    ).subscribe((res:any) => {
      if (res.Meta.code != 200){
        alert(res.Meta.message);
      } else {
      const url = this.apiService.URLDownloadFile + `filePath=` + pth
      window.open(url)
      }
      if (res.code == 203){
        alert("Invalid Token");
      }
    },(err : any) =>{
      const url = this.apiService.URLDownloadFile + `filePath=` + pth
      window.open(url)
    });
  }

  close(){
    this.dialogRef.close();
  }
  approved(){
    this.dialogRef.close();
    const dialogRef = this.dialog.open(DialogApproval1Component, {
      width: '50%',
    });
  }
  ngOnInit(){
    this.getData()
  }
}



// ========= Dialog Edit Data Partner ==========



@Component({
  selector: 'app-dialog-edit-datapatner',
  templateUrl: './dialog/dialog-edit-datapatner.html',
  styleUrls: ['./data-partner.component.css']
})

export class DialogEditDataPatnerComponent implements OnInit {

  checkedBL = false;
  checkedWL = false;
  fileSelectionList: MatSelectionList;
  isDisabled = false;
  req : EditDataPartnerReq;
  userType : string;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    public dialogRef: MatDialogRef<DialogEditDataPatnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GetDataPartner,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  // dataPatner : DataPatnerView ;
  residenceAddress : any;
  address : any;
  phone : any;
  name : any;
  businessType : any;
  picEmail : any;
  picName : any;
  picPhone : any;
  taxNumber : any;
  // typeUser : number;
  status : any;

  dataStore : ViewStore[];
  dataFile : FileDownload[];
  countFile : number;
  countStore : number;
  companyName : string;
  textClock : boolean;
  pathSelected : string;

  isLoadingResults = true;

  getData(){
    this.apiService.APIGetPatnerByID(
      this.data.id,
      window.localStorage.getItem('token')
    ).subscribe((res:GetDataPartnerResp) =>{
      if (res.Meta.code != 200){
        this.dialogRef.close();
        alert(res.Meta.message);
      }
      
      console.log("typeUser awal : ", res.Data.userType)
        // this.dataPatner = res.Data;
        this.residenceAddress = res.Data.residenceAddress
        this.address = res.Data.address
        this.phone = res.Data.phone
        this.name = res.Data.name
        this.businessType = res.Data.businessType
        this.picEmail = res.Data.picEmail
        this.picName = res.Data.picName
        this.picPhone = res.Data.picPhone
        this.taxNumber = res.Data.taxNumber
        // this.typeUser = res.Data.userType

        this.dataStore = res.Data.store;

        this.dataFile = res.Data.file;
        this.countFile = (res.Data.file).length;
        this.countStore = (res.Data.store).length;

        console.log("typeUser : ", res.Data.userType)
        if (res.Data.userType === 0) {
          this.checked(true, false)
        } else if (res.Data.userType === 1) {
          this.checked(false, true)
        } else {
          this.checked(false, false)
        }
        

    },(err : any) =>{
      alert(err)
    });
  }

  ngOnInit(){
    console.log("masuk di componen DialogViewDataPatnerComponent : ", this.data.id)
    this.companyName = "PT Ottodigital Group"

    // console.log("typeUser 2 : ", this.typeUser)
    this.getData()
  }

  checked(x: boolean, y:boolean) {
    this.checkedBL = x;
    this.checkedWL = y;
  }

  downloadFile(pth){
    console.log(pth)
    const url = 'http://127.0.0.1:8819/' + pth
    console.log(url)
    // window.open(url)
    window.location.href = url;
  }

  close(){
    this.dialogRef.close();
  }

  save() {
    event.preventDefault(); // mencegah form untuk refresh page
    this.isLoadingResults = true;
    console.log('CheckButton 1 :\n', this.checkedBL);
    console.log('CheckButton 2 :\n', this.checkedWL);

    if (this.checkedBL === false) {
      this.userType = 'BlackList'
      console.log('userType BL :\n', this.userType);
    } else if (this.checkedWL === false) {
      this.userType = 'WhiteList'
      console.log('userType WL :\n', this.userType);
    }

    console.log('userType :\n', this.userType);


    this.req = {
      alamatDomisili    : this.residenceAddress,
      alamatPerusahaan  : this.address,
      phoneNumber       : this.phone,
      namaPerusahaan    : this.name,
      jenisUsaha        : this.businessType,
      picEmail          : this.picEmail,
      picNama           : this.picName,
      picPhone          : this.picPhone,
      status            : 'Approved',
      taxNumber         : this.taxNumber,
      typeUser          : this.userType,
    }

    console.log('Edit Data Partner :\n', this.req);
    this.apiService.APIUpdateDataPartner(
      this.req,
      this.data.id,
      window.localStorage.getItem('token')
    ).subscribe((res: EditDataPartner) => {
      console.log('Response Update Data Partner :\n', res);
      if (res.Meta.code !== 200 ) {
        // this.dialogRef.close(true);
        console.log('Response Update Data Partner :\n', res);
        // window.alert('Gagal Ubah Data');
        this.snackBar.open(res.Meta.message, 'close', this.matSnackBarConfig);
        this.dialogRef.close(true);
        // this.router.navigateByUrl('/program-management/data-partner');
        return;
      }

      this.isLoadingResults = false;
      this.dialogRef.close(false);
      this.snackBar.open(res.Meta.message, 'close', this.matSnackBarConfig);
    });
    this.isLoadingResults = false;
  }
  

}
//// ChngaeStatus

@Component({
  selector: 'app-dialog-status-partner',
  templateUrl: './dialogs/dialog-status-partner.html',
  styleUrls: ['./data-partner.component.css']
})

export class DialogStatusPartnerComponent implements OnInit {
  dataForm: FormGroup;
  get f() { return this.dataForm.controls; }

  isLoadingResults = false;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    public dialogRef: MatDialogRef<DialogStatusPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangeStatusPartner,
    private formBuilder: FormBuilder,
    // private x: boolean,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      id: [this.data.id, Validators.required],
      // status: [this.data.status, Validators.required]
  });
  }

  no(): void {
    event.preventDefault();
    this.dialogRef.close();
  }

  yes() {
    event.preventDefault();
    this.isLoadingResults = true;

    if (this.data.is_active === true) {
      this.data.is_active = false
    } else {
      this.data.is_active = true
    }

    this.data = {
        id: this.dataForm.value.id,
        is_active: this.data.is_active,
    }
    console.log('query :\n', this.data);
    this.apiService.APIChangeStatusPartner(
        window.localStorage.getItem('token'),
        this.data,
    ).subscribe((res: ChangeStatusPartnerRes) => {
        this.isLoadingResults = false;
        if (res.data !== null) {
            this.dialogRef.close(true);
            return;
        }
        // this.dialogRef.close(false);
        this.snackBar.open(res.meta.message, 'close', this.matSnackBarConfig);
        return;
    });


  }


  
}

@Component({
  selector: 'app-dialog-approval1',
  templateUrl: './dialog-view/dialog-approval1.html',
  styleUrls: ['./data-partner.component.css']
})
export class DialogApproval1Component implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogApproval1Component>,

    private apiService: ApiService,
    public dialog: MatDialog,
  ) {}

  doApproved(){
    this.dialogRef.close();
    const dialogRef = this.dialog.open(PopUpApprovalComponent, {
      width: '50%',
    });
  }

  cencel(){
    this.dialogRef.close();
  }

  ngOnInit(){

  }
}

@Component({
  selector: 'app-popup1-approval',
  templateUrl: './dialog-view/popup1-approval.html',
  styleUrls: ['./data-partner.component.css']
})
export class PopUpApprovalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PopUpApprovalComponent>,
  ){}
  ngOnInit(){
  }
}