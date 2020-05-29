import { Time } from '@angular/common';
import { StringifyOptions } from 'querystring';

export interface MetaRes {
    status: boolean;
    code: number;
    message: string;
}

// [get] http://localhost:4200/#/login
export interface LoginRes {
    token: string;
    code: string;
    message: string;
}

// [get] http://localhost:4200/#/dashboard/users
export interface User {
    id: number;
    nama: string;
    last_name: string;
    phone: string;
    email: string;
    cust_id: string;
    merchant_id: string;
    status: boolean;
}
export interface GetUsersRes {
    data: User[];
    total: number;
    code: number;
    message: string;
}
export interface ExportUsersToCSVReq {
    total: number;
}

// [get] http://localhost:4200/#/dashboard/transactions/payments/qr
export interface TransactionPaymentsQR {
    id: number;
    mid_merchant: string;
    mid_customer: string;
    phone_merchant: string;
    phone_customer: string;
    rrn: string;
    amount: number;
    point: number;
    date_time: string;
    created_at: string;
    updated_at: string;
}
export interface GetTransactionsPaymentsQRRes {
    data: TransactionPaymentsQR[];
    total: number;
    code: number;
    message: string;
}
export interface ExportTransactionsPaymentsQRToCSVRequest {
    total: number;
}

// [get] http://localhost:4200/#/dashboard/transactions/earnings/ppob
export interface TransactionEarningPPOB {
    id: number;
    merchant_id: string;
    phone: string;
    cust_id: string;
    fee_amount: string;
    product_name: string;
    date_time: string;
    reff_number: string;
    type_trans: string;
    type_trx: string;
    product_type: string;
    data: string;
    date: string;
    created_at: string;
    updated_at: string;
    product_code: string;
    point: number;
    status: string;
}
// [get] http://localhost:4200/#/dashboard/transactions/earnings/outstanding
export interface OutstandingPoint {
    id: string;
    num :string;
    phone: string;
    email: string;
    partner: string;
    beginning: string;
    adding: string;
    bonus: string;
    spending: string;
    p2p_add: string;
    p2p_spend: string;
    adjustment_add: string;
    adjustment_spend: string;
    expired_point: string;
    ending_point: string;
    date: string;
    time: string;
    created_at:string;
    updated_at:string;
}
export interface OutstandingVoucher {
    id: string;
    date:string;
    time:string;
    customer_id: string;
    phone: string;
    email: string;
    partner: string;
    product_name:string;
    beginning: string;
    redeem_point:string;
    used_voucher:string;
    unused_voucher:string;
    reversal:string;
    expired_voucher:string;
    ending:string;
    purchase_at:string;
}
// [get] http://localhost:4200/#/dashboard/transactions/earnings/earningopl
export interface TransactionEarningOPL {
    customer_id: string;
    phone: string;
    email: string;
    first_name : string;
    last_name : string;
    transactions_type: string;
    value_point: string;
    product_code: string;
    product_type: string;
    product_name: string;
    // denom: string;
    // selling_price: string;
    comment: string;
    created_At: string;
    transactions_time: string;
    loyaltycardno: string;
    pos: string;
    issuer: string;
    reff_number:string;
    partner:string;
}
// [get] http://localhost:4200/#/dashboard/transactions/ultravoucher
export interface ListUltraVoucher {
    voucher_code : string;
    voucher_id : string;
    sku :string;
    expiry_date_uv : string;
    expiry_date_op : string;
    status : string;
    account_id :string;
    order_no : string;
    invoice_no : string;
    reff_reuse : string;
}
export interface GetTransactionsEarningsPPOBRes {
    data: TransactionEarningPPOB[];
    total: number;
    code: number;
    message: string;
}
export interface OutstandingPointRes {
    data: OutstandingPoint[];
    total: number;
    code: number;
    message: string;
}
export interface OutstandingVoucherRes {
    data: OutstandingVoucher[];
    total: number;
    code: number;
    message: string;
}
export interface OutstandingVoucherRes {
    data: OutstandingVoucher[];
    total: number;
    code: number;
    message: string;
}
export interface GetTransactionsEarningsOPLRes {
    data: TransactionEarningOPL[];
    total: number;
    code: number;
    message: string;
}

export interface GetListUltraVoucherRes {
    data: ListUltraVoucher[];
    total: number;
    code: number;
    message: string;
}

