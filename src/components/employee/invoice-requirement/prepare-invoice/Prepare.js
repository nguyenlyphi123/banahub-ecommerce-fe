import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../../contexts/AuthContext';
import {
  apiURL,
  LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
} from '../../../../contexts/constants';
import Moment from 'react-moment';

import './Prepare.css';
import { ENGINEER, PENDING } from '../../../constant/constants';

export default function Prepare({
  prepareData,
  handleClearPrepare,
  employees,
  position,
  workingSchedule,
}) {
  // context
  const {
    authState: { employee },
  } = useContext(AuthContext);

  // employee choosed
  const [employeeChoosed, setEmployeeChoosed] = useState([]);
  const [engineeringStaff, setEngineeringStaff] = useState({});
  const [exportStaff, setExportStaff] = useState({});

  const handleChoosed = (item) => {
    if (item.position.name.includes(ENGINEER)) setExportStaff(item._id);

    if (item.position.name.includes(ENGINEER)) setEngineeringStaff(item._id);

    const positionExist = employeeChoosed.find(
      (emp) => emp.position._id === item.position._id,
    );

    if (positionExist) {
      setEmployeeChoosed(
        employeeChoosed.map((choosed) =>
          choosed.position._id === item.position._id
            ? {
                ...positionExist,
                employee: item,
              }
            : choosed,
        ),
      );
    } else {
      setEmployeeChoosed([
        ...employeeChoosed,
        { position: item.position, employee: item },
      ]);
    }
  };

  // employee busy
  const [employeeBusy, setEmployeeBusy] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/invoice-requirement`)
      .then((res) =>
        res.data.invoices.filter((item) => item.status === PENDING),
      )
      .catch((err) => console.log(err));
  }, []);

  // handleSubmit
  const handleSubmit = async () => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_ACCESS_TOKEN_EMPLOYEE,
    );
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    console.log(accessToken);

    try {
      const response = await axios.post(
        `${apiURL}/invoice-requirement/create`,
        {
          bill_id: prepareData._id,
          responsible_staff: employee.info._id,
          engineering_staff: engineeringStaff,
          export_staff: exportStaff,
        },
        {
          headers: headers,
        },
      );

      if (response.data.success) {
        handleClearPrepare();
        setEmployeeChoosed([]);
        setEngineeringStaff({});
        setExportStaff({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='preparing-container'>
        <div className='invoice-detail'>
          <div onClick={() => handleClearPrepare()} className='preparing-exit'>
            x
          </div>

          <div className='id-code'>
            Sắp xếp nhân viên cho đơn hàng {prepareData.bill_code}
          </div>
        </div>

        <div className='preparing-employee-container row mt-3'>
          {position
            ?.filter(
              (item) =>
                item.name.includes('Bộ phận quản kho') ||
                item.name.includes('Bộ phận kỹ thuật'),
            )
            .map((item, index) => {
              return (
                <div key={index} className='preparing-employee col-6'>
                  <div class='dropdown preparing-dropdown'>
                    <button
                      type='button'
                      class='btn preparing-btn dropdown-toggle'
                      data-toggle='dropdown'
                    >
                      {item.name}
                    </button>
                    <div class='dropdown-menu preparing-menu'>
                      {/* {employees
                        ?.filter((emp) => emp.position.name.includes(item.name))
                        .map((emp) => {
                          return (
                            <div
                              key={emp._id}
                              onClick={() => handleChoosed(emp)}
                              class='dropdown-item employee'
                            >
                              {emp.name}
                            </div>
                          );
                        })} */}

                      {workingSchedule.map((workingSchedule) => {
                        return workingSchedule.positions.map((working) => {
                          if (working.position.name === item.name)
                            return working.employees.map((emp) => {
                              if (
                                employeeBusy.find(
                                  (busy) =>
                                    busy.export_staff._id ===
                                      emp.employee._id ||
                                    busy.engineering_staff._id ===
                                      emp.employee._id,
                                )
                              )
                                return (
                                  <div
                                    key={emp.employee._id}
                                    onClick={() => handleChoosed(emp.employee)}
                                    class='dropdown-item employee busy'
                                  >
                                    {emp.employee.name}
                                  </div>
                                );
                              else {
                                return (
                                  <div
                                    key={emp.employee._id}
                                    onClick={() => handleChoosed(emp.employee)}
                                    class='dropdown-item employee'
                                  >
                                    {emp.employee.name}
                                  </div>
                                );
                              }
                            });
                        });
                      })}
                    </div>
                  </div>

                  <div className='employee-choosed-container'>
                    {employeeChoosed?.map((choosed, index) => {
                      if (choosed.position._id === item._id)
                        return (
                          <div key={index} className='employee-choosed'>
                            {choosed.employee.name}
                          </div>
                        );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        <div className='d-flex justify-content-center'>
          <div onClick={() => handleSubmit()} className='prepare-submit'>
            Sắp xếp
          </div>
        </div>
      </div>
    </>
  );
}
