import createAsyncSlice from './createAsyncSlice';
import {
  fetchCompanyProfile,
  fetchKeyMetrics,
  fetchIncomeStatement,
  fetchFinancialRatios
} from '../services/financialModellingPrep';
import { fetch10YearFederalNoteYield } from '../services/usTreasury';


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

function isTrendingUpwards(array) {
  return array.length > 0 && array[0] > array[array.length - 1];
}


export default createAsyncSlice('stockDetails', async tickerSymbol => {
  // await new Promise(resolve => setTimeout(resolve, 3000));

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

  const listByYears = Array(11).fill().map((_, index) => ({
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
});