export interface ExportTransactionsEarningsPPOBToCSVReq {
    start_date: string;
    end_date: string;
    phone: string;
    cust_id: string;
    type_trans: string;
    product_code: string;
}

// [get] http://localhost:4200/#/dashboard/transactions/earnings/qr
export interface TransactionEarningQR {
    id: number;
    mid_merchant: string;
    mid_customer: string;
    phone_merchant: string;
    phone_customer: string;
    rrn: string;
    amount: number;
    point: number;
    date_time: string;
    created_at: string;
    updated_at: string;
}
export interface GetTransactionsEarningsQRRes {
    data: TransactionEarningQR[];
    total: number;
    code: number;
    message: string;
}
export interface ExportTransactionsEarningsQRToCSVRequest {
    start_date: string;
    end_date: string;
    cust_id: string;
}

// [get] http://localhost:4200/#/dashboard/transactions/vouchers/redeem
export interface TransactionVoucherRedeem {
    id: number;
    account_number: string;
    voucher: string;
    cust_id: string;
    rrn: string;
    product_code: string;
    amount: number;
    trans_type: string;
    status: string;
    institution: string;
    date_time: string;
    created_at: string;
    updated_at: string;
    product_type: string;
    exp_date: string;
    merchant_id: string;
}
export interface GetTransactionsVouchersRedeemRes {
    data: TransactionVoucherRedeem[];
    total: number;
    code: number;
    message: string;
}

export interface GetTransactionsVouchersRedeemOplRes {
    data: TransactionVoucherRedeemOpl[];
    total: number;
    code: number;
    message: string;
}

export interface TransactionVoucherRedeemOpl {
    purchaseAt: string;
    timeRedeem: string;
    dateUsage: string;
    timeUsage: string;
    customerName: string;
    customerLastname: string;
    customerPhone: string;
    customerEmail: string;
    institution: string;
    vendor: string;
    costInPoints: number;
    campaignName: string;
    product_code: string;
    campaignType: string;
    cust_active_point_am: number;
    status: string;
    dlv_stts: string;
    activeTo: string;
    used: string;
    rrn: string;
}

export interface GetTransactionsRedeemPointOplRes {
    data: TransactionRedeemPointOpl[];
    total: number;
    code: number;
    message: string;
}

export interface TransactionRedeemPointOpl {
    customer_id: string;
    customerPhone: string;
    customerEmail: string;
    customerFirstName: string;
    customerLastName: string;
    type_trx: string;
    value: number;
    product_code: string;
    product_type: string;
    product_name: string;
    comment: string;
    createdAt: string;
    timeTrx: string;
    customerLoyaltyCardNumber: string;
    pos: string;
    issuer: string;
    rrn: string;
    partner: string;
}

export interface GetDataPartnerRes {
    data: GetDataPartner[];
    total: number;
    code: number;
    message: string;
}
export interface GetUsersEligibilityRes {
    data: UsersEligibility[];
    total: number;
    code: number;
    message: string;
}

export interface GetDataPartner {
    id: number;
    partner_id: string;
    name: string;
    created_at: string;
    address: string;
    business_type: string;
    tax_number: string;
    pic_name: string;
    pic_email: string;
    phone: string;
    user_type: string;
    status:string;
    approve_date: string;
    is_active: boolean;
}

export interface UsersEligibility {
    phone: string;
    user_type: string;
    created_at: string;
    created_by: string;
    name: string;
}

export interface DeliveryStatus {
    status: string;
}

// Eligible
export interface AddEligibleUserReq {
    phone: string;
    instutionId: string;
}
export interface AddEligibleUserRes {
    Meta: MetaRes;
    Data: AddEligibleUserReq[];
    
}

// Register
export interface RegisterUserReq {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    gender: string;
    birthdate: string;
    issuer: string;
}
export interface RegisterUserRes {
    Meta: MetaRes;
    Data: RegisterUserReq[];
}

// [get] http://localhost:4200/#/dashboard/analytics/transactions
export interface AnalyticTransaction {
    amount: number;
    point: number;
    tahun: string;
    bulan: string;
    hari: string;
}
export interface GetAnalyticsTransactionsRes {
    data: AnalyticTransaction[];
    total: number;
    code: number;
    message: string;
}

// [get] http://localhost:4200/#/dashboard/analytics/users
export interface GetAnalyticsUsersRes {
    eligible_registered: number;
    eligible_unregistered: number;
    uneligible_registered: number;
    uneligible_unregistered: number;
    total: number;
    code: number;
    message: string;
}

