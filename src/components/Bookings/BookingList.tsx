import { BookingType } from '../../types';
import BookingItem from './BookingItem/BookingItem';

import './BookingList.css';

const BookingList = (props: {
  bookings: BookingType[];
  onCancelBooking: (eventId:string) => void;
}): JSX.Element => {
  return (
    <ul className="bookings__list">
      {props.bookings.map((booking) => {
        return (
          <BookingItem
            key={booking._id}
            booking={booking}
            onCancelBooking={props.onCancelBooking}
          />
        );
      })}
    </ul>
  );
};

export default BookingList;
