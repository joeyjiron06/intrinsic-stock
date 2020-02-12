import React, { useState, useEffect } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { FormInput } from 'shards-react';
import { Dropdown, DropdownMenu, DropdownItem } from 'shards-react';
import { useQuery } from 'react-query';
import { searchTicker } from '../services/financialModellingPrep';

const styles = StyleSheet.create({
  root: {
    display: 'inline-block',
    width: 400,
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

export default ({ styles: inStyles, onSelect, intialText }) => {
  const [inputText, setInputText] = useState(intialText);
  const [hasFetchedInitialText, setHasFetchedInitialText] = useState(false);
  const [highlitedIndex, setHighlitedIndex] = useState(-1);
  const tickerSearch = useQuery(['tickerSearch', { inputText }], () => {
    if (intialText !== undefined && !hasFetchedInitialText) {
      setHasFetchedInitialText(true);
      return Promise.resolve();
    }

    return searchTicker(inputText);
  });

  useEffect(() => {
    setHighlitedIndex(0);
  }, []);

  function onChange(event) {
    if (event.target.value === inputText) {
      return;
    }

    setInputText(event.target.value);
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
    <div className={css(styles.root, inStyles)}>
      <FormInput
        size="lg"
        placeholder="Find Stock"
        className={css(styles.input)}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={inputText || ''}
      />

      {(tickerSearch.isLoading || tickerSearch.data || tickerSearch.error) && inputText && (
        <Dropdown open={true} toggle={() => { }}>
          <DropdownMenu className={css(styles.dropdown)}>
            {tickerSearch.isLoading && <DropdownItem>Loading...</DropdownItem>}
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
