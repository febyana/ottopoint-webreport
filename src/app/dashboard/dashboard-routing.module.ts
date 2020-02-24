import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './contents/users/users.component';
import { TransactionsEarningsPPOBComponent } from './contents/transactions/earnings/ppob/transactions-earnings-ppob.component';
import { TransactionsEarningsOspComponent } from './contents/transactions/earnings/osp/transactions-earnings-osp.component';
import { TransactionsEarningsEarningoplComponent } from './contents/transactions/earnings/earningopl/transactions-earnings-earningopl.component';
import { TransactionsEarningsQRComponent } from './contents/transactions/earnings/qr/transactions-earnings-qr.component';
import { VouchersRedeemComponent } from './contents/transactions/vouchers-redeem/vouchers-redeem.component';
import { PaymentsQRComponent } from './contents/transactions/payments-qr/payments-qr.component';
import { AnalyticsComponent } from './contents/analytics/analytics.component';
import {
  SettingsVariablesTransactionsComponent
} from './contents/settings/variables/transactions/settings-variables-transactions.component';


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
        path: 'transactions/earnings/osp',
        component: TransactionsEarningsOspComponent,
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
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