// [get] http://localhost:4200/#/dashboard/settings/variables/transactions
export interface SettingVariableTransaction {
    id: number;
    transaksi_ppob: number;
    transaksi_pay_qr: number;
    transaksi_merchant: number;
    limit_transaksi: number;
    limit_transaksi_merchant: number;
    minimal_transaksi: number;
    minimal_transaksi_merchant: number;
    created_at: string;
    updated_at: string;
}
export interface GetSettingsVariablesTransactionsRes {
    data: SettingVariableTransaction[];
    total: number;
    code: number;
    message: string;
}


// [put] http://localhost:4200/#/dashboard/settings/variables/transactions/:id
export interface PutSettingsVariablesTransactionsReq {
    transaksi_ppob: number;
    transaksi_pay_qr: number;
    transaksi_merchant: number;
    limit_transaksi: number;
    limit_transaksi_merchant: number;
    minimal_transaksi: number;
    minimal_transaksi_merchant: number;
}
export interface BeforeAfterPutSettingsVariablesTransactions {
    before: SettingVariableTransaction;
    after: SettingVariableTransaction;
}
export interface PutSettingsVariablesTransactionsRes {
    data: BeforeAfterPutSettingsVariablesTransactions;
    total: number;
    code: number;
    message: string;
}

export interface GetVouchersNameRes {
    data: string[];
    total: number;
    code: number;
    message: string;
}

export interface GetProductNameRes {
    data: string[];
    total: number;
    code: number;
    message: string;
}

export interface GetPPOBProductTypesRes {
    data: string[];
    total: number;
    code: number;
    message: string;
}

export interface GetSKURes {
    data: string[];
    total: number;
    code: number;
    message: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
    confirm_password: string;
}

export interface ChangePasswordResponse {
    code: number;
    message: string;
}

// Change Status

// Request
export interface ChangeStatusRequest {
    phone: string;
    status: boolean;
}

export interface ChangeStatusPartner {
    id: number;
    is_active: boolean;
}


export interface BulkAdjustmentResponse {
    data: BulkAdjustmentData;
    meta: MetaRes;
}

export interface ChangeStatusPartnerRes {
    data: ChangeStatusPartner;
    meta: MetaRes;
}

export interface BulkAdjustmentData {
    success: any;
    failed : any;
    total  : any;
}

// Response
export interface ChangeStatusResponse {
    data: string;
    meta: MetaRes;
    code: number;
    message: string;

}
export interface BulkAddCustomerRes {
    data: BulkAdjustmentData;
    meta: MetaRes;
}

export interface BulkAddCustomerData {
    success: any;
    failed : any;
    total  : any;
}

export interface BulkAddCustomerRes {
    data: BulkAdjustmentData;
    code: number;
    message: string;
}

export interface BulkAddCustomerData {
    success: any;
    failed : any;
    total  : any;
}
// History Bulk List
export interface HistoryBulk {
    data_history: Databulk[];
    total: any;
    code: number;
    message: string;
}
export interface Databulk {
    id        : number;
	date      : any;
	file_name  : any;
	total_data : any;
	success   : any;
    gagal     : any;
}
// History Bulk Detail List
export interface HistoryBulkDetail {
    data_history: DataBulkDetail[];
    code: number;
    message: string;
}

export interface DataBulkDetail {
    errorCode : any;
    errorDesc : any; 
    data : any;
}


export interface ReportUVResp {
    data : DataUV[] ;
    totalVoucher : number;
    totalPage : number;
    currentPage : number;
    code: number;
    message: string;
} 

export interface DataUV {
    voucherName : any;
    voucherType : any;
    voucherId   : any;
    status      : any;
    stock       : any;
    sku         : any;
}

export interface GetVoucherNameUV {
    voucherName: DataVoucherUV[];
    total : any;
    code: number;
    message: string;
}

export interface GetVoucherTypeUV {
    voucherType: DataVoucherUV[];
    total : any;
    code: number;
    message: string;
}

export interface GetVoucherCategoryUV {
    voucherName: DataVoucherUV[];
    total : any;
    code: number;
    message: string;
}

export interface DataVoucherUV {
    name: any;
}

export interface AddNewPartnerReq{
    namaPerusahaan : string;
    namaBrand : string;
    alamatPerusahaan : string;
    alamatDomisili : string;
    phoneNumber : string;
    jenisUsaha : string;
    taxNumber : string;
    typeUser : string;
    picNama : string;
    picEmail : string;
    picPhone : string;
    status : string;
}


