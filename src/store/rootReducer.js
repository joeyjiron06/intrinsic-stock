import { combineReducers } from 'redux';
import tickerSearchSlice from './tickerSearchSlice';
import stockDetailsSlice from './stockDetailsSlice';

export default combineReducers({
  tickerSearch: tickerSearchSlice.reducer,
  stockDetails: stockDetailsSlice.reducer
});
