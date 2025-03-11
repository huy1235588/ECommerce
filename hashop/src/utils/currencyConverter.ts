
/**
 * Tỉ lệ chuyển đổi cứng dựa trên USD.
 * Các tỉ lệ này chỉ mang tính ví dụ và có thể không phản ánh thị trường hiện tại.
 */
const conversionRates: { [currency: string]: number } = {
    USD: 1,      // Base currency: US Dollar
    EUR: 0.85,   // Euro
    GBP: 0.75,   // British Pound
    JPY: 110,    // Japanese Yen
    VND: 23000,  // Vietnamese Dong
    CAD: 1.4463,   // Canadian Dollar
    KRW: 1451.73 , // South Korean Wons
};

/**
 * Tỉ lệ điều chỉnh cho việc chuyển đổi giữa các loại tiền.
 * Các tỉ lệ này chỉ mang tính ví dụ và có thể không phản ánh thị trường hiện tại.
 */
const adjustmentRates: { [currency: string]: number } = {
    CAD: +8.47,   // CAD tăng 8.47%
    EUR: -8.49,  // EUR giảm 8.49%
    USD: 0,      // USD không thay đổi
    // Thêm các loại tiền khác nếu cần
};

/**
 * Điều chỉnh tỉ lệ chuyển đổi dựa trên loại tiền.
 *
 * @param rate - Tỉ lệ chuyển đổi ban đầu.
 * @param currency - Mã loại tiền cần điều chỉnh.
 * @returns Tỉ lệ đã được điều chỉnh.
 */
function adjustRate(rate: number, currency: string): number {
    const adjustment = adjustmentRates[currency];
    if (adjustment !== undefined) {
        // Áp dụng điều chỉnh: rate * (1 + adjustment / 100)
        return rate * (1 + adjustment / 100);
    }
    return rate; // Không điều chỉnh nếu không có trong danh sách
}

/**
 * Chuyển đổi một số tiền từ loại tiền này sang loại tiền khác sử dụng tỉ lệ chuyển đổi cố định.
 *
 * @param amount - Số tiền cần chuyển đổi.
 * @param fromCurrency - Mã loại tiền của số tiền ban đầu (ví dụ: "USD").
 * @param toCurrency - Mã loại tiền cần chuyển đổi sang (ví dụ: "EUR").
 * @returns Số tiền đã được chuyển đổi.
 * @throws Lỗi nếu mã loại tiền không được hỗ trợ.
 */
function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    // Điều chỉnh tỉ lệ chuyển đổi dựa trên loại tiền.
    amount = adjustRate(amount, fromCurrency);

    const fromRate = conversionRates[fromCurrency];
    const toRate = conversionRates[toCurrency];

    if (fromRate === undefined) {
        throw new Error(`Unsupported currency: ${fromCurrency}`);
    }
    if (toRate === undefined) {
        throw new Error(`Unsupported currency: ${toCurrency}`);
    }

    // Chuyển đổi qua USD trước, sau đó chuyển đổi sang loại tiền cần chuyển đổi.
    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;
    return convertedAmount;
}

export { convertCurrency };