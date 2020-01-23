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

export function fetchFinancialRatios(tickerSymbol) {
  return getOrFetch(
    `https://financialmodelingprep.com/api/v3/financial-ratios/${tickerSymbol}`
  );
}

export async function fetchCompanyProfile(tickerSymbol) {
  return getOrFetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${tickerSymbol}`
  );
}
