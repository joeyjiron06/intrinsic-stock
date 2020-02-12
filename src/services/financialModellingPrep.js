import axios from 'axios';
import { fetch10YearFederalNoteYield } from './usTreasury';

function getJson(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setJson(key, json) {
  return localStorage.setItem(key, JSON.stringify(json));
}

async function getOrFetch(url) {
  const { data } = getJson(url) || (await axios.get(url));
  setJson(url, { data });
  return data;
}

export async function fetchFinancialRatios(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/financial-ratios/${tickerSymbol}`
  );
  return data.ratios;
}

export async function fetchCompanyProfile(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${tickerSymbol}`
  );
  return data.profile;
}

export async function fetchKeyMetrics(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/company-key-metrics/${tickerSymbol}`
  );
  return data.metrics;
}

export async function fetchIncomeStatement(tickerSymbol) {
  const data = await getOrFetch(
    `https://financialmodelingprep.com/api/v3/financials/income-statement/${tickerSymbol}`
  );
  return data.financials;
}

export async function searchTicker(tickerSymbolOrCompanyName) {
  return getOrFetch(
    `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(
      tickerSymbolOrCompanyName
    )}&limit=10`
  );
}



function calculateIntrinsicValue(bookValues, dividends, tenYearFederalNoteYield) {
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

function isTrendingUpwards(array) {
  if (!array.length) {
    return false;
  }

  // all the same
  if (array.every(value => value === array[0])) {
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
    incomeStatement,
    tenYearFederalNoteYield
  ] = await Promise.all([
    fetchCompanyProfile(tickerSymbol),
    fetchKeyMetrics(tickerSymbol),
    fetchFinancialRatios(tickerSymbol),
    fetchIncomeStatement(tickerSymbol),
    fetch10YearFederalNoteYield()
  ]);

  const minLength = Math.min(incomeStatement.length, keyMetrics.length, financialRatios.length);

  const listByYears = Array(minLength).fill().map((_, index) => ({
    date: incomeStatement[index].date,
    earningsPerShare: Number(incomeStatement[index]['EPS']) || 0,
    bookValue: Number(keyMetrics[index]['Book Value per Share']) || 0,
    dividend: Number(incomeStatement[index]['Dividend per Share']) || 0,
    debtToEquityRatio: Number(financialRatios[index].debtRatios.debtEquityRatio) || 0,
  }));

  const bookValues = listByYears.map(data => data.bookValue);
  const dividends = listByYears.map(data => data.dividend);
  const earningsPerShare = listByYears.map(data => data.earningsPerShare);
  const debtToEquityRatios = listByYears.map(data => data.debtToEquityRatio);

  const intrinsicPrice = calculateIntrinsicValue(
    bookValues,
    dividends,
    tenYearFederalNoteYield
  );

  const currentPrice = companyProfile.price;
  const priceToEarningsRatio = Number(financialRatios[0].investmentValuationRatios.priceEarningsRatio) || 0;
  const priceToBookValueRatio = financialRatios.map(ratio => Number(ratio.investmentValuationRatios.priceToBookRatio) || undefined).find(num => num !== undefined);

  const companyName = companyProfile.companyName;
  const companyWebsite = companyProfile.website;
  const isIntrinsicPriceLessThanCurrentPrice = currentPrice < intrinsicPrice;
  const isPriceToEarningsRatioFair = priceToEarningsRatio < 15;
  const isPriceToBookValueRatioFair = priceToBookValueRatio < 1.5;
  const isDividendTrendingUpwards = isTrendingUpwards(dividends);
  const isBookValueTrendingUpwards = isTrendingUpwards(bookValues);
  const isEarningsTrendingUpwards = isTrendingUpwards(earningsPerShare);
  const isDebtTrendingDownwards = !isTrendingUpwards(debtToEquityRatios);

  return {
    companyName,
    companyWebsite,
    intrinsicPrice,
    currentPrice,
    priceToEarningsRatio,
    priceToBookValueRatio,
    listByYears,
    isIntrinsicPriceLessThanCurrentPrice,
    isPriceToEarningsRatioFair,
    isPriceToBookValueRatioFair,
    isDividendTrendingUpwards,
    isBookValueTrendingUpwards,
    isEarningsTrendingUpwards,
    isDebtTrendingDownwards,
  };
};
