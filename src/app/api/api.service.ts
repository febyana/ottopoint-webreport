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
} from '../model/models';

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
  constructor(
    private httpClient: HttpClient,
  ) { }

  queryParams: string;
  hostBackEndDashboard                = 'http://13.228.25.85:8819';
  URLGetToken                         = `${this.hostBackEndDashboard}/api/login`;
  URLGetUsers                         = `${this.hostBackEndDashboard}/api/users?`;
  URLGetTransactionsPaymentsQR        = `${this.hostBackEndDashboard}/api/transactions/payments/qr?`;
  URLGetTransactionsEarningsPPOB      = `${this.hostBackEndDashboard}/api/transactions/earnings/ppob?`;
  URLGetTransactionsEarningsQR        = `${this.hostBackEndDashboard}/api/transactions/earnings/qr?`;
  URLGetTransactionsVouchersRedeem    = `${this.hostBackEndDashboard}/api/transactions/vouchers/redeem?`;
  URLGetAnalyticsTransactions         = `${this.hostBackEndDashboard}/api/analytics/transactions`;
  URLGetAnalyticsUsers                = `${this.hostBackEndDashboard}/api/analytics/users`;
  URLGetSettingsVariablesTransactions = `${this.hostBackEndDashboard}/api/settings/variables/transactions?`;
  URLPutSettingsVariablesTransactions = `${this.hostBackEndDashboard}/api/settings/variables/transactions/`;
  hostOttopay                         = 'http://13.228.25.85:8009';
  URLEligibleUser                     = `${this.hostOttopay}/api/add_eligible`;
  URLRegisterUser                     = `${this.hostOttopay}/api/register_user`;

  public APIGetToken(
    username: string,
    password: string,
  ): Observable<LoginRes> {
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
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsVouchersRedeemRes>(
      this.URLGetTransactionsVouchersRedeem + this.queryParams,
      httpOptions
    );
  }

  public APIGetAnalyticsTransactions(token: string): Observable<GetAnalyticsTransactionsRes> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticsTransactionsRes>(this.URLGetAnalyticsTransactions, httpOptions);
  }

  public APIGetAnalyticsUsers(token: string): Observable<GetAnalyticsUsersRes> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticsUsersRes>(this.URLGetAnalyticsUsers, httpOptions);
  }

  public APIEligibleUser(req: AddEligibleUserReq, token: string): Observable<AddEligibleUserRes> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<AddEligibleUserRes>(this.URLEligibleUser, req, httpOptions);
  }

  public APIRegisterUser(req: RegisterUserReq, token: string): Observable<RegisterUserRes> {
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
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.put<PutSettingsVariablesTransactionsRes>(
      this.URLPutSettingsVariablesTransactions + id,
      bodyReq,
      httpOptions
    );
  }
}
