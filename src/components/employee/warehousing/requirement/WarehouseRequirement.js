import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { PrintWarehouse } from '../warehouse-printing/PrintWarehouse';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import { EXPORTING, PREPARING, WAREHOUSE } from '../../../constant/constants';
import('./WarehouseRequirement.css');

function CustomDiv({ link, activeLink, onClick }) {
  const isActive = link === activeLink;
  const style = isActive
    ? {
        color: '#fff',
        backgroundColor: 'rgba(21, 164, 21, 0.77)',
      }
    : { color: 'rgba(0, 0, 0, 0.526)' };

  return (
    <div style={style} className='employee-item' onClick={() => onClick(link)}>
      {link}
    </div>
  );
}

export default function WarehouseRequirement() {
  // customDiv
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  // trigger
  const [trigger, setTrigger] = useState(false);

  // get bill data
  const [bill, setBill] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/bill`)
        .then((res) =>
          setBill(
            res.data.bills
              .filter((item) => item.status === PREPARING)
              .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt)),
          ),
        )
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [trigger]);

  // get invoices
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/invoice-requirement`)
        .then((res) => setInvoices(res.data.invoices))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, [trigger]);

  // get export_employee
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    try {
      axios
        .get(`${apiURL}/employee`)
        .then((res) =>
          setEmployee(
            res.data.employee.filter(
              (item) => item.position.name === WAREHOUSE,
            ),
          ),
        )
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // get schedule
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    axios.get(`${apiURL}/working-schedule`).then((res) => {
      setSchedule(
        res.data.workingSchedule.filter(
          (wc) =>
            moment(wc.date).format('DD/MM/YYYY') ===
            moment().format('DD/MM/YYYY'),
        ),
      );
    });
  }, []);

  // handleSubmit
  const [invoiceChoosed, setInvoiceChoosed] = useState();
  const [employeeChoosed, setEmployeeChoosed] = useState();

  const handleSubmit = async (invoices_id) => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.put(
        `${apiURL}/invoice-requirement/update/${invoices_id}/export`,
        { export_staff: employeeChoosed },
      );

      if (response.data.success) {
        setAlertSuccess('Đã sắp xếp nhân viên cho đơn hàng');
        setPopupId('');
      }
    } catch (error) {
      setAlertFalse('Không thể sắp xếp nhân viên cho đơn hàng');
    }
  };

  // choose staff popup
  const [popupId, setPopupId] = useState('');
  const [isChooseEmployee, setIsChooseEmployee] = useState(false);

  const ChooseEmployeePopup = (employee) => {
    return (
      <>
        <div className='employee-popup-container'>
          <div className='employee-position-header'>Danh sách nhân viên</div>

          <div className='employee-list-container'>
            {employee
              .filter((emp) => {
                const employees = schedule[0].positions.find((pos) => {
                  if (pos.position._id == emp.position._id)
                    return pos.employees;
                });
                console.log(employees.employees);
                return employees.employees.find(
                  (e) => e.employee._id === emp._id,
                );
              })
              .map((emp) => {
                if (
                  invoices
                    .filter(
                      (inv) =>
                        inv.status === EXPORTING && inv.export_staff !== null,
                    )
                    .find((inv) => inv.export_staff._id === emp._id)
                )
                  return (
                    <div className='employee-item employee-busy'>
                      {emp.name}
                    </div>
                  );
                else
                  return (
                    <CustomDiv
                      onClick={(e) => {
                        setEmployeeChoosed(emp._id);
                        handleLinkClick(e);
                      }}
                      className='employee-item'
                      link={emp.name}
                      activeLink={activeLink}
                    />
                  );
              })}
          </div>

          <div className='employee-popup-button'>
            <div
              onClick={() => {
                setPopupId('');
                setActiveLink('');
              }}
              className='employee-button-cancel'
            >
              Thoát
            </div>

            <div
              onClick={() => handleSubmit(invoiceChoosed)}
              className='employee-button-submit'
            >
              Xác nhận
            </div>
          </div>
        </div>
      </>
    );
  };

  const handlePrepareEmployee = (bill_id) => {
    setPopupId(bill_id);
    setAlertId(bill_id);
    handleResetAlert();
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isAlert, setIsAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertId, setAlertId] = useState('');

  const SuccessAlert = () => {
    return (
      <div className='alert alert-success alert-dismissible'>
        <button
          onClick={() => {
            handleResetAlert();
            setTrigger(!trigger);
          }}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Success!</strong> {message}
      </div>
    );
  };

  const DangerAlert = () => {
    return (
      <div className='alert alert-danger alert-dismissible'>
        <button
          onClick={handleResetAlert}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Warning!</strong> {message}
      </div>
    );
  };

  const setAlertSuccess = (message) => {
    setIsAlert(true);
    setIsSuccess(true);
    setMessage(message);
  };

  const setAlertFalse = (message) => {
    setIsAlert(true);
    setIsSuccess(false);
    setMessage(message);
  };

  const handleResetAlert = () => {
    setIsAlert(false);
    setIsSuccess(false);
    setMessage('');
  };

  // Printing
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTittle: 'Product Invoice',
  });

  // Convert number
  const formatter = new Intl.NumberFormat('en');

  return (
    <>
      {bill.length === 0 ? (
        <div className='warehousing-empty'>
          <i class='fas fa-box-open'></i>
          Tạm thời không có đơn hàng
        </div>
      ) : (
        bill?.map((item, index) => {
          return (
            <div key={index} className='invoice-process-container'>
              {isAlert
                ? alertId === item._id
                  ? isSuccess
                    ? SuccessAlert()
                    : DangerAlert()
                  : ''
                : ''}

              {popupId === item._id ? ChooseEmployeePopup(employee) : ''}

              <div className='ip-customer d-flex justify-content-between'>
                <div>Khách hàng: {item.customer.name}</div>
                <div>
                  Ngày đặt:
                  <Moment className='ml-2' format='DD/MM/YYYY'>
                    {item.createAt}
                  </Moment>
                </div>
              </div>

              <div className='ip-product-container'>
                {item.cart_list.map((cart) => {
                  return (
                    <div className='ip-product'>
                      <div className='product-image'>
                        <img
                          src={cart.product.image}
                          alt=''
                          style={{ width: '80px' }}
                        />
                      </div>
                      <div
                        key={cart.product._id}
                        className='product-detail d-flex justify-content-between align-items-center w-100 ml-2'
                      >
                        <div className='product-name d-flex flex-column '>
                          {cart.product.name}{' '}
                          <p className='ml-1 mb-0' style={{ color: 'red' }}>
                            {' '}
                            x {cart.quantity}
                          </p>
                        </div>

                        <div className='product-price'>
                          {formatter.format(cart.product.price)} VNĐ
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='ip-prepare'>
                <div className='prepare-total-price text-end'>
                  <span style={{ color: 'black' }}>Thành tiền: </span>
                  {formatter.format(item.last_cost)} VNĐ
                </div>

                <div className='prepare-container d-flex justify-content-between align-items-center'>
                  <div className='prepare-content'>
                    {invoices?.map((invoice) => {
                      if (invoice.bill_id.includes(item._id))
                        if (invoice.export_staff)
                          return (
                            <>
                              <div className='employee'>
                                Nhân viên xuất kho: {invoice.export_staff.name}
                              </div>
                            </>
                          );
                        else
                          return (
                            <div>
                              Xin vui lòng nhấn "Sắp xếp nhân viên" để sắp xếp
                              nhân viên xuất kho chuẩn bị cho đơn hàng.
                            </div>
                          );
                    })}
                  </div>
                  {invoices?.map((invoice) => {
                    if (invoice.bill_id.includes(item._id))
                      if (invoice.export_staff)
                        return (
                          <div
                            onClick={() => {
                              handlePrint(item);
                            }}
                            className='prepare-btn'
                          >
                            In phiếu xuất kho
                          </div>
                        );
                      else
                        return (
                          <div
                            onClick={() => {
                              handlePrepareEmployee(item._id);
                              setInvoiceChoosed(invoice._id);
                            }}
                            className='prepare-btn'
                          >
                            Sắp xếp nhân viên
                          </div>
                        );
                  })}
                </div>
              </div>
              <div style={{ display: 'none' }}>
                <PrintWarehouse ref={componentRef} printData={item} />
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
