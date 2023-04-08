import React, { useEffect, useState } from 'react';
import { Chart, ArcElement } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { apiURL } from '../../../../contexts/constants';
import moment from 'moment';

Chart.register(ArcElement);

export default function TotalOrderPieChart() {
  // get month of year
  // calendar
  const [calendar, setCalendar] = useState([]);
  const [dat, setDat] = useState(moment());

  var yearStart = dat.clone().startOf('year');
  var yearEnd = dat.clone().endOf('year');

  useEffect(() => {
    const yearMonths = [];
    let month = yearStart.clone();
    while (month.isSameOrBefore(yearEnd)) {
      yearMonths.push(month.clone());
      month.add(1, 'month');
    }

    const parsedData = yearMonths.map((month) => month.format('MM/YYYY'));
    setCalendar(parsedData);
  }, [dat]);

  // Setup data
  const [monthlySale, setMonthlySale] = useState([]);

  const labels = monthlySale?.map((item) => item.month);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total per month',
        data: monthlySale?.map((item) => item.count),

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
          const yearMonths = calendar
            .filter((month) =>
              moment(month, 'MM/YYYY').isBetween(
                yearStart,
                yearEnd,
                null,
                '[]',
              ),
            )
            .map((month) => ({ month, count: 0 }));

          const monthlySaleCopy = [...monthlySale];

          res.data.bills.forEach((bill) => {
            const billDate = moment(bill.createAt).format('MM/YYYY');

            const monthSale = yearMonths.find(
              (month) => month.month === billDate,
            );

            if (monthSale) {
              monthSale.count += 1;
            }
          });

          const updatedMonthlySale = yearMonths.map(
            (month) =>
              monthlySaleCopy.find((sale) => sale.month === month.month) ||
              month,
          );

          setMonthlySale(updatedMonthlySale);
        })
        .catch((err) => console.log(err));
    };

    billFetch();
  }, [calendar, dat]);

  return <Pie data={data} />;
}
