import React, { useState, Fragment } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Container, Col, Row, Card, CardBody, Tooltip } from 'shards-react';
import { useQuery } from 'react-query';
import { ReactComponent as Checkmark } from '../assets/check-circle.svg';
import { ReactComponent as XMark } from '../assets/x-circle.svg';
import { ReactComponent as Info } from '../assets/info.svg';
import { fetchStockDetails, calculateIntrinsicValue } from '../services/financialModellingPrep';

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
  table: {
    overflowX: 'auto'
  },
  summaryIcon: {
    marginRight: 10
  }
});

function SuccessIcon({ success }) {
  return success ? <Checkmark stroke='green' className={css(styles.summaryIcon)} /> : <XMark stroke='red' className={css(styles.summaryIcon)} />
}


export default ({ match }) => {
  const [tickerSymbol] = useState(match.params.tickerSymbol);
  const [bookValueIndex, setBookValueIndex] = useState(0);
  const stockDetails = useQuery(['stockDetails', { tickerSymbol }], () => fetchStockDetails(tickerSymbol));

  const [toolTips, setToolTips] = useState({
    instrinsicPrice: false,
    priceToEarningsRatio: false,
    bookValueRatio: false,
    debtToEquityRatio: false,
  });

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
          <h1 className='text-light'>
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

      {stockDetails.isLoading && (
        <Row>
          <h3 className='text-light'>Loading...</h3>
        </Row>
      )}

      {!stockDetails.isLoading && stockDetails.error && (
        <Fragment>
          <Row>
            <h3 className='text-light'>Errror</h3>
          </Row>
          <Row>
            <div className='text-light'>{stockDetails.error.toString()}</div>
          </Row>
        </Fragment>
      )}


      {!stockDetails.isLoading && stockDetails.data && (
        <Container>
          <Row className='mb-5'>
            <Col sm='12' md='6' lg='6' className='mb-4'>
              <Row>
                <Col className='text-center'>
                  <h5 className='text-light'>Price</h5>
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <h2 className='text-light'>
                    ${stockDetails.data.intrinsicPrice.toFixed(2)}
                  </h2>

                  <div id='instrinsicPrice' className='text-light' >
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
                  <h2 className='text-light'>
                    ${stockDetails.data.currentPrice.toFixed(2)}
                  </h2>
                  <div className='text-light'>
                    current price
                  </div>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col className='text-center'>
                  <h5 className='text-light'>Ratios</h5>
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <h2 className='text-light'>{stockDetails.data.priceToEarningsRatio.toFixed(1)}</h2>
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
                  <h2 className='text-light'>{stockDetails.data.priceToBookValueRatio.toFixed(1)}</h2>
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
                  <span>{'current price < instrinsic price'}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.isPriceToEarningsRatioFair} />
                  <span id='peRatio'>{'P/E Ratio < 15'}</span>
                  {!stockDetails.data.isPriceToEarningsRatioFair && <Tooltip
                    target="#peRatio"
                    placement="bottom"
                    open={toolTips.peRatio}
                    toggle={toggleToolTip('peRatio')}
                  >
                    {'Warren Buffet likes to invest in companies that he can buy at a discount. This company\'s price to earnings raio indicates that it is not a discount.'}
                  </Tooltip>}
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.isPriceToBookValueRatioFair} />
                  <span id='pbvRatio'>{'P/BV Ratio < 1.5'}</span>

                  {!stockDetails.data.isPriceToBookValueRatioFair && <Tooltip
                    target="#pbvRatio"
                    placement="bottom"
                    open={toolTips.pbvRatio}
                    toggle={toggleToolTip('pbvRatio')}
                  >
                    {'Warren Buffet likes to invest in companies that he can buy at a discount. This company\'s price to book value raio indicates that it is not a discount.'}
                  </Tooltip>}
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.dividendTrend === 'up'} />
                  <span id='dividendPerShare'>{'Dividend per Share trending up'}</span>

                  {stockDetails.data.dividendTrend !== 'up' && <Tooltip
                    target="#dividendPerShare"
                    placement="bottom"
                    open={toolTips.dividendPerShare}
                    toggle={toggleToolTip('dividendPerShare')}
                  >
                    {stockDetails.data.dividendTrend === 'down' ? 'Dividends are trending downwards. Warren Buffet likes to invest in companys where dividends are increasing year over year.' : 'Dividends are flat. This means that that this company is not increasing dividend payments.'}
                  </Tooltip>}

                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.bookValueTrend === 'up'} />
                  <span id='bookValue'>{'Book Value trending up'}</span>

                  {stockDetails.data.bookValueTrend !== 'up' && <Tooltip
                    target="#bookValue"
                    placement="bottom"
                    open={toolTips.bookValue}
                    toggle={toggleToolTip('bookValue')}
                  >
                    {stockDetails.data.bookValueTrend === 'down' ? 'Earnings is trending downwards. Warren Buffet looks for promising companies who\'s shares are increasing. This alone is a reason not to invest in this company.' : 'Earnings values are flat over the years. It is recommended that earnings increase as it shows a promising profitablity.'}
                  </Tooltip>}
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.earningsTrend === 'up'} />
                  <span id='earningsPerShare'>{'Earnings per Share trending up'}</span>
                  {stockDetails.data.earningsTrend === 'down' && <Tooltip
                    target="#earningsPerShare"
                    placement="bottom"
                    open={toolTips.earningsPerShare}
                    toggle={toggleToolTip('earningsPerShare')}
                  >
                    {'Earnings is trending downwards. Warren Buffet looks for promising companies who\'s shares are increasing. This alone is a reason not to invest in this company.'}
                  </Tooltip>}
                </Col>
              </Row>
              <Row>
                <Col>
                  <SuccessIcon success={stockDetails.data.debtToEquityTrend === 'down'} />
                  <span id='debtToEquityRatio'>{'Debt/Equity Ratio trending down'}</span>
                  {stockDetails.data.debtToEquityTrend !== 'down' && <Tooltip
                    target="#debtToEquityRatio"
                    placement="bottom"
                    open={toolTips.debtToEquityRatio}
                    toggle={toggleToolTip('debtToEquityRatio')}
                  >
                    {stockDetails.data.debtToEquityTrend === 'up' ? 'Debt is increasing which may be a sign that this company is not managed well. See Debt/Equity ratio table below for more info.' : 'Debt to equity ratio is flat. This could mean that the company is not increasing their debt, or there is not enough data in the system to determine debt to equity ratio. In any case, use the links below to find more details about the debt of the company.'}
                  </Tooltip>}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card small className="mb-4 overflow-hidden">
                <CardBody className={css(styles.table) + " p-0 pb-3 bg-dark"}>
                  <table className="table table-dark mb-0">
                    <thead className='thead-dark'>
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
                <Col>
                  <a href='https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-21/' target='_blank' rel='noopener noreferrer' >Instrinic value calculator</a>
                </Col>
              </Row>

              <Row>
                <Col>
                  <a href='https://financialmodelingprep.com/developer/docs/' target='_blank' rel='noopener noreferrer' >Data providied by financialmodelingprep</a>
                </Col>
              </Row>

            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
};
