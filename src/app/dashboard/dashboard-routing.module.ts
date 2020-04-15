import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './contents/users/users.component';
import { TransactionsEarningsPPOBComponent } from './contents/transactions/earnings/ppob/transactions-earnings-ppob.component';
import { TransactionsEarningsEarningoplComponent } from './contents/transactions/earnings/earningopl/transactions-earnings-earningopl.component';
import { TransactionsEarningsQRComponent } from './contents/transactions/earnings/qr/transactions-earnings-qr.component';
import { RedeemVoucherOplComponent} from './contents/transactions/redeem-voucher-opl/redeem-voucher-opl.component';
import { RedeemPointOplComponent} from './contents/transactions/redeem-point-opl/redeem-point-opl.component';
import { VouchersRedeemComponent } from './contents/transactions/vouchers-redeem/vouchers-redeem.component';
import { ListUvComponent } from './contents/uv/list-uv/list-uv.component';
import { PaymentsQRComponent } from './contents/transactions/payments-qr/payments-qr.component';
import { AnalyticsComponent } from './contents/analytics/analytics.component';
import {
  SettingsVariablesTransactionsComponent
} from './contents/settings/variables/transactions/settings-variables-transactions.component';
import { UserCustomerComponent } from './contents/user-customer/user-customer.component';
import { BulkUploadAdjusmentComponent } from './contents/bulk-upload-adjusment/bulk-upload-adjusment.component';
import { UltravoucherComponent } from './contents/ultravoucher/ultravoucher.component';
import { BulkUploadAddcustomerComponent } from './contents/bulk-upload-addcustomer/bulk-upload-addcustomer.component';
import { path, Component } from '@amcharts/amcharts4/core';
import { OutstandingVoucherComponent } from './contents/outstanding/outstanding_voucher/outstanding_voucher.component';
import { OutstandingPointComponent } from './contents/outstanding/outstanding_point/outstanding_point.component';
import { AddPartnerComponent } from './contents/program-management/add-partner/add-partner.component';
import { AddNewStoreComponent } from './contents/program-management/add-new-store/add-new-store.component';
import { DataPartnerComponent } from './contents/program-management/data-partner/data-partner.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: AnalyticsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'transactions/earnings/ppob',
        component: TransactionsEarningsPPOBComponent,
      }, 
      {
        path: 'outstanding/point',
        component: OutstandingPointComponent,
      },
      {
        path: 'outstanding/voucher',
        component: OutstandingVoucherComponent,
      },
      {
        path: 'program-management/add-partner',
        component: AddPartnerComponent,
      },
      {
        path: 'transactions/earnings/earningopl',
        component: TransactionsEarningsEarningoplComponent,
      },
      {
        path: 'transactions/earnings/qr',
        component: TransactionsEarningsQRComponent,
      },
      {
        path: 'transactions/payments/qr',
        component: PaymentsQRComponent,
      },
      {
        path: 'transactions/vouchers/redeem',
        component: VouchersRedeemComponent,
      },
      {
        path: 'settings/variables/transactions',
        component: SettingsVariablesTransactionsComponent,
      },
      {
      path: 'users_customer',
      component : UserCustomerComponent,
      },
      {
        path: 'upload-adjusment',
        component: BulkUploadAdjusmentComponent,
      },
      {
        path: 'upload-addcustomer',
        component: BulkUploadAddcustomerComponent,
      },
      {
        path: 'transactions/vouchers/redeemopl',
        component: RedeemVoucherOplComponent,
      },
      {
        path: 'ultravoucher/list',
        component: UltravoucherComponent,
      },
      {
        path: 'transactions/redeempointopl',
        component: RedeemPointOplComponent,
      },
      {
        path: 'ultravoucher/stock',
        component: ListUvComponent,
      },
      {
        path: 'program-management/data-partner',
        component: DataPartnerComponent,
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
