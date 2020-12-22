import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    flexGrow: 1,
    paddingBottom: 60,
    display: 'flex'
  },
  footerLeft: {
    flexGrow: 9,
    flexShrink: 1,
    textAlign: 'start'
  },
  footerRight: {
    flexGrow: 3,
    flexShrink: 1,
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 450px)': {
      flexDirection: 'column'
    }
  }
});


export default function Footer() {
  return (
    <div className={css(styles.footer)}>
      <div className={css(styles.footerLeft)}>
        Made by <a href="http://joeyjiron06.github.io" style={{display:'inline-block'}} >Joey Jiron</a>
      </div>

      <div className={css(styles.footerRight)}>
        <a href="/privacy-policy.html">Privacy Policy</a>
        <a href="/terms-of-service.html">Terms of Service</a>
        <a href="/about.html">About</a>
      </div>
    </div>
  )
}