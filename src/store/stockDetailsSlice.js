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

  const intrinsicPrice = 23.4;
  const currentPrice = companyProfile.price;
  const priceToEarningsRatio = financialRatios[0].investmentValuationRatios.priceEarningsRatio;
  const priceToBookValueRatio = financialRatios[0].investmentValuationRatios.priceToBookRatio;

  const listByYears = Array(11).fill().map((_, index) => ({
    date: incomeStatement[index].date,
    earningsPerShare: Number(incomeStatement[index]['EPS']) || 0,
    bookValue: Number(keyMetrics[index]['Book Value per Share']) || 0,
    dividend: Number(incomeStatement[index]['Dividend per Share']) || 0,
    debtToEquityRatio: Number(financialRatios[index].debtRatios.debtEquityRatio) || 0,
  }));

  const isIntrinsicPriceLessThanCurrentPrice = true;
  const isPriceToEarningsRatioFair = true;
  const isPriceToBookValueRatioFair = true;
  const isDividendTrendingUpwards = true;
  const isBookValueTrendingUpwards = true;
  const isEarningsTrendingUpwards = true;
  const isDebtTrendingDownwards = true;

  return {
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