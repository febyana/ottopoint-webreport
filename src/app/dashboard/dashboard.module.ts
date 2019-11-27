import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../shared/material.module';

import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './menus/sidebar/sidebar.component';

import {
  UsersComponent,
  DialogAddEligibleComponent,
  DialogRegisterComponent,
  DialogExportUsersToCSVComponent
} from './contents/users/users.component';

import {
  EarningTransactionsComponent,
  DialogExportTransactionsToCSVComponent,
} from './contents/transactions/earning-transactions/earning-transactions.component';
import {
  QrTransactionsComponent,
  DialogExportTransactionQrsToCSVComponent
} from './contents/transactions/qr-transactions/qr-transactions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentQrsComponent, DialogExportPaymentQrsToCSVComponent } from './contents/payment-qrs/payment-qrs.component';
import { AnalyticsComponent } from './contents/analytics/analytics.component';
import {
  RedeemVouchersComponent,
  DialogExportTransactionRedeemVouchersToCSVComponent
} from './contents/transactions/redeem-vouchers/redeem-vouchers.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    UsersComponent,
    EarningTransactionsComponent,
    QrTransactionsComponent,
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    DialogExportUsersToCSVComponent,
    DialogExportTransactionsToCSVComponent,
    DialogExportTransactionQrsToCSVComponent,
    PaymentQrsComponent,
    DialogExportPaymentQrsToCSVComponent,
    AnalyticsComponent,
    RedeemVouchersComponent,
    DialogExportTransactionRedeemVouchersToCSVComponent
  ],
  entryComponents: [
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    DialogExportUsersToCSVComponent,
    DialogExportTransactionsToCSVComponent,
    DialogExportTransactionQrsToCSVComponent,
    DialogExportPaymentQrsToCSVComponent,
    DialogExportTransactionRedeemVouchersToCSVComponent
  ],
  providers: [DatePipe],
  imports: [ CommonModule, DashboardRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule ],
  exports: [ DashboardRoutingModule ]
})
export class DashboardModule { }
