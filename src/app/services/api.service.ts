import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  LoginRes,
  GetUsersRes,
  AddEligibleUserReq,
  AddEligibleUserRes,
  GetTransactionsEarningsPPOBRes,
  GetTransactionsEarningsQRRes,
  RegisterUserReq,
  RegisterUserRes,
  GetTransactionsPaymentsQRRes,
  GetAnalyticsTransactionsRes,
  GetAnalyticsUsersRes,
  GetTransactionsVouchersRedeemRes,
  GetSettingsVariablesTransactionsRes,
  PutSettingsVariablesTransactionsReq,
  PutSettingsVariablesTransactionsRes,
  GetVouchersNameRes,
  GetPPOBProductTypesRes,
} from '../models/models';

import { selected_environment, environments } from '../../configs/app.config.json';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  queryParams: string;
  // baseURLBackendDashboard: string;
  URLGetToken                         = `/login`;
  URLGetUsers                         = `/users?`;
  URLGetTransactionsPaymentsQR        = `/transactions/payments/qr?`;
  URLGetTransactionsEarningsPPOB      = `/transactions/earnings/ppob?`;
  URLGetTransactionsEarningsQR        = `/transactions/earnings/qr?`;
  URLGetTransactionsVouchersRedeem    = `/transactions/vouchers/redeem?`;
  URLGetAnalyticsTransactions         = `/analytics/transactions`;
  URLGetAnalyticsUsers                = `/analytics/users`;
  URLGetSettingsVariablesTransactions = `/settings/variables/transactions?`;
  URLPutSettingsVariablesTransactions = `/settings/variables/transactions/`;
  URLGetVouchersName                  = `/vouchers/name`;
  URLGetPPOBProductTypes              = `/ppob/product-types`;
  // baseURLOttopay: string;
  URLEligibleUser                     = `/add_eligible`;
  URLRegisterUser                     = `/register_user`;

  constructor(
    private httpClient: HttpClient,
  ) { }

  URLBuilder(
    baseURLBackendDashboard: string,
    baseURLOttopay: string
  ) {
    // backend dashboard
    this.URLGetToken                         = baseURLBackendDashboard + this.URLGetToken;
    this.URLGetUsers                         = baseURLBackendDashboard + this.URLGetUsers;
    this.URLGetTransactionsPaymentsQR        = baseURLBackendDashboard + this.URLGetTransactionsPaymentsQR;
    this.URLGetTransactionsEarningsPPOB      = baseURLBackendDashboard + this.URLGetTransactionsEarningsPPOB;
    this.URLGetTransactionsEarningsQR        = baseURLBackendDashboard + this.URLGetTransactionsEarningsQR;
    this.URLGetTransactionsVouchersRedeem    = baseURLBackendDashboard + this.URLGetTransactionsVouchersRedeem;
    this.URLGetAnalyticsTransactions         = baseURLBackendDashboard + this.URLGetAnalyticsTransactions;
    this.URLGetAnalyticsUsers                = baseURLBackendDashboard + this.URLGetAnalyticsUsers;
    this.URLGetSettingsVariablesTransactions = baseURLBackendDashboard + this.URLGetSettingsVariablesTransactions;
    this.URLPutSettingsVariablesTransactions = baseURLBackendDashboard + this.URLPutSettingsVariablesTransactions;
    this.URLGetVouchersName                  = baseURLBackendDashboard + this.URLGetVouchersName;
    this.URLGetPPOBProductTypes              = baseURLBackendDashboard + this.URLGetPPOBProductTypes;
    // ottopay
    this.URLEligibleUser                     = baseURLOttopay + this.URLEligibleUser;
    this.URLRegisterUser                     = baseURLOttopay + this.URLRegisterUser;
  }

  whichEnvironment() {
    switch (selected_environment) {
      case 'prod': {
        this.URLBuilder(
          environments.prod.backend_dashboard.host +
          environments.prod.backend_dashboard.base_url +
          environments.prod.backend_dashboard.version,

          environments.prod.ottopay.host +
          environments.prod.ottopay.host
        );
        break;
      }
      case 'dev': {
        this.URLBuilder(
          environments.dev.backend_dashboard.host +
          environments.dev.backend_dashboard.base_url +
          environments.dev.backend_dashboard.version,

          environments.dev.ottopay.host +
          environments.dev.ottopay.host
        );
        break;
      }
      case 'local': {
        this.URLBuilder(
          environments.local.backend_dashboard.host +
          environments.local.backend_dashboard.base_url +
          environments.local.backend_dashboard.version,

          environments.local.ottopay.host +
          environments.local.ottopay.host
        );
        break;
      }
    }
  }

  public APIGetToken(
    username: string,
    password: string,
  ): Observable<LoginRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    return this.httpClient.get<LoginRes>(this.URLGetToken, httpOptions);
  }

  public APIGetUsers(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetUsersRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetUsersRes>(this.URLGetUsers + this.queryParams, httpOptions);
  }

  public APIGetTransactionsPaymentsQR(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsPaymentsQRRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsPaymentsQRRes>(this.URLGetTransactionsPaymentsQR + this.queryParams, httpOptions);
  }

  public APIGetTransactionsEarningsPPOB(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsEarningsPPOBRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsEarningsPPOBRes>(this.URLGetTransactionsEarningsPPOB + this.queryParams, httpOptions);
  }

  public APIGetTransactionsEarningsQR(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsEarningsQRRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsEarningsQRRes>(this.URLGetTransactionsEarningsQR + this.queryParams, httpOptions);
  }

  public APIGetTransactionsVouchersRedeem(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsVouchersRedeemRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsVouchersRedeemRes>(
      this.URLGetTransactionsVouchersRedeem + this.queryParams,
      httpOptions
    );
  }

  public APIGetAnalyticsTransactions(token: string): Observable<GetAnalyticsTransactionsRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticsTransactionsRes>(this.URLGetAnalyticsTransactions, httpOptions);
  }

  public APIGetAnalyticsUsers(token: string): Observable<GetAnalyticsUsersRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticsUsersRes>(this.URLGetAnalyticsUsers, httpOptions);
  }

  public APIEligibleUser(req: AddEligibleUserReq, token: string): Observable<AddEligibleUserRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<AddEligibleUserRes>(this.URLEligibleUser, req, httpOptions);
  }

  public APIRegisterUser(req: RegisterUserReq, token: string): Observable<RegisterUserRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<RegisterUserRes>(this.URLRegisterUser, req, httpOptions);
  }

  public APIGetSettingsVariablesTransactions(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetSettingsVariablesTransactionsRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetSettingsVariablesTransactionsRes>(
      this.URLGetSettingsVariablesTransactions + this.queryParams,
      httpOptions
    );
  }

  public APIPutSettingsVariablesTransactions(
    token: string,
    id: number,
    bodyReq: PutSettingsVariablesTransactionsReq
  ): Observable<PutSettingsVariablesTransactionsRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('update')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.put<PutSettingsVariablesTransactionsRes>(
      this.URLPutSettingsVariablesTransactions + id,
      bodyReq,
      httpOptions
    );
  }

  public APIGetVouchersName(token: string): Observable<GetVouchersNameRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetVouchersNameRes>(this.URLGetVouchersName, httpOptions);
  }

  public APIGetPPOBProductTypes(token: string): Observable<GetPPOBProductTypesRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetPPOBProductTypesRes>(this.URLGetPPOBProductTypes, httpOptions);
  }
}
