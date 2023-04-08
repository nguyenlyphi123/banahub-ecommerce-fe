module.exports = Object.freeze({
  // account level
  ADMIN: 2,
  EMPLOYEE: 1,
  CUSTOMER: 0,
  // employee position
  MANAGER: 'Quản lý',
  WAREHOUSE: 'Bộ phận quản kho',
  ENGINEER: 'Bộ phận kỹ thuật',
  SELL: 'Bộ phận bán hàng',
  WARRANTY: 'Bộ phận chăm sóc khách hàng',

  // bill status
  PREPARING: 'Preparing',
  AWAITING: 'Awaiting',
  DELIVERING: 'Delivering',
  DELIVERED: 'Delivered',
  CANCELED: 'Canceled',

  // invoice status
  PENDING: 'Awaiting',
  EXPORTING: 'Exporting',
  INSTALLING: 'Installing',
  INSTALLED: 'Installed',
  COMPLETE: 'Complete',

  // promotion status
  PROCESSING: 'PROCESSING',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',

  // warranty status
  CONFIRM: 'Confirm',
  TRANSFERING: 'Transfering',
  TRANSFERED: 'Transfered',
});
