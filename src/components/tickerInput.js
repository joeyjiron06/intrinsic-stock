import React, { useState, useEffect } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { FormInput } from 'shards-react';
import { useDispatch, useSelector } from 'react-redux';
import tickerSearchSlice from '../store/tickerSearchSlice';
import { Dropdown, DropdownMenu, DropdownItem } from 'shards-react';
const styles = StyleSheet.create({
  root: {
    display: 'inline-block',
    width: 400,
    marginBottom: 80,
    marginRight: 50
  },
  input: {
    maxWidth: 400
  },
  dropdown: {
    width: '100%'
  },
  tickerResult: {
    display: 'flex'
  },
  tickerSymbol: {
    fontWeight: 'bold',
    width: 100,
    flexShrink: 0,
    flexGrow: 1
  },
  tickerName: {
    flexGrow: 8,
    flexShrink: 8,
    marginRight: 10,
    wordBreak: 'break-word',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  exchangeName: {
    flexShrink: 0,
    flexGrow: 1,
    textAlign: 'end'
  }
});

const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13
};

export default ({ onSelect, intialText }) => {
  const [inputText, setInputText] = useState(intialText);
  const [highlitedIndex, setHighlitedIndex] = useState(-1);
  const dispatch = useDispatch();
  const tickerSearch = useSelector(state => state.tickerSearch);

  useEffect(() => {
    setHighlitedIndex(0);
    dispatch(tickerSearchSlice.actions.success(null))
  }, [dispatch]);

  function onChange(event) {
    const text = event.target.value;
    setInputText(text);
    dispatch(tickerSearchSlice.actions.fetch(text));
  }

  function onKeyDown(event) {
    if (!tickerSearch.data || !tickerSearch.data.length) {
      return;
    }

    switch (event.keyCode) {
      case KEYS.UP:
        event.preventDefault();
        setHighlitedIndex((highlitedIndex - 1) % tickerSearch.data.length);
        break;
      case KEYS.DOWN:
        event.preventDefault();
        setHighlitedIndex((highlitedIndex + 1) % tickerSearch.data.length);
        break;
      case KEYS.ENTER:
        event.preventDefault();
        if (tickerSearch.data && tickerSearch.data[highlitedIndex]) {
          onSelect(tickerSearch.data[highlitedIndex].symbol);
        }
        break;
      default:
        break;
    }
  }

  function rowClicked(tickerSymbol) {
    return () => {
      onSelect(tickerSymbol);
    };
  }

  return (
    <div className={css(styles.root)}>
      <FormInput
        size="lg"
        placeholder="Find Stock"
        className={css(styles.input)}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={inputText || ''}
      />

      {(tickerSearch.loading || tickerSearch.data || tickerSearch.error) && (
        <Dropdown open={true} toggle={() => { }}>
          <DropdownMenu className={css(styles.dropdown)}>
            {tickerSearch.loading && <DropdownItem>Loading...</DropdownItem>}
            {tickerSearch.error && (
              <DropdownItem>Error: {tickerSearch.error.message} </DropdownItem>
            )}
            {tickerSearch.data && tickerSearch.data.length === 0 && (
              <DropdownItem>No results</DropdownItem>
            )}
            {tickerSearch.data &&
              tickerSearch.data.length > 0 &&
              tickerSearch.data.map((result, index) => (
                <DropdownItem
                  key={result.symbol}
                  className={css(styles.tickerResult)}
                  onClick={rowClicked(result.symbol)}
                  active={index === highlitedIndex}
                >
                  <span className={css(styles.tickerSymbol)}>
                    {result.symbol}
                  </span>
                  <span className={css(styles.tickerName)}>{result.name}</span>
                  <span className={css(styles.exchangeName)}>
                    {result.exchangeShortName}
                  </span>
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};
