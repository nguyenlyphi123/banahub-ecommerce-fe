import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import { Chart, LineElement } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { apiURL } from '../../../../contexts/constants';
import moment from 'moment';

Chart.register(LineElement);

export default function DailySaleLineChart() {
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

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Daily revenue',
        data: dailySale?.map((item) => item.revenue),

        backgroundColor: [
          '#F9C5D1',
          '#E6E6FA',
          '#87CEEB',
          '#98FF98',
          '#FFE5B4',
          '#FFF8DC',
          '#C8A2C8',
          '#AFEEEE',
          '#F08080',
          '#B0E0E6',
          '#FFFACD',
          '#FFDAB9',
        ],
        borderColor: [
          '#F9C5D1',
          '#E6E6FA',
          '#87CEEB',
          '#98FF98',
          '#FFE5B4',
          '#FFF8DC',
          '#C8A2C8',
          '#AFEEEE',
          '#F08080',
          '#B0E0E6',
          '#FFFACD',
          '#FFDAB9',
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
            .map((date) => ({ date, revenue: 0 }));

          const dailySaleCopy = [...dailySale];

          res.data.bills.forEach((bill) => {
            const billDate = moment(bill.createAt).format('DD/MM/YYYY');

            const daySale = weekDates.find((day) => day.date === billDate);

            if (daySale) {
              daySale.revenue += bill.last_cost;
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
  }, [calendar, dat]);

  const countInvoicesPerDay = (date, datasets) => {
    let value = 0;
    datasets.map((item) => {
      if (Moment(item.createAt).format('DD-MM-YYYY').includes(date)) value++;
    });
    return value;
  };

  return <Line data={data} options={options} />;
}
