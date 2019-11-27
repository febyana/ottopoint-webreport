import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../shared/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './menus/sidebar/sidebar.component';

import { AnalyticsComponent } from './contents/analytics/analytics.component';
import {
  UsersComponent,
  DialogAddEligibleComponent,
  DialogRegisterComponent,
  DialogExportUsersToCSVComponent
} from './contents/users/users.component';
import {
  TransactionsEarningsPPOBComponent,
  DialogExportTransactionsEarningsPPOBToCSVComponent,
} from './contents/transactions/earnings/ppob/transactions-earnings-ppob.component';
import {
  TransactionsEarningsQRComponent,
  DialogExportTransactionEarningsQRToCSVComponent
} from './contents/transactions/earnings/qr/transactions-earnings-qr.component';
import {
  PaymentsQRComponent,
  DialogExportPaymentsQRToCSVComponent
} from './contents/transactions/payments-qr/payments-qr.component';
import {
  VouchersRedeemComponent,
  DialogExportTransactionsVouchersRedeemToCSVComponent
} from './contents/transactions/vouchers-redeem/vouchers-redeem.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    UsersComponent,
    AnalyticsComponent,
    TransactionsEarningsPPOBComponent,
    TransactionsEarningsQRComponent,
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    DialogExportUsersToCSVComponent,
    DialogExportTransactionsEarningsPPOBToCSVComponent,
    DialogExportTransactionEarningsQRToCSVComponent,
    PaymentsQRComponent,
    DialogExportPaymentsQRToCSVComponent,
    VouchersRedeemComponent,
    DialogExportTransactionsVouchersRedeemToCSVComponent
  ],
  entryComponents: [
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    DialogExportUsersToCSVComponent,
    DialogExportTransactionsEarningsPPOBToCSVComponent,
    DialogExportTransactionEarningsQRToCSVComponent,
    DialogExportPaymentsQRToCSVComponent,
    DialogExportTransactionsVouchersRedeemToCSVComponent
  ],
  providers: [DatePipe],
  imports: [ CommonModule, DashboardRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule ],
  exports: [ DashboardRoutingModule ]
})
export class DashboardModule { }
