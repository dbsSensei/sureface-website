import { Fragment, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContex from '../../context/auth-contex';

import './MainNavigation.css';

function MainNavigation(props: unknown) {
  return (
    <AuthContex.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              <h1>EasyEvent</h1>
            </div>
            <div className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {context.token && (
                  <Fragment>
                    <li>
                      <NavLink to="/bookings">Bookings</NavLink>
                    </li>
                    <li>
                      <button onClick={context.logout}>Logout</button>
                    </li>
                  </Fragment>
                )}
              </ul>
            </div>
          </header>
        );
      }}
    </AuthContex.Consumer>
  );
}

export default MainNavigation;
