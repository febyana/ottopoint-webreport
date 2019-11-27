import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './contents/users/users.component';
import { TransactionsEarningsPPOBComponent } from './contents/transactions/earnings/ppob/transactions-earnings-ppob.component';
import { TransactionsEarningsQRComponent } from './contents/transactions/earnings/qr/transactions-earnings-qr.component';
import { VouchersRedeemComponent } from './contents/transactions/vouchers-redeem/vouchers-redeem.component';
import { PaymentsQRComponent } from './contents/transactions/payments-qr/payments-qr.component';
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
        path: 'transactions/earnings/ppob',
        component: TransactionsEarningsPPOBComponent,
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
