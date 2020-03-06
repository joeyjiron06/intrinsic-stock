import axios from 'axios';
import { minutesFromNow } from './date';

function getJson(key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (!data || data.expiration < Date.now()) {
    console.log('from cache!', key, data.data);
    return data;
  }

  console.log('NOT from cache!', key, data.data);

  localStorage.removeItem(key);
  return null;
}

function setJson(key, json) {
  return localStorage.setItem(key, JSON.stringify(json));
}

export async function getOrFetch(url, expiration = minutesFromNow(1)) {
  let response = getJson(url);

  if (!response) {
    response = await axios.get(url);
    setJson(url, { data: response.data, expiration });
  }

  return response.data;
}
