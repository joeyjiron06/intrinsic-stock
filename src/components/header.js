import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { ReactComponent as Logo } from '../assets/logo.svg';


const styles = StyleSheet.create({
  header: {
    display: 'flex',
    marginBottom: 12,
    position: 'relative',
    width: '100%',
    justifyContent: 'center'
  },
  logo: {
    position: 'absolute',
    top:0,
    left: 0,
    '@media (max-width: 450px)': {
      display:'none'
    }
  }
});

export default function Header() {
  return (
    <div className={css(styles.header)}>
      <Logo width={50} height={50} className={css(styles.logo)}/>

      <h1 className='text-light'>
        <b style={{color: 'var(--green)'}}>Intrinsic</b> Stock
      </h1>
    </div>
  );
}