import React, { useEffect, useState, Fragment } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Container, Col, Row, Card, CardBody, Tooltip } from 'shards-react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as Checkmark } from '../assets/check-circle.svg';
import { ReactComponent as XMark } from '../assets/x-circle.svg';
import { ReactComponent as TrendingDown } from '../assets/trending-down.svg';
import { ReactComponent as TrendingUp } from '../assets/trending-up.svg';
import { ReactComponent as Info } from '../assets/info.svg';

import stockDetailsSlice from '../store/stockDetailsSlice';

const styles = StyleSheet.create({
  root: {
    padding: 40
  },
  input: {
    display: 'block',
    margin: 'auto'
  },
  tickerInput: {
    margin: 'auto'
  },

  summaryIcon: {
    marginRight: 10
  }
});

function TrendingIcon({ isTrendingUpwards, colors = ['green', 'red'] }) {
  return isTrendingUpwards ? <TrendingUp stroke={colors[0]} className={css(styles.summaryIcon)} /> : <TrendingDown
    className={css(styles.summaryIcon)}
    stroke={colors[1]} />
}

function SuccessIcon({ success }) {
  return success ? <Checkmark stroke='green' className={css(styles.summaryIcon)} /> : <XMark stroke='red' className={css(styles.summaryIcon)} />
}


export default ({ match }) => {
  const [tickerSymbol] = useState(match.params.tickerSymbol);
  const stockDetails = useSelector(state => state.stockDetails);
  const dispatch = useDispatch();
  const [toolTips, setToolTips] = useState({
    instrinsicPrice: false,
    priceToEarningsRatio: false,
    bookValueRatio: false,
    debtToEquityRatio: false,
  });

  useEffect(() => {
    dispatch(stockDetailsSlice.actions.loading());
    dispatch(stockDetailsSlice.actions.fetch(match.params.tickerSymbol));
  }, [dispatch, match.params.tickerSymbol]);

  function onSelect(symbol) {
    // refresh the page so we don't have to deal with clearning state
    window.location.href = `${process.env.PUBLIC_URL || ''}/stock/${encodeURIComponent(symbol)}`;
  }

  function toggleToolTip(name) {
    return () => {
      setToolTips(prevState => ({
        ...prevState,
        [name]: !prevState[name]
      }));
    }
  }

  return (
    <Container className={css(styles.root)}>
      <Row>
        <Col className='text-center'>
          <h1>
            <b>Intrinsic</b> Stock
          </h1>
        </Col>
      </Row>

      <Row>
        <Col className={css(styles.tickerInput)}>
          <TickerInput
            styles={styles.input}
            onSelect={onSelect}
            intialText={tickerSymbol}
          />
          {stockDetails.data &&
            <Row>
              <Col className='text-center'>
                <a href={stockDetails.data.companyWebsite} target='_blank' rel='noopener noreferrer' ><p>{stockDetails.data.companyName}</p></a>
              </Col>
            </Row>
          }
        </Col>
      </Row>




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

                  <div id='instrinsicPrice' >
                    intrinsic price <Info width={14} height={14} />
                  </div>

                  <Tooltip
                    target="#instrinsicPrice"
                    placement="bottom"
                    open={toolTips.instrinsicPrice}
                    toggle={toggleToolTip('instrinsicPrice')}
                  >
                    Instrinsic price is the calculated price based on Warren Buffet's intrinsic value definition. Check out the links at the bottom of the page for more info.
                  </Tooltip>
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
              <Row className='mt-3'>
                <Col className='text-center'>
                  <h5>Ratios</h5>
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <h2>{stockDetails.data.priceToEarningsRatio.toFixed(1)}</h2>
                  <div id='priceToEarningsRatio'>P/E Ratio <Info width={14} height={14} /></div>
                  <Tooltip
                    target="#priceToEarningsRatio"
                    placement="bottom"
                    open={toolTips.priceToEarningsRatio}
                    toggle={toggleToolTip('priceToEarningsRatio')}
                  >
                    {stockDetails.data.priceToEarningsRatio < 15 ? 'The price to earnings ratio is below the Warrent Buffet recommenedation of 15.' : 'The price to earnings ratio is above the Warrent Buffet recommenedation of 15'}
                  </Tooltip>
                </Col>
                <Col className='text-center'>
                  <h2>{stockDetails.data.priceToBookValueRatio.toFixed(1)}</h2>
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
                  <TrendingIcon isTrendingUpwards={!stockDetails.data.isDebtTrendingDownwards}
                    colors={['red', 'green']}
                  />
                  <span id='debtToEquityRatio'>{'Debt/Equity Ratio'}</span>

                  {!stockDetails.data.isDebtTrendingDownwards && <Tooltip
                    target="#debtToEquityRatio"
                    placement="bottom"
                    open={toolTips.debtToEquityRatio}
                    toggle={toggleToolTip('debtToEquityRatio')}
                  >
                    {'Debt is increasing which may be a sign that this company is not managed well. See Debt/Equity ratio table below for more info.'}
                  </Tooltip>}

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
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col >
              <h5 >Links</h5>
            </Col>
          </Row>

          <Row>
            <Col>
              <Row>
                <a href='https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-21/' target='_blank' rel='noopener noreferrer' >Instrinic value calculator</a>
              </Row>

              <Row>
                <a href='https://financialmodelingprep.com/developer/docs/' target='_blank' rel='noopener noreferrer' >Data providied by financialmodelingprep</a>
              </Row>

            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
};
