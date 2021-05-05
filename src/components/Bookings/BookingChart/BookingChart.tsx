import { Bar as BarChart } from 'react-chartjs-2';
import { BookingType } from '../../../types';

import './BookingChart.css';

const BOOKINGS_BUCKETS: any = {
  Cheap: { min: 0, max: 100 },
  Normal: { min: 101, max: 200 },
  Expensive: { min: 201, max: 100000 },
};

const BookingChart = (props: { bookings: BookingType[] }): JSX.Element => {
  const chartData: any = { labels: [], datasets: [] };
  let values: any = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: [''],
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: values,
    });
    console.log(values);
    values = [...values];
    values[values.length - 1] = 0;
  }
  console.log(chartData);
  return (
    <div className="barchart">
      <BarChart type="bar" data={chartData} />
    </div>
  );
};

export default BookingChart;
