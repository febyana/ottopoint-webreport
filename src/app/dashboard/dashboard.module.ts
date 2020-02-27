import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../shared/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent, DialogChangePasswordComponent } from './dashboard.component';
import { SidebarComponent } from './menus/sidebar/sidebar.component';

import { AnalyticsComponent } from './contents/analytics/analytics.component';
import {
  UsersComponent,
  DialogAddEligibleComponent,
  DialogRegisterComponent,
  DialogStatusUsersComponent,
} from './contents/users/users.component';
import {
  TransactionsEarningsPPOBComponent,
  DialogShowDataComponent
} from './contents/transactions/earnings/ppob/transactions-earnings-ppob.component';
import {
  TransactionsEarningsQRComponent,
} from './contents/transactions/earnings/qr/transactions-earnings-qr.component';
import {
  PaymentsQRComponent,
} from './contents/transactions/payments-qr/payments-qr.component';
import {
  VouchersRedeemComponent,
} from './contents/transactions/vouchers-redeem/vouchers-redeem.component';
import {
  SettingsVariablesTransactionsComponent
} from './contents/settings/variables/transactions/settings-variables-transactions.component';
import { UserCustomerComponent } from './contents/user-customer/user-customer.component';
import { BulkUploadAdjusmentComponent } from './contents/bulk-upload-adjusment/bulk-upload-adjusment.component';
// import { DialogStatusUsersComponent } from './contents/users/dialog-status-users/dialog-status-users.component';
import { TransactionsEarningsOspComponent } from './contents/transactions/earnings/osp/transactions-earnings-osp.component';
import { TransactionsEarningsEarningoplComponent } from './contents/transactions/earnings/earningopl/transactions-earnings-earningopl.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    UsersComponent,
    AnalyticsComponent,
    TransactionsEarningsPPOBComponent,
    DialogShowDataComponent,
    TransactionsEarningsQRComponent,
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    PaymentsQRComponent,
    VouchersRedeemComponent,
    SettingsVariablesTransactionsComponent,
    TransactionsEarningsOspComponent,
    TransactionsEarningsEarningoplComponent,
    SettingsVariablesTransactionsComponent,
    DialogChangePasswordComponent,
    DialogStatusUsersComponent,
    UserCustomerComponent,
    BulkUploadAdjusmentComponent,
  ],
  entryComponents: [
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    DialogShowDataComponent,
    DialogChangePasswordComponent,
    DialogStatusUsersComponent,
  ],
  providers: [DatePipe],
  imports: [ CommonModule, DashboardRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule ],
  exports: [ DashboardRoutingModule ]
})
export class DashboardModule { }
