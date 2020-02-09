import axios from 'axios';

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
