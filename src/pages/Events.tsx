import { Fragment, useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import './Events.css';
import authContex from '../context/auth-contex';
import { EventType, AxiosResponse } from '../types';

function EventsPage(): JSX.Element {
  const context = useContext(authContex);

  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);

  const titleElRef = useRef<HTMLInputElement>(null);
  const priceElRef = useRef<HTMLInputElement>(null);
  const dateElRef = useRef<HTMLInputElement>(null);
  const descriptionElRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const modalConfirmHandler = async () => {
    try {
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
                price: ${price}
                date: "${date}"
              }) {
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

      const response: AxiosResponse<EventType> = await axios.post(
        'http://localhost:3001/graphql',
        requestBody,
        config,
      );

      if (response.data.errors) throw response.data.errors[0];

      const event = response.data.data.createEvent;
      console.log(event);
      setEvents([...events, event]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          onConfirm={modalConfirmHandler}
          onCancel={() => setCreating(false)}
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
      {context.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events__list">
        {events.map((event) => (
          <li className="events__list-item" key={event._id}>
            {event.title}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default EventsPage;
