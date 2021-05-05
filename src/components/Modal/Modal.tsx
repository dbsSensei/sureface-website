import { EventType } from '../../types';
import './Modal.css';

type ModalProps = {
  title: string;
  children: JSX.Element;
  selectedEvent: EventType | null;
  userId: string;
  onConfirm: (e?: any) => void;
  onCancel: (e?: any) => void;
  canConfirm: boolean;
  canCancel: boolean;
};

const Modal = (props: ModalProps): JSX.Element => {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{props.title}</h1>
      </header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canCancel && (
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button className="btn" onClick={props.onConfirm}>
            {props.selectedEvent && props.userId ? 'Booking' : 'Confirm'}
          </button>
        )}
      </section>
    </div>
  );
};

export default Modal;
