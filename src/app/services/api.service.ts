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
  GetTransactionsEarningsOPLRes,
  ChangeStatusRequest,
  ChangeStatusResponse,
  HistoryBulk,
  HistoryBulkDetail,
  BulkAdjustmentResponse,
  BulkAddCustomerRes,
  GetTransactionsVouchersRedeemOplRes,
  // GetListUltraVoucherRes,
  GetTransactionsRedeemPointOplRes,
  GetSKURes,
  OutstandingPointRes,
  OutstandingVoucherRes,
  ReportUVResp,
  GetVoucherNameUV,
  GetVoucherTypeUV,
  GetVoucherCategoryUV,
  AddNewPartnerReq,
  AddNewPartnerRes,
  AddNewStoreReq,
  AddNewStoreResp,
  GetDataPartner,
  GetDataPartnerRes,
  PartnerUploadReq,
  PartnerUploadRes,
  GetDataPartnerResp,
  EditDataPartnerReq,
  EditDataPartner,
  ChangeStatusPartner,
  ChangeStatusPartnerRes,
  DownloadFileRes,
  UpdateStatusReq,
  UpdateStatusRes,
  IssuerListRes,
  EarningRuleReq,
  VoucherListRes,
  EarningRuleRes,
  SKUListRes,
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetUsersEligibilityRes,
  GetListUltraVoucherRes,
  IssuerListRes1,
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
  URLGetUsersEligibility: string;
  URLGetTransactionsPaymentsQR: string;
  URLGetTransactionsEarningsPPOB: string;
  URLGetTransactionsEarningsOPL: string;
  URLGetTransactionsEarningsQR: string;
  URLGetTransactionsVouchersRedeem: string;
  URLGetTransactionsVouchersRedeemOpl: string;
  URLGetTransactionsRedeemPointOpl: string;
  URLGetAnalyticsTransactions: string;
  URLGetAnalyticsUsers: string;
  URLGetSettingsVariablesTransactions: string;
  URLPutSettingsVariablesTransactions: string;
  URLGetVouchersName: string;
  URLGetPPOBProductTypes: string;
  URLGetSKU: string;
  URLChangePassword: string;
  URLChangeStatus: string;
  URLChangeStatusPartner: string;
  URLReportVoucherUV: string;
  URLGetVoucherNameUV: string;
  URLGetVoucherTypeUV: string;
  URLGetVoucherCategoryUV: string;
  URLAddNewStore: string;
  URLGetDataPartnerById: string;
  URLUpdateDataPartner: string;
  // baseURLOttopay: string;
  URLEligibleUser: string;
  URLRegisterUser: string;
  URLHistoyBulkDetail: string;
  URLGetHistoryBulk: string;
  URLBulkAdjustment: string;
  URLListUltraVoucher: string;
  URLBulkAddCustomer: string;
  URLOutstandingPoint: string;
  URLOutstandingVoucher: string;
  URLAddNewPartner: string;
  URLGetDataPartner: string;
  URLDownloadFile: string;
  URLUploadPartner: string;
  URLGenerateAPIKey : string;
  //URLGetIssuerList:string;
  URLGetVoucherList:string;
  URLAddNewEarningRule:string;
  URLGetSKUList:string;
  URLGetIssuerList: string;
  // baseURLOttopay: string;
  // URLEligibleUser: string;
  // URLRegisterUser: string;
  URLRegisterUserV2: string;

  

  constructor(
    private httpClient: HttpClient,
  ) { }

  URLBuilder(
    baseURLBackendDashboard: string,
    baseURLOttopay: string
  ) {
    // backend dashboard
    this.URLGetToken = baseURLBackendDashboard + `/login`;
    this.URLGetUsers = baseURLBackendDashboard + `/users/list?`;
    this.URLGetTransactionsPaymentsQR = baseURLBackendDashboard + `/transactions/payments/qr?`; // hold
    this.URLGetTransactionsEarningsPPOB = baseURLBackendDashboard + `/transactions/earnings?`;
    this.URLGetTransactionsEarningsOPL = baseURLBackendDashboard + `/transactions/earningopl?`;
    this.URLGetTransactionsVouchersRedeem = baseURLBackendDashboard + `/transactions/vouchers?`;
    this.URLListUltraVoucher = baseURLBackendDashboard + `/transactions/ultravoucher?`;
    this.URLGetToken                         = baseURLBackendDashboard + `/login`;
    this.URLGetUsers                         = baseURLBackendDashboard + `/users/list?`;
    this.URLGetUsersEligibility              = baseURLBackendDashboard + `/users/eligibility?`;
    this.URLGetTransactionsPaymentsQR        = baseURLBackendDashboard + `/transactions/payments/qr?`; // hold
    this.URLGetTransactionsEarningsPPOB      = baseURLBackendDashboard + `/transactions/earnings?`;
    this.URLGetTransactionsEarningsOPL        = baseURLBackendDashboard + `/transactions/earningopl?`; 
    this.URLGetTransactionsVouchersRedeem    = baseURLBackendDashboard + `/transactions/vouchers?`;
    this.URLGetTransactionsVouchersRedeemOpl = baseURLBackendDashboard + `/history/redeem?`;
    this.URLGetTransactionsRedeemPointOpl = baseURLBackendDashboard + `/history/redeempointopl?`;
    this.URLGetAnalyticsTransactions = baseURLBackendDashboard + `/analytics/transactions`;
    this.URLGetAnalyticsUsers = baseURLBackendDashboard + `/analytics/users`;
    this.URLGetSettingsVariablesTransactions = baseURLBackendDashboard + `/settings/get?`;
    this.URLBulkAdjustment = baseURLBackendDashboard + '/bulk/adjustment'
    this.URLGetHistoryBulk = baseURLBackendDashboard + '/bulk/history'
    this.URLHistoyBulkDetail = baseURLBackendDashboard + '/bulk/detail?'
    this.URLPutSettingsVariablesTransactions = baseURLBackendDashboard + `/settings/put/`;
    this.URLGetVouchersName = baseURLBackendDashboard + `/vouchers/name`;
    this.URLGetSKU = baseURLBackendDashboard + `/ultra_voucher/sku`;
    this.URLGetPPOBProductTypes = baseURLBackendDashboard + `/ppob/product-types`;
    this.URLChangePassword = baseURLBackendDashboard + '/change_password'; // belum
    this.URLChangeStatus = baseURLBackendDashboard + '/users/status'; // on progress
    this.URLBulkAdjustment = baseURLBackendDashboard + '/bulk/adjustment';
    this.URLGetHistoryBulk = baseURLBackendDashboard + '/bulk/history';
    this.URLHistoyBulkDetail = baseURLBackendDashboard + '/bulk/detail?';
    this.URLOutstandingPoint = baseURLBackendDashboard + `/outstanding/point?`;
    this.URLOutstandingVoucher = baseURLBackendDashboard + `/outstanding/voucher?`;
    this.URLReportVoucherUV = baseURLBackendDashboard + `/ultra_voucher/list`
    this.URLGetVoucherNameUV = baseURLBackendDashboard + `/ultra_voucher/name`
    this.URLGetVoucherTypeUV = baseURLBackendDashboard + `/ultra_voucher/type`
    this.URLGetVoucherCategoryUV = baseURLBackendDashboard + `/ultra_voucher/category`
    this.URLAddNewPartner = baseURLBackendDashboard + `/program-management/addnewpartner`
    this.URLAddNewStore = baseURLBackendDashboard + `/program-management/addnewstore`
    this.URLGetDataPartner = baseURLBackendDashboard + `/program-management/partner?`;
    this.URLUploadPartner = baseURLBackendDashboard + `/upload/multiple_file`
    this.URLChangeStatusPartner              = baseURLBackendDashboard + '/program-management/partnerstatus';
    this.URLBulkAddCustomer                  = baseURLBackendDashboard + '/bulk/eligible-register';
    this.URLGetVoucherCategoryUV                 = baseURLBackendDashboard + `/ultra_voucher/category`
    this.URLGetDataPartner                   = baseURLBackendDashboard + `/program-management/partner?`;
    this.URLGetDataPartnerById               = baseURLBackendDashboard + `/program-management/view-partner?`
    this.URLUpdateDataPartner               = baseURLBackendDashboard + `/program-management/updatepartner`
    this.URLDownloadFile                     = baseURLBackendDashboard + `/program-management/download-file?`
    this.URLGenerateAPIKey                     = baseURLBackendDashboard + `/program-management/apikey?`
    this.URLUpdateDataPartner               = baseURLBackendDashboard + `/program-management/updatepartner`
    this.URLGetIssuerList                     = baseURLBackendDashboard + `/list-institution`
    this.URLGetVoucherList                     = baseURLBackendDashboard + `/voucherlist`
    this.URLGetSKUList                     = baseURLBackendDashboard + `/earningRules/listsku`
    this.URLAddNewEarningRule                     = baseURLBackendDashboard + `/earningRules/createEarning`
    // ottopay
    this.URLEligibleUser = baseURLOttopay + `/add_eligible`;
    this.URLRegisterUser = baseURLOttopay + `/register_user`;
    this.URLEligibleUser                     = baseURLBackendDashboard + `/users/add-eligible`;
    this.URLRegisterUser                     = baseURLOttopay + `/register_user`;
    this.URLRegisterUserV2                   = baseURLBackendDashboard + `/users/register-user`;
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetUsersRes>(this.URLGetUsers + this.queryParams, httpOptions);
  }

  public APIGetIssuerList1(token : string): Observable<IssuerListRes1> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<IssuerListRes1>(this.URLGetIssuerList, httpOptions);
  }
  
  public APIGetUsersEligibility(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetUsersEligibilityRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetUsersEligibilityRes>(this.URLGetUsersEligibility + this.queryParams, httpOptions);
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsEarningsPPOBRes>(this.URLGetTransactionsEarningsPPOB + this.queryParams, httpOptions);
  }

  public APIOutstandingPoint(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<OutstandingPointRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<OutstandingPointRes>(this.URLOutstandingPoint + this.queryParams, httpOptions)
  }
  public APIOutstandingVoucher(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<OutstandingVoucherRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<OutstandingVoucherRes>(this.URLOutstandingVoucher + this.queryParams, httpOptions)
  }
  public APIGetTransactionsEarningOPL(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsEarningsOPLRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsEarningsOPLRes>(this.URLGetTransactionsEarningsOPL + this.queryParams, httpOptions)
  }
  public APIGetListUltraVoucher(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetListUltraVoucherRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetListUltraVoucherRes>(this.URLListUltraVoucher + this.queryParams, httpOptions)
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsVouchersRedeemRes>(
      this.URLGetTransactionsVouchersRedeem + this.queryParams,
      httpOptions
    );
  }

  public APIGetTransactionsVouchersRedeemOPL(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsVouchersRedeemOplRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsVouchersRedeemOplRes>(
      this.URLGetTransactionsVouchersRedeemOpl + this.queryParams,
      httpOptions
    );
  }

  public APIGetTransactionsRedeemPointOPL(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetTransactionsRedeemPointOplRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetTransactionsRedeemPointOplRes>(
      this.URLGetTransactionsRedeemPointOpl + this.queryParams,
      httpOptions
    );
  }

  public APIGetDataPartner(
    token: string,
    offset: number,
    limit: number,
    sortby: string,
    order: string,
    query: string
  ): Observable<GetDataPartnerRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `offset=${String(offset)}&limit=${String(limit)}&sortby=${sortby}&order=${order}&query=${query}`;
    return this.httpClient.get<GetDataPartnerRes>(
      this.URLGetDataPartner + this.queryParams,
      httpOptions
    );
  }
  public APIGetAnalyticsTransactions(token: string): Observable<GetAnalyticsTransactionsRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticsTransactionsRes>(this.URLGetAnalyticsTransactions, httpOptions);
  }

  public APIGetAnalyticsUsers(token: string): Observable<GetAnalyticsUsersRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetAnalyticsUsersRes>(this.URLGetAnalyticsUsers, httpOptions);
  }

  public APIEligibleUser(req: AddEligibleUserReq, token: string): Observable<AddEligibleUserRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<AddEligibleUserRes>(this.URLEligibleUser, req, httpOptions);
  }

  public APIRegisterUser(req: RegisterUserReq, token: string): Observable<RegisterUserRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<RegisterUserRes>(this.URLRegisterUser, req, httpOptions);
  }

  public APIRegisterUserV2(req: RegisterUserReq, token: string): Observable<RegisterUserRes> {
    this.whichEnvironment();
    httpOptions.headers =  httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<RegisterUserRes>(this.URLRegisterUserV2, req, httpOptions);
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetVouchersNameRes>(this.URLGetVouchersName, httpOptions);
  }

  public APIGetPPOBProductTypes(token: string): Observable<GetPPOBProductTypesRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetPPOBProductTypesRes>(this.URLGetPPOBProductTypes, httpOptions);
  }

  public APIGetSKU(token: string): Observable<GetSKURes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetSKURes>(this.URLGetSKU, httpOptions);
  }

  public APIChangePassword(token: string, req: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.post<ChangePasswordResponse>(this.URLChangePassword, req, httpOptions);
  }

  public APIChangeStatus(token: string, req: ChangeStatusRequest): Observable<ChangeStatusResponse> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.post<ChangeStatusResponse>(this.URLChangeStatus, req, httpOptions);
  }

  public APIChangeStatusPartner(token: string, req: ChangeStatusPartner): Observable<ChangeStatusPartnerRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.post<ChangeStatusPartnerRes>(this.URLChangeStatusPartner, req, httpOptions);
  }

  public APIGetHistoyBulk(
    token: string,
    offset: any,
    limit: any,
    bulkcode: any,
  ): Observable<HistoryBulk> {
    this.whichEnvironment();
    this.queryParams = `?offset=${String(offset)}&limit=${String(limit)}&bulkcode=${String(bulkcode)}`;
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<HistoryBulk>(this.URLGetHistoryBulk + this.queryParams, httpOptions);
  }


  public APIGetHistoyBulkDetail(token: string, id: string): Observable<HistoryBulkDetail> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    this.queryParams = `id=${String(id)}`;
    return this.httpClient.get<HistoryBulkDetail>(this.URLHistoyBulkDetail + this.queryParams, httpOptions);
  }

  public APIBulkAddCustomer(token: string, file): Observable<BulkAddCustomerRes> {
    const formData = new FormData();
    console.log(typeof file);
    formData.append('file', file, file.filename);
    // formData.set('file', file);
    console.log("BULK : ", formData.get('file'));
    this.whichEnvironment();

    // httpOptions.headers.set('Authorization', 'Bearer ' + token);
    // httpOptions.headers.set('Content-Type', 'multipart/form-data');
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    // httpOptions.headers =  httpOptions.headers.set('Content-Type', '');

    const httpOptionT = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };

    return this.httpClient.post<BulkAddCustomerRes>(this.URLBulkAddCustomer, formData, httpOptionT);

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
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
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

  public APIReportVoucherUV(token: string, page, perpage, type, name, status: string): Observable<ReportUVResp> {
    this.whichEnvironment();
    this.queryParams = `?page=${String(page)}&perPage=${String(perpage)}
                        &voucherType=${String(type)}&voucherName=${String(name)}&status=${String(status)}`;
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<ReportUVResp>(this.URLReportVoucherUV + this.queryParams, httpOptions);
  }

  public APIGetVoucherNameUV(token: string): Observable<GetVoucherNameUV> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetVoucherNameUV>(this.URLGetVoucherNameUV, httpOptions);
  }

  public APIGetVoucherTypeUV(token: string): Observable<GetVoucherTypeUV> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetVoucherTypeUV>(this.URLGetVoucherTypeUV, httpOptions);
  }

  public APIGetVoucherCategoryUV(token: string): Observable<GetVoucherCategoryUV> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetVoucherCategoryUV>(this.URLGetVoucherCategoryUV, httpOptions);
  }

  public APIAddNewPartner(req: AddNewPartnerReq, token: string): Observable<AddNewPartnerRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<AddNewPartnerRes>(this.URLAddNewPartner, req, httpOptions);
  }

  public APIAddNewStore(req: AddNewStoreReq, token: string): Observable<AddNewStoreResp> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<AddNewStoreResp>(this.URLAddNewStore, req, httpOptions);
  }

  public APIUploadPartner(token: string, file, id: string): Observable<PartnerUploadRes> {
    const formData = new FormData();
    if (file.length > 0) {
      for (var i = 0; i < file.length; i++) {
        formData.append('multiplefiles', file[i], file[i].filename);
        formData.append('InstitutionID', id)
      }
    }
    this.whichEnvironment();
    const httpOptionT = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    };
    return this.httpClient.post<PartnerUploadRes>(this.URLUploadPartner, formData, httpOptionT);
  }

  public APIGetPatnerByID(id:number, token: string): Observable<GetDataPartnerResp> {
    this.whichEnvironment();
    this.queryParams = `id=`+id;
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<GetDataPartnerResp>(
      this.URLGetDataPartnerById + this.queryParams, httpOptions
    );
  }

  // public APIDownloadFile(path: string, token : string): Observable<DownloadFileRes> {
  //   this.whichEnvironment();
  //   this.queryParams = `filePath=`+path
  //   httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.get<DownloadFileRes>(
  //     this.URLDownloadFile + this.queryParams, httpOptions
  //   );
  // }
  public APIDownloadFile(path: string, token : string): Observable<any> {
    this.whichEnvironment();
    this.queryParams = `filePath=`+path
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<any>(
      this.URLDownloadFile + this.queryParams, httpOptions
    );
  }

  public APIUpdateDataPartner(req :EditDataPartnerReq, id:number, token: string): Observable<EditDataPartner> {
    this.whichEnvironment();
    this.queryParams = `?id=${String(id)}`
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.put<EditDataPartner>(
      this.URLUpdateDataPartner + this.queryParams, req, httpOptions
    );}
    
  public APIGenerateAPIKey(id: number, token : string): Observable<any> {
    this.whichEnvironment();
    this.queryParams = `id=`+id
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.post<any>(this.URLGenerateAPIKey + this.queryParams, httpOptions);
  }

  public APIUpdateStatusDataPartner(req :UpdateStatusReq, id:number, token: string): Observable<UpdateStatusRes> {
    this.whichEnvironment();
    this.queryParams = `?id=${String(id)}`
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.put<UpdateStatusRes>(
      this.URLUpdateDataPartner + this.queryParams, req, httpOptions
    );
  }
  public APIGetIssuerList(token : string): Observable<IssuerListRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<IssuerListRes>(this.URLGetIssuerList, httpOptions);
  }

  public APIGetVoucherList(token : string): Observable<VoucherListRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<VoucherListRes>(this.URLGetVoucherList, httpOptions);
  }

  public APIGetSKUList(token : string): Observable<SKUListRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    return this.httpClient.get<SKUListRes>(this.URLGetSKUList, httpOptions);
  }

  public APINewEarningRule(req: EarningRuleReq, token: string): Observable<EarningRuleRes> {
    this.whichEnvironment();
    httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    if (!JSON.parse(window.localStorage.getItem('user_info')).privilages.includes('create')) {
      alert('you not have privilage to this action');
      return;
    }
    return this.httpClient.post<EarningRuleRes>(this.URLAddNewEarningRule, req, httpOptions);
  }
}
