import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import './Auth.css';
import AuthContext from '../context/auth-contex';
import { AuthType } from '../types';

function AuthPage(): JSX.Element {
  const context = useContext(AuthContext);

  useEffect(() => {
    console.log(context.token);
  }, [context.token]);

  const emailEl = useRef<HTMLInputElement>(null);
  const passwordEl = useRef<HTMLInputElement>(null);

  const [loginDisplay, setLoginDisplay] = useState(true);
  // const [password] = useState('');

  const switchModeHandler = () => {
    setLoginDisplay(!loginDisplay);
  };

  const submitHandler = async (e: any) => {
    try {
      const event: MouseEvent = e;
      event.preventDefault();

      const emailValue = emailEl.current && emailEl.current.value;
      const passwordValue = passwordEl.current && passwordEl.current.value;

      if (!emailValue || !passwordValue) {
        return;
      }

      let requestBody = {
        query: `
          query {
            login (email: "${emailValue}", password: "${passwordValue}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
      };

      if (!loginDisplay) {
        requestBody = {
          query: `
            mutation {
              createUser(userInput: {email: "${emailValue}", password: "${passwordValue}"}) {
                _id
                email
                password
              }
            }
          `,
        };
      }

      const response = await axios.post(
        'http://localhost:3001/graphql',
        requestBody,
      );

      if (response.data.errors) throw response.data.errors[0];

      const respondData =
        response.data.data[loginDisplay ? 'login' : 'createUser'];

      if (loginDisplay) {
        const auth: AuthType = respondData;
        context.login({
          token: auth.token,
          userId: auth.userId,
          tokenExpiration: auth.tokenExpiration,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={(e) => submitHandler(e)}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="button" onClick={switchModeHandler}>
          Switch to {loginDisplay ? 'Signup' : 'Login'}
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default AuthPage;
