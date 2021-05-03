import { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-contex';

import './App.css';
import { AuthType } from './types';

const initialState: AuthType = {
  token: '',
  userId: '',
  tokenExpiration: 0,
};

function App(): JSX.Element {
  const [state, setState] = useState(initialState);

  const login = ({ token, userId, tokenExpiration }: AuthType) => {
    setState({ ...state, token, userId, tokenExpiration });
  };

  const logout = () => {
    setState({ ...state, token: '', userId: '', tokenExpiration: 0 });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ ...state, login, logout }}>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {/* No Auth */}
            {!state.token && <Redirect path="/" to="/auth" exact />}
            {!state.token && <Redirect path="/bookings" to="/auth" exact />}
            
            {/* Login User */}
            {state.token && <Redirect path="/" to="/events" exact />}
            {state.token && <Redirect path="/auth" to="/events" />}

            {/* Routes */}
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
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
