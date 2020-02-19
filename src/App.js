import React from 'react';
import Routes from './routes';
import { ReactQueryConfigProvider } from 'react-query';

const ReactQueryConfig = {
  refetchAllOnWindowFocus: false
};

export default () => (
  <div className="App bg-dark text-light">
    <ReactQueryConfigProvider config={ReactQueryConfig}>
      <Routes />
    </ReactQueryConfigProvider>
  </div>
);
