import React, { useEffect, useState, Fragment } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Container, Col, Row, Card, CardBody } from 'shards-react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as Checkmark } from '../assets/check-circle.svg';
import { ReactComponent as XMark } from '../assets/x-circle.svg';
import { ReactComponent as TrendingDown } from '../assets/trending-down.svg';
import { ReactComponent as TrendingUp } from '../assets/trending-up.svg';

import stockDetailsSlice from '../store/stockDetailsSlice';

const styles = StyleSheet.create({
  root: {
    padding: 40
    // textAlign: 'center',
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center'
  },
  input: {
    textTransform: 'uppercase',
    maxWidth: 400,
    marginBottom: 30
  },
  summaryIcon: {
    marginRight: 10
  }
});

function TrendingIcon({ isTrendingUpwards }) {
  return isTrendingUpwards ? <TrendingUp stroke='green' className={css(styles.summaryIcon)} /> : <TrendingDown
    className={css(styles.summaryIcon)}
    stroke='red' />
}

function SuccessIcon({ success }) {
  return success ? <Checkmark stroke='green' className={css(styles.summaryIcon)} /> : <XMark stroke='red' className={css(styles.summaryIcon)} />
}


export default ({ match }) => {
  const [tickerSymbol] = useState(match.params.tickerSymbol);
  const stockDetails = useSelector(state => state.stockDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(stockDetailsSlice.actions.loading());
    dispatch(stockDetailsSlice.actions.fetch(match.params.tickerSymbol));
  }, [dispatch, match.params.tickerSymbol]);

  function onSelect(symbol) {
    // refresh the page so we don't have to deal with clearning state
    window.location.href = `${process.env.PUBLIC_URL || ''}/stock/${encodeURIComponent(symbol)}`;
  }

  return (
    <Container className={css(styles.root)}>
      <h1>
        <b>Intrinsic</b> Stock
      </h1>
      <TickerInput
        className={css(styles.input)}
        onSelect={onSelect}
        intialText={tickerSymbol}
      />

      {stockDetails.loading && (
        <Row>
          <h3>Loading...</h3>
        </Row>
      )}

      {stockDetails.error && (
        <Fragment>
          <Row>
            <h3>Errror</h3>
          </Row>
          <Row>
            <div>{stockDetails.error}</div>
          </Row>
        </Fragment>
      )}


      {stockDetails.data && (
        <Container>
          <Row className='mb-5'>
            <Col sm='12' md='6' lg='6' className='mb-4'>
              <Row>
                <Col className='text-center'>
                  <h5>Price</h5>
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <h2>
                    ${stockDetails.data.intrinsicPrice}
                  </h2>

                  <div >
                    intrinsic price
                  </div>
                </Col>
                <Col className='text-center'>
                  <h2>
                    ${stockDetails.data.currentPrice}
                  </h2>
                  <div>
                    current price
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <h5>Ratios</h5>
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <h2>{stockDetails.data.priceToEarningsRatio}</h2>
                  <div>P/E Ratio</div>
                </Col>
                <Col className='text-center'>
                  <h2>{stockDetails.data.priceToBookValueRatio}</h2>
                  <div>P/BV Ratio</div>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col className='text-center'>
                  <h5>Summary</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.isIntrinsicPriceLessThanCurrentPrice} />
                  <span>{'instrinsic price < current price'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.isPriceToEarningsRatioFair} />
                  <span>{'P/E Ratio < 15'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.isPriceToBookValueRatioFair} />
                  <span>{'P/BV Ratio < 1.5'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TrendingIcon isTrendingUpwards={stockDetails.data.isDividendTrendingUpwards} />
                  <span>{'Dividend per Share'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TrendingIcon isTrendingUpwards={stockDetails.data.isBookValueTrendingUpwards} />
                  <span>{'Book Value'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TrendingIcon isTrendingUpwards={stockDetails.data.isEarningsTrendingUpwards} />
                  <span>{'Earnings per Share'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TrendingIcon isTrendingUpwards={stockDetails.data.isDebtTrendingDownwards} />
                  <span>{'Debt/Equity Ratio'}</span>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card small className="mb-4">
                <CardBody className="p-0 pb-3">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col" className="border-0">Year</th>
                        <th scope="col" className="border-0">Earnings per Share</th>
                        <th scope="col" className="border-0">Book Value</th>
                        <th scope="col" className="border-0">Dividend per Share</th>
                        <th scope="col" className="border-0">Debt/Equity Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockDetails.data.listByYears.map(row => (
                        <tr key={row.date}>
                          <td>{new Date(row.date).getFullYear()}</td>
                          <td>{row.earningsPerShare.toFixed(1)}</td>
                          <td>{row.bookValue.toFixed(1)}</td>
                          <td>{row.dividend.toFixed(1)}</td>
                          <td>{row.debtToEquityRatio.toFixed(1)}</td>
                        </tr>
                      ))}

                      {/* <tr>
                        <td>1</td>
                        <td>Ali</td>
                        <td>Kerry</td>
                        <td>Russian Federation</td>
                        <td>Gdańsk</td>
                        <td>107-0339</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Clark</td>
                        <td>Angela</td>
                        <td>Estonia</td>
                        <td>Borghetto di Vara</td>
                        <td>1-660-850-1647</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Jerry</td>
                        <td>Nathan</td>
                        <td>Cyprus</td>
                        <td>Braunau am Inn</td>
                        <td>214-4225</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Colt</td>
                        <td>Angela</td>
                        <td>Liberia</td>
                        <td>Bad Hersfeld</td>
                        <td>1-848-473-7416</td>
                      </tr> */}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
};
