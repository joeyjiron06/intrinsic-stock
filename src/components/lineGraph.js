import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Chart } from 'react-charts';

const styles = StyleSheet.create({
  root: {
    display: 'inline-block',
    width: 400,
    height: 300,
    marginBottom: 80,
    marginRight: 50
  }
});

export default ({ label, datums }) => {
  return (
    <div className={css(styles.root)}>
      <Chart
        data={[
          {
            label,
            datums
          }
        ]}
        series={{
          showPoints: false
        }}
        axes={[
          { primary: true, type: 'time', position: 'bottom' },
          { type: 'linear', position: 'left' }
        ]}
        tooltip
        primaryCursor
        secondaryCursor
      />

      <h5>{label}</h5>
    </div>
  );
};
