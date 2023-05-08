import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

import { apiURL } from '../../../../contexts/constants';
import '../../stylesheet/Working-Schedule.css';

export default function Working() {
  // get working-schedule data
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiURL}/working-schedule`)
      .then((res) =>
        setScheduleData(
          res.data.workingSchedule
            .filter(
              (item) =>
                Date.parse(moment(item.date).format('L')) >=
                Date.parse(moment().format('L')),
            )
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
        ),
      )
      .catch((err) => console.log(err));
  }, []);

  // navigate
  const navigate = useNavigate();

  return (
    <>
      <div className='container-fluid'>
        <div className='schedule-container'>
          <div className='schedule-context'>Lịch làm việc</div>
          <div
            onClick={() =>
              navigate('/employee/working-schedule/scheduling', {
                state: { scheduleData: scheduleData },
              })
            }
            className='new-schedule'
          >
            Sắp xếp lịch làm việc
          </div>
          {scheduleData.length === 0 ? (
            <div className='warehousing-empty'>
              <i class='fas fa-box-open'></i>
              Tạm thời không có lịch làm việc, xin vui lòng xếp lịch làm việc
            </div>
          ) : (
            scheduleData?.map((schedule, index) => {
              return (
                <>
                  <div className='schedule'>
                    <div key={schedule._id} className='date'>
                      Ngày
                      <Moment format='DD/MM/YYYY' className='ml-2'>
                        {schedule.date}
                      </Moment>
                    </div>
                    <div key={index} className='position-container'>
                      {schedule.positions.map((positions, index) => {
                        return (
                          <div key={index}>
                            <div className='employee-list'>
                              <div className='position-name'>
                                {positions.position.name}
                              </div>
                              <div className='employee-container'>
                                {positions.employees.map((employees, index) => {
                                  return (
                                    <div key={index} className='employee'>
                                      {employees.employee.name}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
