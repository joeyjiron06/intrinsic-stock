import { combineReducers } from 'redux';
import tickerSearchSlice from './tickerSearchSlice';

export default combineReducers({
  tickerSearch: tickerSearchSlice.reducer
});
