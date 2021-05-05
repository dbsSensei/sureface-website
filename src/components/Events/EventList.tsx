import EventItem from './EventItem/EventItem';
import { EventType } from '../../types/';

import './EventList.css';

const EventList = (props: {
  events: EventType[];
  userId: string;
  onDetail: (eventId: any) => void;
}): JSX.Element => {
  return (
    <ul className="event__list">
      {props.events.map((event) => (
        <EventItem
          key={event._id}
          event={event}
          userId={props.userId}
          onDetail={props.onDetail}
        />
      ))}
    </ul>
  );
};

export default EventList;
