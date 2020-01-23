import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { FormInput } from 'shards-react';

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
  function onKeyDown(event) {
    // enter was pressed
    if (event.keyCode === 13) {
      history.replace(`/stock/${event.target.value}`);
    }
  }

  return (
    <div className={css(styles.root)}>
      <h1>
        <b>Intrinsic</b> Stock
      </h1>
      <p>find the intrinsic value of a stock</p>
      <FormInput
        size="lg"
        placeholder="Find Stock"
        className={css(styles.input)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
