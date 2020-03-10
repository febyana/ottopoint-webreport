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
  GetTransactionsEarningsOSPRes,
  GetTransactionsEarningsOPLRes,
  ChangeStatusRequest,
  ChangeStatusResponse,
  HistoryBulk,
  HistoryBulkDetail,
  BulkAdjustmentResponse,
} from '../models/models';

import { selected_environment, environments } from '../../configs/app.config.json';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { tap } from 'rxjs/operators';


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
  URLGetToken: string;
  URLGetUsers: string;
  URLGetTransactionsPaymentsQR: string;
  URLGetTransactionsEarningsPPOB: string;
  URLGetTransactionsEarningsOSP: string;
  URLGetTransactionsEarningsOPL: string;
  URLGetTransactionsEarningsQR: string;
  URLGetTransactionsVouchersRedeem: string;
  URLGetTransactionsVouchersRedeemOpl: string;
  URLGetAnalyticsTransactions: string;
  URLGetAnalyticsUsers: string;
  URLGetSettingsVariablesTransactions: string;
  URLPutSettingsVariablesTransactions: string;
  URLGetVouchersName: string;
  URLGetPPOBProductTypes: string;
  URLChangeStatus: string;
  // baseURLOttopay: string;
  URLEligibleUser: string;
  URLRegisterUser: string;
  URLHistoyBulkDetail: string;
  URLGetHistoryBulk: string;
  URLBulkAdjustment: string;


  constructor(
    private httpClient: HttpClient,
  ) { }

  URLBuilder(
    baseURLBackendDashboard: string,
    baseURLOttopay: string
  ) {
    // backend dashboard
    this.URLGetToken                         = baseURLBackendDashboard + `/login`;
    this.URLGetUsers                         = baseURLBackendDashboard + `/users/list?`;
    this.URLGetTransactionsPaymentsQR        = baseURLBackendDashboard + `/transactions/payments/qr?`; // hold
    this.URLGetTransactionsEarningsPPOB      = baseURLBackendDashboard + `/transactions/earnings?`;
    this.URLGetTransactionsEarningsOPL        = baseURLBackendDashboard + `/transactions/earningopl?`; 
    this.URLGetTransactionsVouchersRedeem    = baseURLBackendDashboard + `/transactions/vouchers?`;
    this.URLGetTransactionsVouchersRedeemOpl = baseURLBackendDashboard + `/history/redeem?`;
    this.URLGetAnalyticsTransactions         = baseURLBackendDashboard + `/analytics/transactions`;
    this.URLGetAnalyticsUsers                = baseURLBackendDashboard + `/analytics/users`;
    this.URLGetSettingsVariablesTransactions = baseURLBackendDashboard + `/settings/get?`;
    this.URLPutSettingsVariablesTransactions = baseURLBackendDashboard + `/settings/put/`;
    this.URLGetVouchersName                  = baseURLBackendDashboard + `/vouchers/name`;
    this.URLGetPPOBProductTypes              = baseURLBackendDashboard + `/ppob/product-types`;
    this.URLChangeStatus                     = baseURLBackendDashboard + '/users/status'; // on progress
    this.URLBulkAdjustment                   = baseURLBackendDashboard + '/bulk/adjustment';
    this.URLGetHistoryBulk                   = baseURLBackendDashboard + '/bulk/history';
    this.URLHistoyBulkDetail                 = baseURLBackendDashboard + '/bulk/detail?';
    // ottopay
    this.URLEligibleUser                     = baseURLOttopay + `/add_eligible`;
    this.URLRegisterUser                     = baseURLOttopay + `/register_user`;
  }

  whichEnvironment() {
    switch (selected_environment) {
      case 'prod': {
        this.URLBuilder(
          environments.prod.backend_dashboard.host +
          environments.prod.backend_dashboard.base_url +
          environments.prod.backend_dashboard.version,

          environments.prod.ottopay.host +
          environments.prod.ottopay.base_url
        );
        break;
      }
      case 'dev': {
        this.URLBuilder(
          environments.dev.backend_dashboard.host +
          environments.dev.backend_dashboard.base_url +
          environments.dev.backend_dashboard.version,

          environments.dev.ottopay.host +
          environments.dev.ottopay.base_url
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

  public APIGetTransactionsEarningOSP(
    token :string,
    offset:number,
    limit:number,
    sortby:string,
    order:string,
    query:string
  ): Observable<GetTransactionsEarningsOSPRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsEarningsOSPRes>(this.URLGetTransactionsEarningsOSP + this.queryParams, httpOptions)
  }

  public APIGetTransactionsEarningOPL(
    token :string,
    offset:number,
    limit:number,
    sortby:string,
    order:string,
    query:string
  ): Observable<GetTransactionsEarningsOPLRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsEarningsOPLRes>(this.URLGetTransactionsEarningsOPL + this.queryParams, httpOptions)
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
    this.queryParams = `?id=${String(id)}`;
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('update')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.put<PutSettingsVariablesTransactionsRes>(
      this.URLPutSettingsVariablesTransactions + this.queryParams,
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

  public APIChangeStatus(token: string, req: ChangeStatusRequest): Observable<ChangeStatusResponse> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.post<ChangeStatusResponse>(this.URLChangeStatus, req, httpOptions);
  }

  public APIGetHistoyBulk(
    token: string,
    offset: any,
    limit: any,
    bulkcode:any,
  ): Observable<HistoryBulk> {
    this.whichEnvironment();
    this.queryParams = `?offset=${String(offset)}&limit=${String(limit)}&bulkcode=${String(bulkcode)}`;
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<HistoryBulk>(this.URLGetHistoryBulk + this.queryParams, httpOptions);
  }


  public APIGetHistoyBulkDetail(token: string, id: string): Observable<HistoryBulkDetail> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `id=${String(id)}`;
    return this.httpClient.get<HistoryBulkDetail>(this.URLHistoyBulkDetail + this.queryParams, httpOptions);
  }

  public APIBulkAdjustment(token: string, file): Observable<BulkAdjustmentResponse> {
    const formData = new FormData();
    console.log(typeof file);
    formData.append('file', file, file.filename);
    // formData.set('file', file);
    console.log("BULK : ", formData.get('file'));
    this.whichEnvironment();

    // httpOptions.headers.set('Authorization', 'Bearer ' + token);
    // httpOptions.headers.set('Content-Type', 'multipart/form-data');
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    // httpOptions.headers =  httpOptions.headers.set('Content-Type', '');

    const httpOptionT = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };

    return this.httpClient.post<BulkAdjustmentResponse>(this.URLBulkAdjustment, formData, httpOptionT);

    // const rohmet = { content: formData };
    // return this.httpClient.post<BulkAdjustmentResponse>(this.URLBulkAdjustment, formData, httpOptionsUp).pipe(
    //   tap(
    //     result => console.log('res ==>', result)
    //   )
    // );
  }

}
