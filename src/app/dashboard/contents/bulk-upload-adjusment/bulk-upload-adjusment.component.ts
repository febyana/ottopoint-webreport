import { Component, ViewChild, OnInit, Inject, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  HistoryBulk,
  HistoryBulkDetail,
  BulkAdjustmentResponse,
} from '../../../models/models';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { ExportToCsv } from 'export-to-csv';
import { FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-bulk-upload-adjusment',
  templateUrl: './bulk-upload-adjusment.component.html',
  styleUrls: ['./bulk-upload-adjusment.component.css']
})

export class BulkUploadAdjusmentComponent implements OnInit {
  isCanCreate = JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create');

  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };


  // query = '';
  // fq = { // filter Query
  //   date: '',
  //   file_name: '',
  //   total_data: '',
  //   success : '',
  //   gagal : ','
  // };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'date',
    'file_name',
    'total_data',
    'success',
    'gagal',
    'report',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight: number;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;
  fileImport : any;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  constructor(
    // private dialogRef: MatDialogRef,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // this.tableHeight = (window.screen.height - document.getElementById('heightFilterAndActions').offsetHeight) * 0.57;
    // console.log(
    //   'screen height :\n', window.screen.height,
    //   '\nheightFilterAndActions :\n', document.getElementById('heightFilterAndActions').offsetHeight);
    // hide action column if not have privilage
    if (!this.isCanCreate) {
      this.displayedColumns = [
        // 'id',
        'date',
        'file_name',
        'total_data',
        'success',
        'gagal',
      ];
    }
  }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit() {
      // If the user changes the sort order, reset back to the first page.
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            // this.paginator.pageIndex = 0;
            // console.log('query rohmet :\n', this.query);
            return this.apiService.APIGetHistoyBulk(
              window.localStorage.getItem('token'),
              this.paginator.pageIndex,
              this.paginator.pageSize,
              "adjustment",
            );
          }),
          map(res => {
            console.log('response history : ', res);
            this.dataTableLength = res.total;
            this.isLoadingResults = false;
            if ( res.message === 'Invalid Token' ) {
              window.alert('Login Session Expired!\nPlease Relogin!');
              this.router.navigateByUrl('/login');
              return;
            }
            if ( res.total === undefined) {
              this.snackBar.open('Internal Server Error', 'close', this.matSnackBarConfig);
              return;
            }
            if ( res.total === 0 ) {
              this.isNoData = true;
              return res.data_history;
            }
            this.isNoData = false;
            return res.data_history;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            this.isNoData = true;
            return observableOf([]);
          })
        ).subscribe(res => this.dataTable = new MatTableDataSource(res));
    }

    onImportFileChange(event, index) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
         
          let file = event.target.files[0];
          this.fileImport = file;
          console.log('log 1 : ', file)

      }
  }

  submitImport() {
    event.preventDefault();
      if(this.fileImport) {
        this.isLoadingResults = true;
        console.log('log 2 : ', this.fileImport)
          // this.blockUI.start('Loading...');
          this.apiService.APIBulkAdjustment(
            window.localStorage.getItem('token'),
            this.fileImport)
            .subscribe(res => {
              console.log('response Adjustment : ', res);
              // this.isLoadingResults = false;
              if (res.meta.message == 'Internal Server Error') {
                window.alert('Upload File Gagal');
                this.router.navigateByUrl('/upload-adjusment');
                return;
              }
              // this.dialogRef.close(false);
              let msg: any;
              // this.isLoadingResults = false;
              if (res.meta.message == 'SUCCESS') {
                msg = 'File Berhasil di Upload'
                this.snackBar.open(msg, 'close', this.matSnackBarConfig);
                this.ngAfterViewInit();
                this.fileInput.nativeElement.value = '';
                return;
              }
              this.isLoadingResults = true;
            },
            
          error=> {
            this.isLoadingResults = false;
              // window.alert('Internal Server Eror');
              window.alert('Upload File Gagal');
          }
          
          );
      }
  }

  Download(id) {
    this.isLoadingResults = true;
    console.log('Download ID : ', id);
    // https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: 'AdjustmentPoint' + Date().toLocaleString(),
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Adjustmenr Point',
      useTextFile: false,
      useBom: true,
      // useKeysAsHeaders: true,
      headers: ['Error Code', 'Error Desc', 'Line', 'Data']
    };
    const csvExporter = new ExportToCsv(options);
 
    // console.log('query :\n', this.query);
    this.apiService.APIGetHistoyBulkDetail(
      window.localStorage.getItem('token'),
     id,
    ).subscribe((res: HistoryBulkDetail) => {
      this.isWaitingDownload = false;
      if (res.message === 'Invalid Token') {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      if (res.data_history === undefined) {
        this.snackBar.open('Failed export data', 'close', this.matSnackBarConfig);
        return;
      }
      // this.snackBar.open(`Downloading ${res.total} row data`, 'close', this.matSnackBarConfig);
      // let no = 1;
      // res.data_history.forEach((e) => {
      //   if (typeof e === 'object' ) {
      //     e.id = no++;
      //   }
      // });
      csvExporter.generateCsv(res.data_history);

      this.isLoadingResults = false;
    });
  }

}
