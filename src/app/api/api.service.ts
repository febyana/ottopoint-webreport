import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  PublicRequest,
  LoginResponse,
  GetUsersResponse,
  GetTransactionsResponse,
  GetTransactionQrsResponse,
  AddEligibleUserRequest,
  AddEligibleUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  GetPaymentQrsResponse,
  GetAnalyticTransactionsResponse,
  GetAnalyticUsersResponse,
  GetTransactionsRedeemVouchersResqpose
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
  hostBackEndDashboard              = 'http://13.228.25.85:8819';
  URLGetToken                       = `${this.hostBackEndDashboard}/api/login`;
  URLGetUsers                       = `${this.hostBackEndDashboard}/api/users?`;
  URLGetTransactions                = `${this.hostBackEndDashboard}/api/transactions?`;
  URLGetTransactionQrs              = `${this.hostBackEndDashboard}/api/transactions/qrs?`;
  URLGetTransactionsRedeemVouchers  = `${this.hostBackEndDashboard}/api/transactions/redeem-vouchers?`;
  URLGetPaymentQrs                  = `${this.hostBackEndDashboard}/api/transactions/payment/qrs?`;
  URLGetAnalyticTransactions        = `${this.hostBackEndDashboard}/api/analytics/transactions`;
  URLGetAnalyticUsers               = `${this.hostBackEndDashboard}/api/analytics/users`;
  hostOttopay                       = 'http://13.228.25.85:8009';
  URLEligibleUser                   = `${this.hostOttopay}/api/add_eligible`;
  URLRegisterUser                   = `${this.hostOttopay}/api/register_user`;

  public APIGetToken(
    username: string,
    password: string,
  ): Observable<LoginResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    return this.httpClient.get<LoginResponse>(this.URLGetToken, httpOptions);
  }

  public APIGetUsers(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetUsersResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetUsersResponse>(this.URLGetUsers + this.queryParams, httpOptions);
  }

  public APIGetPaymentQrs(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetPaymentQrsResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetPaymentQrsResponse>(this.URLGetPaymentQrs + this.queryParams, httpOptions);
  }

  public APIGetTransactions(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsResponse>(this.URLGetTransactions + this.queryParams, httpOptions);
  }

  public APIGetTransactionQrs(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionQrsResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionQrsResponse>(this.URLGetTransactionQrs + this.queryParams, httpOptions);
  }

  public APIGetTransactionsRedeemVouchers(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsRedeemVouchersResqpose> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsRedeemVouchersResqpose>(
      this.URLGetTransactionsRedeemVouchers + this.queryParams,
      httpOptions
    );
  }

  public APIEligibleUser(req: AddEligibleUserRequest, token: string): Observable<AddEligibleUserResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<AddEligibleUserResponse>(this.URLEligibleUser, req, httpOptions);
  }

  public APIRegisterUser(req: RegisterUserRequest, token: string): Observable<RegisterUserResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<RegisterUserResponse>(this.URLRegisterUser, req, httpOptions);
  }

  public APIGetAnalyticTransactions(token: string): Observable<GetAnalyticTransactionsResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticTransactionsResponse>(this.URLGetAnalyticTransactions, httpOptions);
  }

  public APIGetAnalyticUsers(token: string): Observable<GetAnalyticUsersResponse> {
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticUsersResponse>(this.URLGetAnalyticUsers, httpOptions);
  }
}
