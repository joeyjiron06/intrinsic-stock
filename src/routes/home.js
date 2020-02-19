import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Row, Col, Container } from 'shards-react';

const styles = StyleSheet.create({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  inputRow: {
    width: '100%'
  }
});

export default ({ history }) => {
  function onSelect(tickerSymbol) {
    history.push(`/stock/${tickerSymbol}`);
  }

  return (
    <Container className={css(styles.root)}>
      <Row>
        <Col>
          <h1 className='text-light'>
            <b>Intrinsic</b> Stock
          </h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>find the intrinsic value of a stock</p>
        </Col>
      </Row>

      <Row className={css(styles.inputRow)}>
        <Col>
          <TickerInput
            size="lg"
            placeholder="Find Stock"
            onSelect={onSelect}
          />
        </Col>
      </Row>
    </Container>
  );
};
