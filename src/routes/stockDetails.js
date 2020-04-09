import React, { useState, Fragment } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Container, Col, Row, Card, CardBody, Tooltip } from 'shards-react';
import { useQuery } from 'react-query';
import { ReactComponent as CheckMark } from '../assets/check-circle.svg';
import { ReactComponent as XMark } from '../assets/x-circle.svg';
import { ReactComponent as Info } from '../assets/info.svg';
import { fetchStockDetails, calculateIntrinsicValue } from '../services/financialModellingPrep';
import LineGraph from '../components/lineGraph';

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
  successIcon: {
    marginTop: 4,
    marginLeft: 10
  }
});

function SuccessIcon({ success }) {
  return success ? <CheckMark stroke='green' className={css(styles.successIcon)} /> : <XMark stroke='red' className={css(styles.successIcon)} />
}

function ValueItem({ value, id, subtitle, success, description }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  function toggleTooltip() {
    setIsTooltipOpen(prevState => !prevState);
  }

  return (
    <Col className='text-center'>
      <Row className='justify-content-center'>
        <h2 className='text-light'>
          {value}
        </h2>
        <SuccessIcon success={success} />
      </Row>

      <div id={id} className='text-light' >
        {subtitle} <Info width={14} height={14} />
      </div>

      <Tooltip
        target={'#' + id}
        placement="bottom"
        open={isTooltipOpen}
        toggle={toggleTooltip}
      >
        {description}
      </Tooltip>
    </Col>
  );
}


export default ({ match }) => {
  const [tickerSymbol] = useState(match.params.tickerSymbol);
  const stockDetails = useQuery(['stockDetails'], () => fetchStockDetails(tickerSymbol), {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  function onSelect(symbol) {
    // refresh the page so we don't have to deal with clearing state
    window.location.href = `${process.env.PUBLIC_URL || ''}/stock/${encodeURIComponent(symbol)}`;
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
          <h3 className='text-light mx-auto mt-4 text-center'>Loading...</h3>
        </Row>
      )}

      {!stockDetails.isLoading && stockDetails.error && (
        <Fragment>
          <Row>
            <Col>
              <h3 className='text-danger mx-auto mt-4 text-center'>Error</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className='text-danger text-center'>{stockDetails.error.message}</div>
            </Col>
          </Row>
        </Fragment>
      )}


      {!stockDetails.isLoading && stockDetails.data && (
        <Container>
          <Row className='mb-5 justify-content-center'>
            <Col sm='12' md='6' lg='6' className='mb-4'>
              <Row>
                <Col className='text-center'>
                  <h5 className='text-light'>Price</h5>
                </Col>
              </Row>
              <Row>
                <ValueItem  {...stockDetails.data.intrinsicPrice} />
                <ValueItem  {...stockDetails.data.currentPrice} />
              </Row>
              <Row className='mt-3'>
                <Col className='text-center'>
                  <h5 className='text-light'>Ratios</h5>
                </Col>
              </Row>
              <Row>
                <ValueItem  {...stockDetails.data.priceToEarningsRatio} />
                <ValueItem  {...stockDetails.data.priceToBookValueRatio} />
              </Row>
            </Col>
          </Row>

          {stockDetails.data.graphs.map(graph => <LineGraph
            key={graph.id}
            title={graph.title}
            datums={graph.values}
            description={graph.description}
            link={graph.link}
          />)}


          {/* <Row>
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
          </Row> */}

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
