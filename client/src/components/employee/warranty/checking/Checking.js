import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import moment from 'moment';
import { CONFIRM } from '../../../constant/constants';
import ScrollToTop from '../../../../ScrollToTop';

import('./Checking.css');

export default function Checking() {
  // get warranty data
  const [trigger, setTrigger] = useState(false);
  const [warranties, setWarranties] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty`)
      .then((res) =>
        setWarranties(
          res.data.warranties.filter((warr) => warr.status === CONFIRM),
        ),
      )
      .catch((err) => console.log(err));
  }, [trigger]);

  // get warranty category data
  const [category, setCategory] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty-category`)
      .then((res) => setCategory(res.data.warranties))
      .catch((err) => console.log(err));
  }, []);

  // get warranty pursuit
  const [pursuit, setPursuit] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiURL}/warranty-pursuit`)
      .then((res) => setPursuit(res.data.pursuits))
      .catch((err) => console.log(err));
  }, []);

  // prepare data
  const [warrantyListData, setWarrantyListData] = useState([]);

  // category choosed
  const [categoryChoosed, setCategoryChoosed] = useState([]);
  const handleCategoryChoosed = (category, product, bill) => {
    const categoryChoosedExists = categoryChoosed.find(
      (cat) => cat.product === product._id,
    );

    if (categoryChoosedExists) {
      setCategoryChoosed((prev) =>
        prev.map((cat) =>
          cat.product === product._id
            ? { ...cat, category: category._id }
            : cat,
        ),
      );
    } else {
      setCategoryChoosed((prev) => [
        ...prev,
        {
          product: product._id,
          bill: bill._id,
          category: category._id,
        },
      ]);
    }

    const billExists = warrantyListData.find(
      (warr) =>
        warr.bill === bill._id &&
        warr.warranty_list.find((list) => list.product === product._id),
    );

    if (billExists) {
      const updatedWarrantyListData = warrantyListData.map((warr) => {
        if (warr.bill === bill._id) {
          const updatedWarrantyList = warr.warranty_list.map((warranty) => {
            if (warranty.product === product._id) {
              return {
                ...warranty,
                warranty_category: category._id,
                warranty_pursuit: null,
                expected_duration: null,
              };
            }
            return warranty;
          });
          return {
            ...warr,
            warranty_list: updatedWarrantyList,
          };
        }
        return warr;
      });
      setWarrantyListData(updatedWarrantyListData);
    } else {
      if (warrantyListData.length > 0) {
        const updatedWarrantyListData = warrantyListData.map((warr) => {
          if (warr.bill === bill._id) {
            return {
              ...warr,
              warranty_list: [
                ...warr.warranty_list,
                {
                  product: product._id,
                  warranty_category: category._id,
                  warranty_pursuit: null,
                  expected_duration: null,
                },
              ],
            };
          }
          return warr;
        });
        setWarrantyListData(updatedWarrantyListData);
      } else {
        setWarrantyListData([
          {
            bill: bill._id,
            warranty_list: [
              {
                product: product._id,
                warranty_category: category._id,
                warranty_pursuit: null,
                expected_duration: null,
              },
            ],
          },
        ]);
      }
    }
  };

  // pursuit choosed
  const [pursuitChoosed, setPursuitChoosed] = useState([]);
  const handlePursuitChoosed = (pursuit, product, bill) => {
    const pursuitChoosedExists = pursuitChoosed.find(
      (pur) => pur.product === product._id,
    );

    if (pursuitChoosedExists) {
      setPursuitChoosed((prev) =>
        prev.map((pur) =>
          pur.product === product._id ? { ...pur, pursuit: pursuit._id } : pur,
        ),
      );
    } else {
      setCategoryChoosed((prev) => [
        ...prev,
        {
          product: product._id,
          bill: bill._id,
          pursuit: pursuit._id,
        },
      ]);
    }

    const billExists = warrantyListData.find(
      (warr) =>
        warr.bill === bill._id &&
        warr.warranty_list.find((list) => list.product === product._id),
    );

    if (billExists) {
      const updatedWarrantyListData = warrantyListData.map((warr) => {
        if (warr.bill === bill._id) {
          const updatedWarrantyList = warr.warranty_list.map((warranty) => {
            if (warranty.product === product._id) {
              return {
                ...warranty,
                warranty_pursuit: pursuit._id,
                expected_duration: pursuit.timestamp,
              };
            }
            return warranty;
          });
          return {
            ...warr,
            warranty_list: updatedWarrantyList,
          };
        }
        return warr;
      });
      setWarrantyListData(updatedWarrantyListData);
    }
  };

  // handleSubmit
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleSubmit = async (warrantyId, billId) => {
    if (warrantyListData.length < 0) {
      setAlertFalse('Vui lòng kiểm tra lại thông tin trước khi xác nhận');
      return;
    }

    setAlertId(billId);
    console.log(warrantyListData[0].warranty_list);
    try {
      const accessToken = localStorage.getItem(
        LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
      );
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await axios.put(
        `${apiURL}/warranty/update/checking/${warrantyId}`,
        {
          bill: billId,
          warranty_list: warrantyListData[0].warranty_list,
        },
        { headers: headers },
      );

      if (response.data.success) {
        setAlertSuccess(`Đơn hàng sẽ được chuyển đi sớm nhất có thể`);
        handleResetData();
      }
    } catch (error) {
      console.log(error);
      setAlertFalse('Server hiện tại đang bận, vui lòng thử lại sau');
    }
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
    setSubmitSuccess(!submitSuccess);
  };

  const setAlertFalse = (message) => {
    setIsAlert(true);
    setIsSuccess(false);
    setMessage(message);
    setSubmitSuccess(!submitSuccess);
  };

  const handleResetAlert = () => {
    setIsAlert(false);
    setIsSuccess(false);
    setMessage('');
    setTrigger(!trigger);
  };

  const handleResetData = () => {
    setCategoryChoosed([]);
    setPursuitChoosed([]);
    setWarrantyListData([]);
  };

  // crop product name
  const truncate = (e) => {
    return e.length > 55 ? e.substring(0, 40) + '...' : e;
  };

  return (
    <>
      <ScrollToTop dataFetchSuccess={submitSuccess} />
      <div className='warranty-receive-container'>
        <div className='warranty-receive-header'>Kiểm tra sản phẩm</div>

        {warranties.length === 0 ? (
          <div className='warranty-empty'>
            <i class='fas fa-box-open'></i>
            Tạm thời không có đơn hàng cần kiểm tra
          </div>
        ) : (
          warranties.map((warr) => {
            return (
              <div className='warranty-check-list'>
                {isAlert
                  ? alertId === warr.bill._id
                    ? isSuccess
                      ? SuccessAlert()
                      : DangerAlert()
                    : ''
                  : ''}

                <div className='warranty-check-item'>
                  <div className='wci-info'>
                    <div className='wci-customer'>
                      Khách hàng: {warr.bill.customer.name}
                    </div>

                    <div className='wci-date'>
                      Ngày đặt:{' '}
                      {moment(warr.bill.createAt).format('DD/MM/YYYY')}
                    </div>
                  </div>

                  {warr.warranty_list.map((wItem) => {
                    return (
                      <div className='wci-detail'>
                        <div className='wci-product'>
                          <div className='wci-product-info'>
                            <div className='image'>
                              <img src={wItem.product.image} alt='' />
                            </div>
                            <div className='name'>
                              <p className='m-0'>{wItem.product.name}</p>
                            </div>
                          </div>
                        </div>

                        <div className='wci-product-choose row mt-3'>
                          <div className='col-6 p-1'>
                            <div className='wci-header'>Chọn danh mục</div>

                            <div className='wci-category ml-2 mr-2'>
                              {category.map((cat) => {
                                return (
                                  <div
                                    onClick={() =>
                                      handleCategoryChoosed(
                                        cat,
                                        wItem.product,
                                        warr.bill,
                                      )
                                    }
                                    className={`wci-choose-item ${
                                      categoryChoosed.find(
                                        (item) =>
                                          item.category === cat._id &&
                                          item.bill === warr.bill._id &&
                                          item.product === wItem.product._id,
                                      )
                                        ? 'c-choosed'
                                        : ''
                                    }`}
                                  >
                                    {cat.name}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className='col-6 p-1'>
                            <div className='wci-header'>
                              Chọn chi tiết bảo hành
                            </div>
                            <div className='wci-pursuit ml-2 mr-2'>
                              {categoryChoosed
                                ? pursuit.map((purs) => {
                                    if (
                                      categoryChoosed.find(
                                        (item) =>
                                          item.category === purs.warranty &&
                                          wItem.product._id === item.product,
                                      )
                                    )
                                      return (
                                        <div
                                          onClick={() =>
                                            handlePursuitChoosed(
                                              purs,
                                              wItem.product,
                                              warr.bill,
                                            )
                                          }
                                          className={`wci-choose-item ${
                                            categoryChoosed.find(
                                              (item) =>
                                                item.pursuit === purs._id &&
                                                item.bill === warr.bill._id &&
                                                item.product ===
                                                  wItem.product._id,
                                            )
                                              ? 'c-choosed'
                                              : ''
                                          }`}
                                        >
                                          {purs.name}
                                        </div>
                                      );
                                  })
                                : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='warranty-receive-button-container'>
                  <div
                    onClick={() => handleSubmit(warr._id, warr.bill._id)}
                    className='warranty-receive-button'
                  >
                    Xác nhận
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
