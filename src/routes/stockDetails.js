import React, { useEffect, useState, Fragment } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import LineGraph from '../components/lineGraph';
import { Container, Col, Row } from 'shards-react';
import {
  fetchCompanyProfile,
  fetchKeyMetrics,
  fetchIncomeStatement,
  fetchFinancialRatios
} from '../services/financialModellingPrep';
import { fetch10YearFederalNoteYield } from '../services/usTreasury';

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
  }
});

function calculateIntrinsicValue(
  bookValues,
  dividends,
  tenYearFederalNoteYield
) {
  const bookValue = bookValues[0];
  const oldestBookValue = bookValues[bookValues.length - 1];
  const dividend = dividends[0];
  const years = bookValues.length;

  // this code below is taken directly from the buffet books website
  const avgBookValueChangePercentage =
    100 * (Math.pow(bookValue / oldestBookValue, 1 / years) - 1);
  const perc = 1 + avgBookValueChangePercentage / 100;
  const parr = bookValue * Math.pow(perc, years);
  const federalNoteRate = tenYearFederalNoteYield / 100;
  const extra = Math.pow(1 + federalNoteRate, years);
  const extraInverse = 1 / extra;
  const intrinsicValue =
    (dividend * (1 - extraInverse)) / federalNoteRate + parr / extra;

  return intrinsicValue;
}

export default ({ match }) => {
  const [tickerSymbol] = useState(match.params.tickerSymbol);
  const [profile, setProfile] = useState(null);
  const [intrinsicPrice, setIntrinsicPrice] = useState(null);
  const [financialRatios, setFinancialRatios] = useState(null);
  const [keyMetrics, setKeyMetrics] = useState(null);
  const [incomeStatement, setIncomeStatement] = useState(null);

  useEffect(() => {
    async function init() {
      const [
        companyProfile,
        keyMetrics,
        financialRatios,
        incomeStatement,
        tenYearFederalNoteYield
      ] = await Promise.all([
        fetchCompanyProfile(match.params.tickerSymbol),
        fetchKeyMetrics(match.params.tickerSymbol),
        fetchFinancialRatios(match.params.tickerSymbol),
        fetchIncomeStatement(match.params.tickerSymbol),
        fetch10YearFederalNoteYield()
      ]);

      // TODO deal with nulls

      const bookValues = keyMetrics.metrics.map(
        metric => Number(metric['Book Value per Share']) || 0
      );
      const dividends = incomeStatement.financials.map(
        statement => Number(statement['Dividend per Share']) || 0
      );

      const intrinsicValue = calculateIntrinsicValue(
        bookValues,
        dividends,
        tenYearFederalNoteYield
      );

      setProfile(companyProfile.profile);
      setFinancialRatios(financialRatios.ratios);
      setIntrinsicPrice(intrinsicValue);
      setKeyMetrics(keyMetrics.metrics);
      setIncomeStatement(incomeStatement.financials);
    }

    init();

    return () => {};
  }, []);

  function onSelect(symbol) {
    // refresh the page so we don't have to deal with clearning state
    window.location.href = `${
      window.location.origin
    }/stock/${encodeURIComponent(symbol)}`;
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

      {profile && (
        <Fragment>
          <Row>
            <h2>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.companyName}
              </a>
            </h2>
          </Row>

          <Row>
            <h3>${profile.price.toFixed(1)}</h3>
            <p>current price</p>
          </Row>
        </Fragment>
      )}

      {intrinsicPrice && (
        <Row>
          <h3>${intrinsicPrice.toFixed(1)}</h3>
          <p>intrinsic price</p>
        </Row>
      )}

      {/* TODO double check that these graphs represent what they mention in the investment videos */}
      {financialRatios && (
        <Fragment>
          <Row>
            <h2>Price to Earnings Ratio</h2>
          </Row>

          <Row>
            {financialRatios[0].investmentValuationRatios.priceEarningsRatio <=
            5 ? (
              <p className="text-success">
                The current P/E ratio is{' '}
                <b>
                  {
                    financialRatios[0].investmentValuationRatios
                      .priceEarningsRatio
                  }{' '}
                </b>
                which is greater than the Warrent Buffet recommended value of 5.
              </p>
            ) : (
              <p className="text-danger">
                The current P/E ratio is{' '}
                <b>
                  {
                    financialRatios[0].investmentValuationRatios
                      .priceEarningsRatio
                  }{' '}
                </b>
                which is greater than the Warrent Buffet recommended value of 5.
              </p>
            )}

            <p>
              According to Warent Buffet, the price to earnings ratio should be
              less than 5.
            </p>
          </Row>
          <Row>
            <p>
              currnent P/E Ratio:
              {financialRatios[0].investmentValuationRatios.priceEarningsRatio}
            </p>
          </Row>
          {/* <LineGraph
            label="Price to Earnings Ratio"
            datums={financialRatios.map(ratio => ({
              x: new Date(ratio.date).getTime(),
              y: ratio.investmentValuationRatios.priceEarningsRatio
            }))}
          /> */}
          {/* <LineGraph
            label="Debt to Equity Ratio"
            datums={financialRatios.map(ratio => ({
              x: new Date(ratio.date).getTime(),
              y: ratio.debtRatios.debtEquityRatio
            }))}
          /> */}

          {/* <LineGraph
            label="Dividend Yield"
            datums={financialRatios.map(ratio => ({
              x: new Date(ratio.date).getTime(),
              y: ratio.investmentValuationRatios.dividendYield || 0
            }))}
          /> */}
        </Fragment>
      )}

      {/* {keyMetrics && (
        <Fragment>
          <Row>
            <h2>Book Value</h2>
          </Row>

          <Row>
            <Col>
              <p>should always go up</p>
            </Col>

            <Col>
              <LineGraph
                label="Book Value"
                datums={keyMetrics.map(metric => ({
                  x: new Date(metric.date).getTime(),
                  y: metric['Book Value per Share'] || 0
                }))}
              />
            </Col>
          </Row>
        </Fragment>
      )} */}

      {/* {incomeStatement && (
        <div>
          <LineGraph
            label="Earnings Per Share"
            datums={incomeStatement.map(statement => ({
              x: new Date(statement.date).getTime(),
              y: statement['EPS'] || 0
            }))}
          />
          <LineGraph
            label="Dividend per Share"
            datums={incomeStatement.map(statement => ({
              x: new Date(statement.date).getTime(),
              y: statement['Dividend per Share'] || 0
            }))}
          />
        </div>
      )} */}
    </Container>
  );
};
