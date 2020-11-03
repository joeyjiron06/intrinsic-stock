import axios from 'axios';
import { daysFromNow } from './date';

function getJson(key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data || data.expiration > Date.now()) {
    return data;
  }

  localStorage.removeItem(key);
  return null;
}

function setJson(key, json) {
  return localStorage.setItem(key, JSON.stringify(json));
}

function serializeOptions(url, options) {
  return `${url}-${JSON.stringify(options)}`
}

export async function getOrFetch(url, {expiration = daysFromNow(1), ...options}) {
  const key = serializeOptions(url, options);
  let response = getJson(key);

  if (!response) {
    response = await axios.get(url, options);
    setJson(key, { data: response.data, expiration });
  }

  return response.data;
}
