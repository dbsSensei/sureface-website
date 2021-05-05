import { BookingType } from '../../../types';

const BookingItem = (props: {
  booking: BookingType;
  onCancelBooking: (eventId: string) => void;
}): JSX.Element => {
  return (
    <li className="bookings__item">
      <div className="bookings__item-data">
        {props.booking.event.title} - ${props.booking.event.price} - 
        {' '}{new Date(props.booking.createdAt).toLocaleDateString()}
      </div>
      <div className="bookings__item-actions">
        <button
          className="btn"
          onClick={() => props.onCancelBooking(props.booking._id)}
        >
          Cancel
        </button>
      </div>
    </li>
  );
};

export default BookingItem;
