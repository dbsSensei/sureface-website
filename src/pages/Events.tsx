import { Fragment, useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';

import './Events.css';
import authContex from '../context/auth-context';
import { EventType, AxiosResponse } from '../types';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner';

function EventsPage(): JSX.Element {
  const context = useContext(authContex);

  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvents] = useState<EventType | null>(
    events[0],
  );
  const [isLoading, setIsLoading] = useState(false);

  const titleElRef = useRef<HTMLInputElement>(null);
  const priceElRef = useRef<HTMLInputElement>(null);
  const dateElRef = useRef<HTMLInputElement>(null);
  const descriptionElRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const requestBody = {
      query: `
            query{
              events{
                _id
                title
                description
                price
                date
                creator{
                  _id
                  email
                }
              }
            }
          `,
    };

    axios
      .post('http://localhost:3001/graphql', requestBody)
      .then((response: AxiosResponse<EventType[]>): any => {
        const eventsData = response.data;
        if (eventsData.errors) throw eventsData.errors[0];

        console.log(eventsData.data.events);
        if (eventsData) {
          setEvents(eventsData.data.events);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  const modalConfirmHandler = async (e: any) => {
    try {
      setIsLoading(true);
      const event: MouseEvent = e;
      event.preventDefault();
      setCreating(false);

      const title = titleElRef.current?.value;
      let price: string | number | undefined = priceElRef.current?.value;
      const date = dateElRef.current?.value;
      const description = descriptionElRef.current?.value;

      price = typeof price === 'string' ? parseFloat(price) : 0;

      if (
        title?.trim().length === 0 ||
        date?.trim().length === 0 ||
        price < 0.01 ||
        title?.trim().length === 0 ||
        description?.trim().length === 0
      ) {
        return;
      }

      const token = context.token;

      // const event = { title, price, date, description };

      const requestBody = {
        query: `
          mutation {
            createEvent(eventInput: {
              title: "${title}", 
              description: "${description}", 
              price: ${price}, 
              date: "${date}", 
              creator: "${context.userId}"}) {
                _id
                title
                description
                price
                date
                creator {
                  _id
                  email
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

      const response: AxiosResponse<EventType> = await axios.post(
        'http://localhost:3001/graphql',
        requestBody,
        config,
      );

      if (response.data.errors) throw response.data.errors[0];

      const eventData = response.data.data.createEvent;
      console.log(eventData);
      setEvents([...events, eventData]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvents(null);
  };

  const bookEventHandler = async (e: any) => {
    try {
      const event: MouseEvent = e;
      event.preventDefault();

      const token = context.token;
      if (!token) return modalCancelHandler();

      if (!selectedEvent) throw new Error('Event is not found');

      const requestBody = {
        query: `
          mutation {
            bookEvent(eventId:"${selectedEvent._id}"){
              _id
              createdAt
              updatedAt
            }
          }           
          `,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: AxiosResponse<EventType> = await axios.post(
        'http://localhost:3001/graphql',
        requestBody,
        config,
      );

      if (response.data.errors) throw response.data.errors[0];

      console.log(response);
      // const eventData = response.data.data.createEvent;
      // console.log(eventData);
      // setEvents([...events, eventData]);
      // setIsLoading(false);
      modalCancelHandler();
    } catch (err) {
      console.log(err);
    }
  };

  const onDetailHandler = (eventId: string) => {
    const selectedEvent = events.find((event) => event._id === eventId);
    selectedEvent && setSelectedEvents(selectedEvent);
    return { selectedEvent };
  };

  const formatedDate = selectedEvent && new Date(selectedEvent.date);

  return (
    <Fragment>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          selectedEvent={selectedEvent}
          onConfirm={(e: any) => modalConfirmHandler(e)}
          onCancel={modalCancelHandler}
          userId={context.userId}
          canConfirm
          canCancel
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" ref={dateElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows={4} ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          onConfirm={(e) => bookEventHandler(e)}
          onCancel={modalCancelHandler}
          selectedEvent={selectedEvent}
          userId={context.userId}
          canConfirm
          canCancel
        >
          <Fragment>
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{' '}
              {formatedDate?.toUTCString().split(' ')[4].slice(0, 5)}{' '}
              {formatedDate?.toLocaleDateString('id')}
            </h2>{' '}
            <p>This is a test</p>
          </Fragment>
        </Modal>
      )}
      {context.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          userId={context.userId}
          onDetail={onDetailHandler}
        />
      )}
    </Fragment>
  );
}

export default EventsPage;
