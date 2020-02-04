import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';

const styles = StyleSheet.create({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    maxWidth: 400
  }
});

export default ({ history }) => {
  function onSelect(tickerSymbol) {
    history.push(`/stock/${tickerSymbol}`);
  }

  return (
    <div className={css(styles.root)}>
      <h1>
        <b>Intrinsic</b> Stock
      </h1>
      <p>find the intrinsic value of a stock</p>
      <TickerInput
        size="lg"
        placeholder="Find Stock"
        className={css(styles.input)}
        onSelect={onSelect}
      />
    </div>
  );
};
