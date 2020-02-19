import React from 'react';
import Routes from './routes';
import { ReactQueryConfigProvider } from 'react-query';
import { StyleSheet, css } from 'aphrodite/no-important';
import './index.css';

const styles = StyleSheet.create({
  root: {
    minHeight: '100vh'
  },
});


const ReactQueryConfig = {
  refetchAllOnWindowFocus: false
};

export default () => (
  <div className={css(styles.root) + " bg-dark text-light"}>
    <ReactQueryConfigProvider config={ReactQueryConfig}>
      <Routes />
    </ReactQueryConfigProvider>
  </div>
);
