import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './contents/users/users.component';
import { EarningTransactionsComponent } from './contents/transactions/earning-transactions/earning-transactions.component';
import { QrTransactionsComponent } from './contents/transactions/qr-transactions/qr-transactions.component';
import { RedeemVouchersComponent } from './contents/transactions/redeem-vouchers/redeem-vouchers.component';
import { PaymentQrsComponent } from './contents/transactions/payment-qrs/payment-qrs.component';
import { AnalyticsComponent } from './contents/analytics/analytics.component';

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
        path: 'transactions/earnings',
        component: EarningTransactionsComponent,
      },
      {
        path: 'transactions/qrs',
        component: QrTransactionsComponent,
      },
      {
        path: 'transactions/payment/qrs',
        component: PaymentQrsComponent,
      },
      {
        path: 'transactions/redeem-vouchers',
        component: RedeemVouchersComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
