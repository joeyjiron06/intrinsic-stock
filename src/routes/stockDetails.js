import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { FormInput } from 'shards-react';
import LineGraph from '../components/lineGraph';
import {
  fetchCompanyProfile,
  fetchKeyMetrics,
  fetchIncomeStatement
} from '../services/financialModellingPrep';
import { fetch10YearFederalNoteYield } from '../services/usTreasury';

const styles = StyleSheet.create({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
  const [tickerSymbol, setTickerSymbol] = useState(match.params.tickerSymbol);
  const [profile, setProfile] = useState(null);
  const [intrinsicPrice, setIntrinsicPrice] = useState(null);
  const [keyMetrics, setKeyMetrics] = useState(null);
  const [incomeStatement, setIncomeStatement] = useState(null);

  useEffect(() => {
    async function init() {
      const [
        companyProfile,
        keyMetrics,
        incomeStatement,
        tenYearFederalNoteYield
      ] = await Promise.all([
        fetchCompanyProfile(match.params.tickerSymbol),
        fetchKeyMetrics(match.params.tickerSymbol),
        fetchIncomeStatement(match.params.tickerSymbol),
        fetch10YearFederalNoteYield()
      ]);

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
      // setFinancialRatios(financialRatios.ratios);
      setIntrinsicPrice(intrinsicValue);
      setKeyMetrics(keyMetrics.metrics);
      setIncomeStatement(incomeStatement.financials);
    }

    init();

    return () => {};
  }, []);

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      // refresh the page so we don't have to deal with clearning state
      window.location.href = `${
        window.location.origin
      }/stock/${encodeURIComponent(event.target.value)}`;
    }
  }

  function onChange(event) {
    setTickerSymbol(event.target.value);
  }

  return (
    <div className={css(styles.root)}>
      <h1>
        <b>Intrinsic</b> Stock
      </h1>
      <FormInput
        size="lg"
        placeholder="Find Stock"
        className={css(styles.input)}
        value={tickerSymbol}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      {profile && (
        <div>
          <div>
            <h2>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.companyName}
              </a>
            </h2>
          </div>

          <div>
            <h3>${profile.price.toFixed(1)}</h3>
            <p>currnet price</p>
          </div>
        </div>
      )}

      {intrinsicPrice && (
        <div>
          <h3>${intrinsicPrice.toFixed(1)}</h3>
          <p>intrinsic price</p>
        </div>
      )}

      {/* TODO double check that these graphs represent what they mention in the investment videos */}
      {/* {financialRatios && (
        <div>
          <LineGraph
            label="Price to Earnings Ratio"
            datums={financialRatios.map(ratio => ({
              x: new Date(ratio.date).getTime(),
              y: ratio.investmentValuationRatios.priceEarningsRatio
            }))}
          />
          <LineGraph
            label="Debt to Equity Ratio"
            datums={financialRatios.map(ratio => ({
              x: new Date(ratio.date).getTime(),
              y: ratio.debtRatios.debtEquityRatio
            }))}
          />

          <LineGraph
            label="Dividend Yield"
            datums={financialRatios.map(ratio => ({
              x: new Date(ratio.date).getTime(),
              y: ratio.investmentValuationRatios.dividendYield || 0
            }))}
          />
        </div>
      )} */}

      {keyMetrics && (
        <div>
          <LineGraph
            label="Book Value"
            datums={keyMetrics.map(metric => ({
              x: new Date(metric.date).getTime(),
              y: metric['Book Value per Share'] || 0
            }))}
          />
        </div>
      )}

      {incomeStatement && (
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
      )}
    </div>
  );
};
