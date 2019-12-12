import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../../../services/api/api.service';
import {
  GetSettingsVariablesTransactionsRes,
  PutSettingsVariablesTransactionsReq,
  PutSettingsVariablesTransactionsRes
} from '../../../../../model/models';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-variables-transactions',
  templateUrl: './settings-variables-transactions.component.html',
  styleUrls: ['./settings-variables-transactions.component.css']
})
export class SettingsVariablesTransactionsComponent implements AfterViewInit {
  putSettingsVariablesTransactionsReq: PutSettingsVariablesTransactionsReq;
  id: number;
  transaksiPPOB: number;
  transaksiPayQr: number;
  transaksiMerchant: number;
  limitTransaksi: number;
  minimalTransaksi: number;
  isDisabled = true;
  isSaveDisabled = true;
  isCancelDisabled = true;
  isEditDisabled = false;
  matSnackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    panelClass: ['snack-bar-ekstra-css']
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngAfterViewInit() {
    this.apiService.APIGetSettingsVariablesTransactions(window.localStorage.getItem('token'), 0, 1, '', '', '')
    .subscribe((res: GetSettingsVariablesTransactionsRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.id = res.data[0].id;
      this.transaksiPPOB = res.data[0].transaksi_ppob;
      this.transaksiPayQr = res.data[0].transaksi_pay_qr;
      this.transaksiMerchant = res.data[0].transaksi_merchant;
      this.limitTransaksi = res.data[0].limit_transaksi;
      this.minimalTransaksi = res.data[0].minimal_transaksi;
    });
  }

  edit() {
    this.isDisabled = false;
    this.isSaveDisabled = false;
    this.isCancelDisabled = false;
    this.isEditDisabled = true;
  }

  cancel() {
    // select
    this.apiService.APIGetSettingsVariablesTransactions(window.localStorage.getItem('token'), 0, 1, '', '', '')
    .subscribe((res: GetSettingsVariablesTransactionsRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.transaksiPPOB = res.data[0].transaksi_ppob;
      this.transaksiPayQr = res.data[0].transaksi_pay_qr;
      this.transaksiMerchant = res.data[0].transaksi_merchant;
      this.limitTransaksi = res.data[0].limit_transaksi;
      this.minimalTransaksi = res.data[0].minimal_transaksi;
    });
    this.isDisabled = true;
    this.isSaveDisabled = true;
    this.isCancelDisabled = true;
    this.isEditDisabled = false;
  }

  save() {
    if ( // validator only number
      !(Number(this.transaksiPPOB) &&
      Number(this.transaksiPayQr) &&
      Number(this.transaksiMerchant) &&
      Number(this.limitTransaksi) &&
      Number(this.minimalTransaksi))
    ) {
      return;
    }

    this.putSettingsVariablesTransactionsReq = {
      transaksi_ppob: this.transaksiPPOB,
      transaksi_pay_qr: this.transaksiPayQr,
      transaksi_merchant: this.transaksiMerchant,
      limit_transaksi: this.limitTransaksi,
      minimal_transaksi: this.minimalTransaksi,
    };

    this.apiService.APIPutSettingsVariablesTransactions(
      window.localStorage.getItem('token'),
      this.id,
      this.putSettingsVariablesTransactionsReq,
    )
    .subscribe((res: PutSettingsVariablesTransactionsRes) => {
      if ( res.message === 'Invalid Token' ) {
        window.alert('Login Session Expired!\nPlease Relogin!');
        this.router.navigateByUrl('/login');
        return;
      }
      this.transaksiPPOB = res.data.after.transaksi_ppob;
      this.transaksiPayQr = res.data.after.transaksi_pay_qr;
      this.transaksiMerchant = res.data.after.transaksi_merchant;
      this.limitTransaksi = res.data.after.limit_transaksi;
      this.minimalTransaksi = res.data.after.minimal_transaksi;
      this.snackBar.open('success', 'close', this.matSnackBarConfig);
    });
    this.isDisabled = true;
    this.isSaveDisabled = true;
    this.isCancelDisabled = true;
    this.isEditDisabled = false;
  }
}
