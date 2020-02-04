import { createAction, createReducer } from '@reduxjs/toolkit';

export default (type, asyncFn) => {
  const loading = createAction(`${type}/loading`);
  const success = createAction(`${type}/success`);
  const error = createAction(`${type}/error`);
  const clear = createAction(`${type}/clear`);
  const initialState = {
    loading: false,
    error: null,
    data: null
  };

  const reducer = createReducer(initialState, {
    [loading]: state => {
      state.loading = true;
      state.error = null;
    },
    [success]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [error]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [clear]: state => {
      console.log('clearing...');
      Object.assign(state, initialState);
    }
  });

  const fetch = (...args) => async dispatch => {
    dispatch(loading());
    try {
      const data = await asyncFn(...args);
      dispatch(success(data));
    } catch (e) {
      dispatch(error(e));
    }
  };

  return {
    fetch,
    clear,
    reducer
  };
};
