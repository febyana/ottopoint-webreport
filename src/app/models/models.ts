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
export interface GetTransactionsEarningsPPOBRes {
    data: TransactionEarningPPOB[];
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

// Eligible
export interface AddEligibleUserReq {
    nama: string;
    merchant_id: string;
    phone: string;
    institution: string;
}
export interface AddEligibleUserRes {
    data: string;
    meta: MetaRes;
}

// Register
export interface RegisterUserReq {
    firstName: string;
    lastName: string;
    phone: string;
    institution: string;
}
export interface RegisterUserRes {
    data: string;
    meta: MetaRes;
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
    minimal_transaksi: number;
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
    minimal_transaksi: number;
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

export interface GetPPOBProductTypesRes {
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