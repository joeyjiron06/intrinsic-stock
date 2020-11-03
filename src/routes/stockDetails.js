import React, { useState, Fragment } from 'react';
import { useParams } from "react-router-dom";
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Container, Col, Row, Tooltip } from 'shards-react';
import { useQuery } from 'react-query';
import { useId } from "react-id-generator";
import { ReactComponent as Checkmark } from '../assets/check-circle.svg';
import { ReactComponent as XMark } from '../assets/x-circle.svg';
import { ReactComponent as Info } from '../assets/info.svg';
import { fetchStockDetails } from '../services/financialModellingPrep';
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
  summaryIcon: {
    marginRight: 10
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  charts: {
    display:'flex',
    flexDirection: 'row',
    '@media (max-width: 990px)': {
      flexDirection: 'column'
    }
  },
  chart: {
    flexBasis: '50%',
    display:'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

function PriceText({title, subtitle, success, info}) {
  const [isTooltopShowing, setIsTooltipShowing] = useState(false)
  const [id] = useId();


  function toggleToolTip() {
    setIsTooltipShowing(prevValue => !prevValue);
  }

  return (
    <Col className='text-center mb-4'>
      <div className={css(styles.priceContainer)}>
        <h2 className='text-light mr-3 mb-0'>
          {title}
        </h2>

        {success ? <Checkmark stroke='green' className={css(styles.summaryIcon)} /> : <XMark stroke='red' className={css(styles.summaryIcon)} />}
      </div>
    

      <div id={id} className='text-light' >
        {subtitle}
        {info && (
          <Fragment>
            <Info width={14} height={14} style={{marginLeft: 10}} />
            <Tooltip
              target={`#${id}`}
              placement="bottom"
              open={isTooltopShowing}
              toggle={toggleToolTip}
              >
              {info}
            </Tooltip>
        </Fragment>
        )}
      </div>
  </Col>
  )
}


export default () => {
  const params = useParams();

  const [tickerSymbol] = useState(params.tickerSymbol);
  const stockDetails = useQuery(['stockDetails'], () => fetchStockDetails(tickerSymbol), {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  function onSelect(symbol) {
    // refresh the page so we don't have to deal with clearning state
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
          <Row className='mb-5'>
            <Col className='mb-4'>
              <Row>
                <Col className='text-center'>
                  <h5 className='text-light'>Price</h5>
                </Col>
              </Row>
              <Row>
                <PriceText
                  title={`$${stockDetails.data.intrinsicPrice.toFixed(2)}`}
                  success={stockDetails.data.isIntrinsicPriceLessThanCurrentPrice}
                  subtitle='intrinsic price'
                  info="Instrinsic price is the calculated price based on Warren Buffet's intrinsic value definition. Check out the links at the bottom of the page for more info."
                />

                <PriceText
                  title={`$${stockDetails.data.currentPrice.toFixed(2)}`}
                  success={stockDetails.data.isIntrinsicPriceLessThanCurrentPrice}
                  subtitle='current price'
                />
              </Row>
              <Row className='mt-3'>
                <Col className='text-center'>
                  <h5 className='text-light'>Ratios</h5>
                </Col>
              </Row>
              <Row>
                <PriceText
                  title={stockDetails.data.priceToEarningsRatio.toFixed(1)}
                  success={stockDetails.data.isPriceToEarningsRatioFair}
                  subtitle='P/E Ratio'
                  info={'The price to earnings ratio is recommended by Warrent Buffet to be below 15.'}
                />
                <PriceText
                  title={stockDetails.data.priceToBookValueRatio.toFixed(1)}
                  success={stockDetails.data.isPriceToBookValueRatioFair}
                  subtitle='P/BV Ratio'
                  info={'The price to earnings ratio is recommended by Warrent Buffet to be below 1.5.'}
                />
              </Row>
            </Col>
         </Row>


          <Row className={css(styles.charts)}>
            {stockDetails.data.charts.map(chart => (
              <Col className={css(styles.chart)} sm="12" md="12" lg="12">
                <h4>{chart.title}</h4>
                <LineGraph 
                  datums={chart.data} 
                  color={chart.color} 
                  label={chart.title}
                  dataStrip={chart.dataStrip}
                  />
                <p>{chart.description}</p>
              </Col>
            ))}

          </Row>

          {/* <Row>
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
          </Row> */}
        </Container>
      )}
    </Container>
  );
};
