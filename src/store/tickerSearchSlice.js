import { searchTicker } from '../services/financialModellingPrep';
import createAsyncSlice from './createAsyncSlice';

export default createAsyncSlice('tickerSearch', async text => {
  if (!text) {
    return null;
  }

  const data = await searchTicker(text);
  return data;
});
