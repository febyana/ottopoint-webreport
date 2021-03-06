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
  //DialogAddEligibleComponent,
  DialogRegisterComponent,
  DialogStatusUsersComponent,
} from './contents/users/users.component';

// import {
//   DialogStatusPartnerComponent,
// } from './contents/program-management/data-partner/data-partner.component';


import { 
  DialogAddEligibleComponent,
} from './contents/users-eligibility/users-eligibility.component'

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
import { OutstandingPointComponent } from './contents/outstanding/outstanding_point/outstanding_point.component';
import { OutstandingVoucherComponent } from './contents/outstanding/outstanding_voucher/outstanding_voucher.component';
import { TransactionsEarningsEarningoplComponent } from './contents/transactions/earnings/earningopl/transactions-earnings-earningopl.component';
import { BulkUploadAdjusmentComponent } from './contents/bulk-upload-adjusment/bulk-upload-adjusment.component';
import { UsersEligibilityComponent } from './contents/users-eligibility/users-eligibility.component';
import { RedeemPointOplComponent } from './contents/transactions/redeem-point-opl/redeem-point-opl.component';
import { ListUvComponent } from './contents/uv/list-uv/list-uv.component';
import { AddPartnerComponent } from './contents/program-management/add-partner/add-partner.component';
import { AddNewStoreComponent } from './contents/program-management/add-new-store/add-new-store.component';
import { DataPartnerComponent,DialogViewDataPatnerComponent, DialogEditDataPatnerComponent ,DialogApproval1Component,PopUpApprovalComponent, DialogStatusPartnerComponent } from './contents/program-management/data-partner/data-partner.component';
import { EarningRuleComponent } from './contents/campaign-management/earning-rule/earning-rule.component';
import { LevelsComponent } from './contents/campaign-management/levels/levels.component';
import { SegmentsComponent } from './contents/campaign-management/segments/segments.component';
import { RewardCampaignsComponent } from './contents/campaign-management/reward-campaigns/reward-campaigns.component';
import { BulkUploadAddcustomerComponent } from './contents/bulk-upload-addcustomer/bulk-upload-addcustomer.component';
import { RedeemVoucherOplComponent } from './contents/transactions/redeem-voucher-opl/redeem-voucher-opl.component';
// import { UserCustomerComponent } from './contents/user-customer/user-customer.component';
import { UltravoucherComponent } from './contents/uv/ultravoucher.component';

// import { DialogStatusUsersComponent } from './contents/users/dialog-status-users/dialog-status-users.component';

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
    OutstandingPointComponent,
    OutstandingVoucherComponent,
    TransactionsEarningsEarningoplComponent,
    DialogStatusUsersComponent,
    DialogStatusPartnerComponent,
    BulkUploadAdjusmentComponent,
    BulkUploadAddcustomerComponent,
    RedeemVoucherOplComponent,
    // UserCustomerComponent,
    UltravoucherComponent,
    BulkUploadAdjusmentComponent,
    BulkUploadAddcustomerComponent,
    RedeemVoucherOplComponent,
    RedeemPointOplComponent,
    ListUvComponent,
    AddPartnerComponent,
    AddNewStoreComponent,
    DataPartnerComponent,
    DialogViewDataPatnerComponent,
    DialogApproval1Component,
    PopUpApprovalComponent,
    DialogEditDataPatnerComponent,
    EarningRuleComponent,
    LevelsComponent,
    SegmentsComponent,
    RewardCampaignsComponent,
    UsersEligibilityComponent,
  ],
  entryComponents: [
    DialogAddEligibleComponent,
    DialogRegisterComponent,
    DialogShowDataComponent,
    DialogStatusUsersComponent,
    DialogViewDataPatnerComponent,
    DialogEditDataPatnerComponent,
    AddNewStoreComponent,
    DialogApproval1Component,
    PopUpApprovalComponent,
    DialogStatusPartnerComponent,
  ],
  providers: [DatePipe],
  imports: [ CommonModule, DashboardRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule ],
  exports: [ DashboardRoutingModule ]
})
export class DashboardModule { }
