import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

import './App.css';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect path="/" to="/auth" exact />
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/events">
          <EventsPage />
        </Route>
        <Route path="/bookings">
          <BookingsPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
