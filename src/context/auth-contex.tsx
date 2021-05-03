/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { AuthContext } from '../types';

const contextParam: AuthContext = {
  token: '',
  userId: '',
  login: () => {},
  logout: () => {},
};

export default React.createContext(contextParam);
