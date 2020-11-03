import axios from 'axios';
import { minutesFromNow } from './date';

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

export async function getOrFetch(url, {expiration = minutesFromNow(10000), ...options}) {
  let response = getJson(url);

  if (!response) {
    response = await axios.get(url, options);
    setJson(url, { data: response.data, expiration });
  }

  return response.data;
}
