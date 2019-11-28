import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../../api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  GetSettingsVariablesTransactionsRes,
} from '../../../../../model/models';
import { ExportToCsv } from 'export-to-csv';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-settings-variables-transactions',
  templateUrl: './settings-variables-transactions.component.html',
  styleUrls: ['./settings-variables-transactions.component.css']
})
export class SettingsVariablesTransactionsComponent implements AfterViewInit {
  transaksiPPOB: number;
  isDisabled = true;
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  ngAfterViewInit() {
    this.apiService.APIGetSettingsVariablesTransactions(window.localStorage.getItem('token'), 0, 1, '', '', '')
    .subscribe((res: GetSettingsVariablesTransactionsRes) => {
      this.transaksiPPOB = res.data[0].transaksi_ppob;
    });
  }
}
