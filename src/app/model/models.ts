export interface MetaResponse {
    status: boolean;
    code: number;
    message: string;
}

// Login
export interface LoginResponse {
    token: string;
    code: string;
    message: string;
}

// Users
export interface User {
    id: number;
    nama: string;
    phone: string;
    cust_id: string;
    email: string;
    merchant_id: string;
    status: boolean;
}
export interface GetUsersResponse {
    users: User[];
    total: number;
    code: number;
    message: string;
}
export interface ExportUsersToCSVRequest {
    total: number;
}

// PPOB
export interface TransactionsEarningsPPOB {
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
}
export interface GetTransactionsEarningsPPOBResponse {
    data: TransactionsEarningsPPOB[];
    total: number;
    code: number;
    message: string;
}
export interface ExportTransactionsEarningsPPOBToCSVRequest {
    start_date: string;
    end_date: string;
    phone: string;
    cust_id: string;
    type_trans: string;
    product_code: string;
}

// Transaction Qrs
export interface TransactionQr {
    id: number;
    merchant_id: string;
    cust_id: string;
    amount: number;
    date_time: string;
    created_at: string;
    updated_at: string;
    point: number;
}
export interface GetTransactionQrsResponse {
    transaction_qrs: TransactionQr[];
    total: number;
    code: number;
    message: string;
}
export interface ExportTransactionQrsToCSVRequest {
    start_date: string;
    end_date: string;
    cust_id: string;
}

// Transactions Redeem Vouchers
export interface TransactionsRedeemVoucher {
    id: number;
    nama: string;
    phone: string;
    rc: string;
    voucher: string;
    campaign_id: string;
    coupon_id: string;
    product_code: string;
    created_at: string;
    updated_at: string;
}
export interface GetTransactionsRedeemVouchersResqpose {
    data: TransactionsRedeemVoucher[];
    total: number;
    code: number;
    message: string;
}

// Payment Qrs
export interface PaymentQr {
    id: number;
    merchant_id: string;
    phone: string;
    amount: number;
    account_number: string;
    rrn: string;
    created_at: string;
    updated_at: string;
}
export interface GetPaymentQrsResponse {
    payment_qrs: PaymentQr[];
    total: number;
    code: number;
    message: string;
}
export interface ExportPaymentQrsToCSVRequest {
    total: number;
}

// Eligible
export interface AddEligibleUserRequest {
    nama: string;
    merchant_id: string;
    phone: string;
    institution: string;
}
export interface AddEligibleUserResponse {
    data: string;
    meta: MetaResponse;
}

// Register
export interface RegisterUserRequest {
    firstName: string;
    lastName: string;
    phone: string;
    institution: string;
}
export interface RegisterUserResponse {
    data: string;
    meta: MetaResponse;
}


export interface AnalyticTransaction {
    amount: number;
    point: number;
    tahun: string;
    bulan: string;
    hari: string;
}
export interface GetAnalyticTransactionsResponse {
    analytic_transactions: AnalyticTransaction[];
    total: number;
    code: number;
    message: string;
}

export interface GetAnalyticUsersResponse {
    eligible_registered: number;
    eligible_unregistered: number;
    uneligible_registered: number;
    uneligible_unregistered: number;
    total: number;
    code: number;
    message: string;
}
