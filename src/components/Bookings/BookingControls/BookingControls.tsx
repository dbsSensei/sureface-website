import './BookingControls.css';

const BookingControls = (props: {
  outputType: 'list' | 'chart';
  changeOutputTypeHandler: (outputTypeParam: string) => void;
}): JSX.Element => {
  return (
    <div className="booking-controls">
      <button
        className={props.outputType === 'list' ? 'active' : ''}
        onClick={() => props.changeOutputTypeHandler('list')}
      >
        List
      </button>
      <button
        className={props.outputType === 'chart' ? 'active' : ''}
        onClick={() => props.changeOutputTypeHandler('chart')}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingControls;