export interface AddNewPartnerRes {
    Data: string;
    meta: MetaRes;
}


export interface AddNewStoreReq {
    m_institution_id : number;
    name : string;
    description : any;
    identifier : any;
    streetname : any;
    buildingname : any;
    unitname : any;
    postalcode : any;
    city : any;
    province : any;
    country : any;
    latitude : any;
    longtitude : any;
}

export interface AddNewStoreResp {
    data: string;
    meta: MetaRes;
}

export interface PartnerUploadReq {
    multiplefiles : any;
}

export interface PartnerUploadRes {
    data: PartnerUploadResData;
    Meta: MetaRes;
}

export interface PartnerUploadResData {
    success : number;
    failed : number;
    details : PartnerUploadResDetails;
}

export interface PartnerUploadResDetails {
    rc : string;
    rd : string;
    fileName : string;
}

export interface EditDataPartnerReq {
    namaPerusahaan : any;
    alamatPerusahaan : any;
    alamatDomisili : any;
    phoneNumber : any;
    jenisUsaha : any;
    taxNumber : any;
    typeUser : any;
    picNama : any;
    picEmail : any;
    picPhone : any;
    status : any;
}
export interface EditDataPartner {
    Data: EditDataPartners;
    Meta: MetaRes;
}

export interface EditDataPartners {
    ID : any;
}

export interface GetDataPartnerResp {
    Data: DataPatnerView;
    Meta: MetaRes;
    code: number;
}

export interface DataPatnerView {
    name : any;
    brandName : any;
    email : string;
    userType: number;
    address: string;
    residenceAddress: string;
    businessType: string;
    taxNumber: string;
    phone : string;
    picName: string;
    picEmail: string;
    picPhone : string;
    status:string;
    store : ViewStore[];
    file: FileDownload[];

}


export interface ViewStore {
    name : string;
    description : string;
    identifier : string;
    streetname : string;
    buildingName : string;
    unitname : string;
    postalCode : string;
    city : string;
    state : string;
    country : string;
    latitude : string;
    longtitude : string;
    createdAt : Time;
    createdBy : string;
    updatedAt : Time;
    updatedBy : string;
}

export interface FileDownload {
    Path : string;
    fileName : string;
} 

export interface DownloadFileRes {
    Meta: MetaRes;
    Data: string;
    code: number;
} 
export interface ApikeyRes {
    Meta: MetaRes;
    Data: string;
    code: number;
}

export interface IssuerListRes{
    response_code : string;
    messages : string;
    data : IssuerNameList[];
}

export interface IssuerNameList{
    id :number;
    institutionName :string;
    partnerId : string
}

export interface VoucherListRes{
    response_code : string;
    messages : string;
    data : VoucherNameList[];
}

export interface VoucherNameList{
    id :string;
    name :string;
}

export interface UpdateStatusReq {
    typeUser : any;
    status : any;    
}
export interface UpdateStatusRes {
    Data: ResDtaUpdateStatus;
    Meta: MetaRes;
}

export interface ResDtaUpdateStatus {
    ID : any;
}

export interface SKUListRes{
    response_code : string;
    messages : string;
    data : string;
}

export interface EarningRuleReq {
    name : string;
    desc : string;
    active : string;
    institution_id : number;
    type : string;
    rewardCampaignId : string; 
    rewardType : string; 
    eventName : string;
    pointsAmount : number;
    pointValue : number; 
    allTimeActive : boolean; 
    startAt : string;
    endAt : string;
    limitActive: boolean;
    limitPeriod: string;
    limitLimit: number;
    minOrderValue : number; 
    excludedSkuSkuIds : string;
    skuIds : string;
    // multiplier : string; //
    // labelMultipliers : string; //
    // skuIds : string; //
    // totalSkuIds : number; //
    // skuIds0 : string; // 
    // skuIds1 : string; //
    // skuIds2 : string; // 
    // skuIds3 : string; //
    // skuIds4 : string; //
}
export interface EarningRuleRes {
    data: string;
    messages: string;
    response_code:string;
}

export interface IssuerListRes1{
    response_code : string;
    messages : string;
    data : IssuerNameList1[];
}

export interface IssuerNameList1{
    id :number;
    institutionName :string;
    partnerId : string
}