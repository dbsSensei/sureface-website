import { useEffect, useState, useContext, Fragment } from 'react';
import axios from 'axios';

import authContext from '../context/auth-context';
import { AxiosResponse, BookingType } from '../types';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';

function BookingsPage(): any {
  const context = useContext(authContext);

  const token = context.token;

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [outputType, setOutputType] = useState<'list' | 'chart'>('list');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings{
            _id
            createdAt
            updatedAt
            event {
              _id
              title
              price
            }
          }
        }
          `,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post('http://localhost:3001/graphql', requestBody, config)
      .then((response: AxiosResponse<BookingType[]>): any => {
        const bookings = response.data;

        if (bookings.errors) throw bookings.errors[0];
        if (!bookings.data.bookings) throw new Error('Something went Wrong');

        setBookings(bookings.data.bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  const onCancelBooking = (bookingId: string) => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }      
          `,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post('http://localhost:3001/graphql', requestBody, config)
      .then((response: AxiosResponse<BookingType[]>): any => {
        const fetchBookings = response.data;

        if (fetchBookings.errors) throw fetchBookings.errors[0];

        const bookingsAfterCancel = bookings.filter(
          (booking) => booking._id !== bookingId,
        );

        setBookings(bookingsAfterCancel);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const changeOutputTypeHandler = (outputTypeParam: string) => {
    if (outputTypeParam === 'list') {
      setOutputType('list');
    } else if (outputTypeParam === 'chart') {
      setOutputType('chart');
    }
  };

  let content = <Spinner />;

  if (!isLoading) {
    content = (
      <Fragment>
        <BookingControls
          outputType={outputType}
          changeOutputTypeHandler={changeOutputTypeHandler}
        />
        <div>
          {outputType === 'chart' ? (
            <BookingChart bookings={bookings} />
          ) : (
            <BookingList
              bookings={bookings}
              onCancelBooking={onCancelBooking}
            />
          )}
        </div>
      </Fragment>
    );
  }

  return <Fragment>{content}</Fragment>;
}

export default BookingsPage;
