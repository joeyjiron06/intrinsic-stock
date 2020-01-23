import React, { useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { FormInput } from 'shards-react';
import { Chart } from 'react-charts';
import {
  fetchFinancialRatios,
  fetchCompanyProfile
} from '../services/financialModellingPrep';

const styles = StyleSheet.create({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    maxWidth: 400,
    marginBottom: 30
  }
});

export default ({ match }) => {
  const [tickerSymbol, setTickerSymbol] = useState(match.params.tickerSymbol);
  const [profile, setProfile] = useState(null);
  const [financialRatios, setFinancialRatios] = useState(null);
  const [intrinsicPrice, setIntrinsicPrice] = useState(null);

  useEffect(() => {
    async function init() {
      const [companyProfile, financialRatios] = await Promise.all([
        fetchCompanyProfile(match.params.tickerSymbol),
        fetchFinancialRatios(match.params.tickerSymbol)
      ]);

      setProfile(companyProfile.profile);
      setFinancialRatios(financialRatios.ratios);
      setIntrinsicPrice(companyProfile.profile.price / 2);

      console.log('data', {
        companyProfile,
        financialRatios
      });
    }

    init();

    return () => {};
  }, []);

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      console.log('keydown', {
        key: event.key,
        code: event.keyCode,
        value: event.target.value
      });
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
            <h3>${profile.price}</h3>
            <p>currnet price</p>
          </div>
        </div>
      )}

      {intrinsicPrice && (
        <div>
          <h3>${intrinsicPrice}</h3>
          <p>intrinsic price</p>
        </div>
      )}

      {financialRatios && (
        <div>
          <div
            style={{
              width: '400px',
              height: '300px'
            }}
          >
            <Chart
              data={[
                {
                  label: 'Debt to Equity Ratio',
                  datums: financialRatios.map(ratio => ({
                    x: new Date(ratio.date).getTime(),
                    y: ratio.debtRatios.debtEquityRatio
                  }))
                }
              ]}
              series={{
                showPoints: false
              }}
              axes={[
                { primary: true, type: 'time', position: 'bottom' },
                { type: 'linear', position: 'left' }
              ]}
              tooltip
              primaryCursor
              secondaryCursor
            />

            <h5>Debt to Equity Ratio</h5>
          </div>
        </div>
      )}
    </div>
  );
};
