import { EventType } from '../../../types';

import './EventItem.css';

const EventItem = (props: {
  event: EventType;
  userId: string;
  onDetail: (eventId: any) => void;
}): JSX.Element => {
  const { _id, title, price, date, creator } = props.event;

  const formatedDate = new Date(date);

  return (
    <li className="events__list-item">
      <div>
        <h1>{title}</h1>
        <h2>
          ${price} - {formatedDate.toUTCString().split(' ')[4].slice(0, 5)}{' '}
          {formatedDate.toLocaleDateString('id')}
        </h2>
      </div>
      <div>
        {props.userId === creator?._id ? (
          <p>Your the owner of this event.</p>
        ) : (
          <button className="btn" onClick={() => props.onDetail(_id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
