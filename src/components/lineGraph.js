import React, {useMemo} from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Chart } from 'react-charts';

const styles = StyleSheet.create({
  root: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartContainer: {
    width: 320,
    height: 220,
    marginBottom: 40
  },
  xAxis: {
    display: 'flex',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 10,
    justifyContent:'space-between'
  },
  dataStrip: {
    display: 'flex',
    marginTop: 40,
    fontSize: 10,
    justifyContent: 'space-between',
    border:'solid 1px blue'
  },
  dataStripItem: {
    marginRight: 14
  },
});


export default ({ label, datums, color, className }) => {
  const series = useMemo(() => ({
    showPoints: false,
    type: 'area',
  }), []);
  
  const axes = useMemo(() => [
    { primary: true, type: 'time', position: 'bottom', show: false },
    { type: 'linear', position: 'left' }
  ], []);

  const getSeriesStyle = useMemo(() => () => ({
    color: `var(--${color})`,
    opacity: 0.6
  }), [color])

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.chartContainer)}>
        <Chart
          data={[
            {
              label,
              datums
            }
          ]}
          series={series}
          axes={axes}
          getSeriesStyle={getSeriesStyle}
          tooltip
          primaryCursor
          secondaryCursor
          dark
        />

        <div className={css(styles.xAxis)}>
          <div>{datums[datums.length-1][0].getFullYear()}</div>
          <div>{datums[0][0].getFullYear()}</div>
        </div>
      </div>
    
      {/* <div className={css(styles.dataStrip)}>
        {dataStrip.map(([title, subtitle]) => (
          <div className={css(styles.dataStripItem)}>
            <div>{title}</div>
            <div>{subtitle}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
};
