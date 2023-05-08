import React, { useEffect, useState } from 'react';
import { Chart, LineElement } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { apiURL } from '../../../../../contexts/constants';
import moment from 'moment';

Chart.register(LineElement);

export default function DailySaleLineChart({ product_id }) {
  // get day of week
  // calendar
  const [calendar, setCalendar] = useState([]);
  const [dat, setDat] = useState(moment());

  var weekStart = dat.clone().startOf('week');
  var weekEnd = dat.clone().endOf('week');

  useEffect(() => {
    const weekDays = [];
    let day = weekStart.clone();
    while (day.isSameOrBefore(weekEnd)) {
      weekDays.push(day.clone());
      day.add(1, 'day');
    }

    const parsedData = weekDays.map((day) => day.format('DD/MM/YYYY'));

    setCalendar(parsedData);
  }, [dat]);

  // Setup data
  const [dailySale, setDailySale] = useState([]);

  const labels = dailySale?.map((item) => item.date);

  var data = {
    labels: labels,
    datasets: [
      {
        label: 'Daily sales',
        data: dailySale?.map((item) => item.count),

        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, .8)',
          'rgba(75, 192, 192, .8)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    legend: {
      labels: {
        fontSize: 24,
      },
    },
  };

  useEffect(() => {
    const billFetch = () => {
      axios
        .get(`${apiURL}/bill`)
        .then((res) => {
          setDailySale([]);

          const weekDates = calendar
            .filter((date) =>
              moment(date, 'DD/MM/YYYY').isBetween(
                weekStart,
                weekEnd,
                null,
                '[]',
              ),
            )
            .map((date) => ({ date, count: 0 }));

          const dailySaleCopy = [...dailySale];

          res.data.bills.forEach((bill) => {
            const billDate = moment(bill.createAt).format('DD/MM/YYYY');

            const daySale = weekDates.find((day) => day.date === billDate);

            if (daySale) {
              bill.cart_list.forEach((cart) => {
                if (cart.product._id === product_id) {
                  daySale.count += cart.quantity;
                }
              });
            }
          });

          const updatedDailySale = weekDates.map(
            (day) =>
              dailySaleCopy.find((sale) => sale.date === day.date) || day,
          );

          setDailySale(updatedDailySale);
        })
        .catch((err) => console.log(err));
    };

    billFetch();
  }, [product_id, calendar, dat]);

  // filter
  const [filterHeader, setFilterHeader] = useState('Tuần này');

  const handleWeekNow = () => {
    setDat(dat.clone().add(1, 'week'));
  };

  const handleWeekPrev = () => {
    setDat(dat.clone().subtract(1, 'week'));
  };

  return (
    <>
      <div class='dropdown text-end'>
        <button
          type='button'
          class='btn btn-dark dropdown-toggle'
          data-toggle='dropdown'
          style={{ width: 'fit-content' }}
        >
          {filterHeader}
        </button>
        <div class='dropdown-menu'>
          <div
            onClick={() => {
              setFilterHeader('Tuần này');
              handleWeekNow();
            }}
            class='dropdown-item'
          >
            Tuần này
          </div>
          <div
            onClick={() => {
              setFilterHeader('Tuần trước');
              handleWeekPrev();
            }}
            class='dropdown-item'
          >
            Tuần trước
          </div>
        </div>
      </div>
      <Line data={data} options={options} />
    </>
  );
}
