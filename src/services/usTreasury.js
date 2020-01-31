import axios from 'axios';

async function fetchData() {
  const { data } = await axios.get(
    `https://www.quandl.com/api/v3/datasets/USTREASURY/YIELD.json`,
    {
      api_key: process.env.REACT_APP_QUANDL_API_KEY
    }
  );

  const indexOf10Yr = data.dataset.column_names.findIndex(
    name => name.toLowerCase() === '10 yr'
  );

  const firstRow = data.dataset.data[0];
  return firstRow[indexOf10Yr];
}

function hoursFromNow(num) {
  // hours * mins * seconds * millis
  return Date.now() + num * 60 * 60 * 1000;
}

async function getOrFetchData() {
  const item = JSON.parse(localStorage.getItem(`ustreasuryyield`));

  // still valid
  if (item && item.expiration > Date.now()) {
    return item;
  }

  const data = await fetchData();
  const expiration = hoursFromNow(24);
  const newItem = {
    data,
    expiration
  };

  localStorage.setItem('ustreasuryyield', JSON.stringify(newItem));

  return newItem;
}

export async function fetch10YearFederalNoteYield() {
  const { data } = await getOrFetchData();
  return data;
}
