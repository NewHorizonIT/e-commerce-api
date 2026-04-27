export const generatePayID = (wallet: string, orderId: number) => {
  // Tạo ID thanh toán bao gồm cả giây để tránh trùng lặp
  const now = new Date();
  const timestamp = now.getTime();
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  return `${wallet}${timestamp}${seconds}${milliseconds}_${orderId}`;
};
