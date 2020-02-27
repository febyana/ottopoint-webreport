import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {
  GetUsersRes,
} from '../../../models/models';
import { ApiService } from '../../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-bulk-upload-adjusment',
  templateUrl: './bulk-upload-adjusment.component.html',
  styleUrls: ['./bulk-upload-adjusment.component.css']
})

export class BulkUploadAdjusmentComponent implements OnInit {
  isCanCreate = JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create');

  query = '';
  fq = { // filter Query
    error_code: '',
    error_desc: '',
    data: '',
  };

  displayedColumns: string[] = [
    // 'id',
    'no',
    'error_code',
    'error_desc',
    'data',
  ];
  dataTable = new MatTableDataSource();
  dataTableLength = 0;
  tableHeight: number;

  isLoadingResults = true;
  isWaitingDownload = false;
  isNoData = false;
  fileImport : any;

  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
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
        'error_code',
        'error_desc',
        'data',
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
            console.log('query :\n', this.query);
            return this.apiService.APIGetHistoyBulk(
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
            if ( res.total === undefined) {
              this.snackBar.open('Internal Server Error', 'close', this.matSnackBarConfig);
              return;
            }
            if ( res.total === 0 ) {
              this.isNoData = true;
              return res.data;
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

    onImportFileChange(event, index) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
          this.fileImport = file;
      }
  }

  submitImport() {
      if(this.fileImport) {
          // this.blockUI.start('Loading...');
          this.apiService.APIBulkAdjustment(
            window.localStorage.getItem('token'),
            this.fileImport).subscribe(success => {
              // this.alertNotification("Import Inventories success !", "success");
              // // this.blockUI.stop();
              // this.modalRef.close();
              // this.refresh();
          },
          // error=> {
          //   this.isLoadingResults = true;
          //     this.alertNotification(error.error.message, "danger");
          //     this.blockUI.stop();
          //     this.modalRef.close();
          //     this.refresh();
          // }
          );
      }
  }

}
