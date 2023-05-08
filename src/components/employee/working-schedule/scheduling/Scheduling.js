import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import '../scheduling/Scheduling.css';

export default function Scheduling() {
  // scheduleData
  const location = useLocation();
  const scheduleData = location.state.scheduleData;

  // get position data
  const [position, setPosition] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/position`)
      .then((res) => setPosition(res.data.positions))
      .catch((err) => console.log(err));
  }, []);

  //get employee
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/employee`)
      .then((res) => setEmployee(res.data.employee))
      .catch((err) => console.log(err));
  }, []);

  // employee popup
  const [employeeChoosed, setEmployeeChoosed] = useState([]);

  // hanlde save
  const handleSave = async () => {
    if (employeeChoosed === []) {
      setAlertFalse('Vui lòng sắp xếp lịch cho tất cả nhân viên');
      return;
    }

    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.post(
        `${apiURL}/working-schedule/create `,
        {
          date: dateChoosed,
          positions: employeeChoosed,
          week: calendar,
        },
        {
          headers: headers,
        },
      );

      if (response.data.success) {
        setAlertSuccess('Sắp xếp lịch làm thành công !!!');
      }
    } catch (error) {
      console.log(error);
      setAlertFalse(
        'Hiện tại không thể hoàn tất sắp xếp, vui lòng thử lại sau',
      );
    }
    // console.log(getScheduleByWeek(dateChoosed, employeeChoosed, calendar));
  };

  // handle cancel
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/employee/working-schedule');
  };

  // calendar
  const [calendar, setCalendar] = useState([]);
  const [dat, setDat] = useState(moment());

  let nextWeekStart = dat.clone().add(1, 'week').startOf('week');
  let nextWeekEnd = dat.clone().add(1, 'week').endOf('week');

  useEffect(() => {
    const nextWeekDays = [];
    let day = nextWeekStart.clone();
    while (day.isSameOrBefore(nextWeekEnd)) {
      nextWeekDays.push(day.clone());
      day.add(1, 'day');
    }

    const parsedData = nextWeekDays.map((day) => day.format('YYYY-MM-DD'));

    setCalendar(parsedData);
  }, [dat]);

  const handlePrevWeek = () => {
    return dat.clone().subtract(1, 'week');
  };

  const handleNextWeek = () => {
    return dat.clone().add(1, 'week');
  };

  // handle select
  const [dateChoosed, setDateChoosed] = useState([]);

  const handleSelect = (e, employee, positionId, date) => {
    e.currentTarget.style.backgroundColor === 'rgba(43, 176, 43, 0.7)'
      ? (e.currentTarget.style.backgroundColor = 'transparent')
      : (e.currentTarget.style.backgroundColor = 'rgba(43, 176, 43, 0.7)');

    const employeeExist = employeeChoosed.find(
      (item) => item.position === positionId,
    );

    if (employeeExist) {
      const updatedEmployees = employeeChoosed.map((item) => {
        if (
          item.position === positionId &&
          !item?.employees.find((emp) => emp.employee === employee._id)
        ) {
          return {
            ...item,
            employees: [...employeeExist.employees, { employee: employee._id }],
          };
        }
        return item;
      });
      setEmployeeChoosed(updatedEmployees);
    } else {
      setEmployeeChoosed([
        ...employeeChoosed,
        {
          position: positionId,
          employees: [{ employee: employee._id }],
        },
      ]);
    }

    const isEmployee = dateChoosed?.find(
      (dat) => dat.employee === employee._id,
    );

    if (isEmployee) {
      const dateExists = isEmployee?.date.find(
        (dat) => moment(dat).format('L') === moment(date).format('L'),
      );

      if (!dateExists) {
        const updatedDate = dateChoosed.map((item) => {
          if (item.employee === employee._id) {
            return {
              ...item,
              date: [...(item.date || []), date],
            };
          }
          return item;
        });

        setDateChoosed(updatedDate);
      } else {
        setDateChoosed((dates) =>
          dates.map((item) =>
            item.employee === employee._id
              ? {
                  ...item,
                  date: item.date.filter(
                    (d) => moment(d).format('L') !== moment(date).format('L'),
                  ),
                }
              : item,
          ),
        );
      }
    } else {
      setDateChoosed([
        ...dateChoosed,
        {
          employee: employee._id,
          date: [date],
        },
      ]);
    }
  };

  // popup alert
  const [message, setMessage] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const SuccessAlert = () => {
    return (
      <div className='alert alert-success alert-dismissible'>
        <button
          onClick={() => {
            handleResetAlert();
          }}
          type='button'
          className='close'
          data-dismiss='alert'
        >
          &times;
        </button>
        <strong>Thành công!</strong> {message}
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
        <strong>Lỗi!</strong> {message}
      </div>
    );
  };

  const setAlertSuccess = (message) => {
    setIsPopup(true);
    setIsSuccess(true);
    setMessage(message);
  };

  const setAlertFalse = (message) => {
    setIsPopup(true);
    setIsSuccess(false);
    setMessage(message);
  };

  const handleResetAlert = () => {
    setIsPopup(false);
    setIsSuccess(false);
    setMessage('');
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='schedule-container'>
          <div className='schedule-context'>Sắp xếp lịch làm việc</div>

          {isPopup ? (isSuccess ? SuccessAlert() : DangerAlert()) : ''}

          <div className='container p-0'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th className='d-flex justify-content-between'>
                    <div
                      onClick={() => setDat(handlePrevWeek())}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className='fas fa-arrow-circle-left'></i>
                    </div>
                    {moment(nextWeekStart).format('DD/MM')}
                    {' - '}
                    {moment(nextWeekEnd).format('DD/MM')}
                    <div
                      onClick={() => setDat(handleNextWeek())}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className='fas fa-arrow-circle-right'></i>
                    </div>
                  </th>
                  <th className='text-center'>CN</th>
                  <th className='text-center'>T2</th>
                  <th className='text-center'>T3</th>
                  <th className='text-center'>T4</th>
                  <th className='text-center'>T5</th>
                  <th className='text-center'>T6</th>
                  <th className='text-center'>T7</th>
                </tr>
              </thead>
              <tbody>
                {employee?.map((employee, index) => {
                  return (
                    <tr key={index}>
                      <td>{employee.name}</td>
                      {calendar.map((day) => {
                        return (
                          <td
                            onClick={(e) =>
                              handleSelect(
                                e,
                                employee,
                                employee.position._id,
                                day,
                              )
                            }
                            className='schedule-box '
                          ></td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-end'>
            <div onClick={() => handleCancel()} className='btn-cancel'>
              Thoát
            </div>
            <div onClick={() => handleSave()} className='btn-save'>
              Lưu
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
