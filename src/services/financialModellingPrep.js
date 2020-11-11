import { getOrFetch } from './cache';

const apikey = 'bac68223dd2347b094fa157d725593c9';


export async function fetchFinancialRatios(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/ratios/${tickerSymbol}`,
    {
      params: { 
        apikey
      }
    }
  );
  return data;
}

export async function fetchCompanyProfile(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${tickerSymbol}`,
    {
      params: { 
        apikey
      }
    }
  );
  console.log('got company profile', data);
  return data.profile;
}

export async function fetchKeyMetrics(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/key-metrics/${tickerSymbol}`,
    {
      params: { 
        apikey,
      }
    }
  );
  return data;
}

export async function fetchIncomeStatement(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/financials/income-statement/${tickerSymbol}`,
    {
      params: {
        apikey,
      }
    }
  );
  return data.financials;
}

export async function searchTicker(tickerSymbolOrCompanyName) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/search`,
    {
      params: {
        query: tickerSymbolOrCompanyName,
        limit: '10',
        apikey
      }
    }
  );
  return data;
}

export async function fetchIntrinsicPrice(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/discounted-cash-flow/${tickerSymbol}`,
    {
      params: {
        apikey
      }
    }
  );
  return data[0] && data[0].dcf;
}


function isTrendingUpwards(rawData) {
  const array = rawData.map(([_, val]) => val);

  if (!array.length) {
    return false;
  }

  // all the same
  if (array.every(value => value === array[0])) {
    return false;
  }

  if (array[0] === 0 && array[array.length - 1] === 0) {
    return false;
  }

  if (array[0] < array[array.length - 1]) {
    return false;
  }

  return true;
}


export async function fetchStockDetails(tickerSymbol) {
  const [
    companyProfile,
    keyMetrics,
    financialRatios,
    incomeStatements,
    intrinsicPrice
  ] = await Promise.all([
    fetchCompanyProfile(tickerSymbol),
    fetchKeyMetrics(tickerSymbol),
    fetchFinancialRatios(tickerSymbol),
    fetchIncomeStatement(tickerSymbol),
    fetchIntrinsicPrice(tickerSymbol)
  ]);

  if (!companyProfile || !keyMetrics || !financialRatios || !incomeStatements) {
    console.log({
      companyProfile,
      keyMetrics,
      financialRatios,
      incomeStatements
    });
    throw new Error(`No finanical data found for ${tickerSymbol}. Please try a different symbol.`);
  }

  const earningsPerShare = incomeStatements.map(statement => [new Date(statement.date), Number(statement['EPS']) || 0]);
  const bookValues = keyMetrics.map(keyMetric => [new Date(keyMetric.date), Number(keyMetric.bookValuePerShare) || 0]);
  const dividends = incomeStatements.map(statement => [new Date(statement.date), Number(statement['Dividend per Share']) || 0]);
  const returnOnEquity = keyMetrics.map(keyMetric => [new Date(keyMetric.date), Number(keyMetric.roe) || 0]);
  const debtToEquity = keyMetrics.map(keyMetric => [new Date(keyMetric.date), Number(keyMetric.debtToEquity) || 0]);
  const operatingActivities = incomeStatements.map(statement => [new Date(statement.date), Number(statement['Operating Expenses']) || 0]);

  const currentPrice = companyProfile.price;
  const priceToEarningsRatio =earningsPerShare[0][1] > 0 ?  currentPrice / earningsPerShare[0][1] : 0;
  const priceToBookValueRatio = bookValues[0][1] > 0 ? currentPrice / bookValues[0][1]: 0;

  const companyName = companyProfile.companyName;
  const companyWebsite = companyProfile.website;
  const isIntrinsicPriceLessThanCurrentPrice = currentPrice < intrinsicPrice;
  const isPriceToEarningsRatioFair = priceToEarningsRatio > 0 && priceToEarningsRatio < 15;
  const isPriceToBookValueRatioFair = priceToBookValueRatio > 0 && priceToBookValueRatio < 1.5;

  const charts = [
    {
      title: 'Earnings per Share',
      color: isTrendingUpwards(earningsPerShare) ? 'green' : 'red',
      data: earningsPerShare,
      description: 'Warrent Buffet’s 3rd rule of investing  states that a company must be stable and understanable.  This chart should increase over time because it’s extremely important for determining future cash flows.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-20/'
    },
    {
      title: 'Book Balue',
      color: isTrendingUpwards(bookValues) ? 'green' : 'red',
      data: bookValues,
      description: 'Warrent Buffet’s 3rd rule of investing  states that a company must be stable and understanable. This graph should increase over time. If the company pays a high dividend, the book value may grow at a slower rate. If the company pays no dividend, the book value should grow with the EPS each year.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-20/'
    },
    {
      title: 'Dividends',
      color: isTrendingUpwards(dividends) ? 'green' : 'red',
      data: dividends,
      description: 'Warrent Buffet’s 3rd rule of investing  states that a company must be stable and understanable. This chart should have a flat to positive slope over time. If you see a drastic drop, it may represent a stock split for the company which will require further research. The dividend is taken from a portion of the EPS, the remainder goes to the book value.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-20/'
    },
    {
      title: 'Return on Equity',
      color: isTrendingUpwards(returnOnEquity) ? 'green' : 'red',
      data: returnOnEquity,
      description: 'Warrent Buffet’s 3rd rule of investing  states that a company must be stable and understanable. This chart should have a flat to positive slope over time. If you see a drastic drop, it may represent a stock split for the company which will require further research. The dividend is taken from a portion of the EPS, the remainder goes to the book value.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-20/'
    },
    {
      title: 'Debt to Equity Ratio',
      color: !isTrendingUpwards(debtToEquity) ? 'green' : 'red',
      data: debtToEquity,
      description: 'Warrent Buffet’s 1st rule of investing states that a company must be be managed by a vigilant leader. A vigilant leader manages debt well and the debt to equity ratio helps measure the health of the company in the long term. As a rule of thumb, the debt to equity ratio should be lower than 0.5. Look for stability trends within the debt/equity ratio to see how the company manages their long term risk.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-18/'
    },
    {
      title: 'Operating Activities',
      color: isTrendingUpwards(operatingActivities) ? 'green' : 'red',
      data: operatingActivities,
      description: 'TODO REWORD ME This is the cash that is produced by the company’s operations, and without that, the cash flow from investing and financing activities cannot be healthy. While the net income is a key number and is also included in the calculation of operating activities, many other factors influence how much cash the company is actually making. If you see a high positive cash flow from you operating cash it is typically a positive of a healthy business.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-26/'
    },
    {
      title: 'Investing Activities',
      color: isTrendingUpwards(operatingActivities) ? 'green' : 'red',
      data: operatingActivities,
      description: 'TODO REWORD ME This is the cash that is produced by the company’s operations, and without that, the cash flow from investing and financing activities cannot be healthy. While the net income is a key number and is also included in the calculation of operating activities, many other factors influence how much cash the company is actually making. If you see a high positive cash flow from you operating cash it is typically a positive of a healthy business.',
      link: 'https://www.buffettsbooks.com/how-to-invest-in-stocks/intermediate-course/lesson-26/'
    },
  ];
  
  return {
    companyName,
    companyWebsite,
    intrinsicPrice,
    currentPrice,
    priceToEarningsRatio,
    priceToBookValueRatio,
    isIntrinsicPriceLessThanCurrentPrice,
    isPriceToEarningsRatioFair,
    isPriceToBookValueRatioFair,
    charts
  };
};
