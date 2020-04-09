import React, { useMemo } from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Chart } from 'react-charts';

const styles = StyleSheet.create({
  root: {
    marginBottom: 80,
    marginRight: 50,
    width: 380,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  chart: {
    width: 380,
    height: 300,
  },
  timelineCol: {
    padding: 0,
    marginRight: 8
  },
  timeline: {
    display: 'flex',
    fontSize: 12
  },
  description: {
    opacity: 0.7,
    marginTop: 12
  }
});

export default ({ title, datums, description, link, ...otherProps }) => {
  const axes = useMemo(() => [
    { primary: true, type: 'time', position: 'bottom', show: false },
    { type: 'linear', position: 'left', show: false }
  ], []);

  return (
    <div className={css(styles.root)} {...otherProps}>
      <h4 className='text-light'>{title}</h4>

      <div className={css(styles.chart)}>
        <Chart
          data={[
            {
              label: title,
              datums
            }
          ]}
          series={{
            showPoints: false,
            type: 'area'
          }}
          axes={axes}
          tooltip
          primaryCursor
          secondaryCursor
          dark
        />
      </div>

      <div className={css(styles.timeline)}>
        {/* <span className={css(styles.timelineCol)}>
          <div>Year</div>
          <div>EPS</div>
        </span> */}
        {datums.reverse().map(datum => (
          <span className={css(styles.timelineCol)}>
            <div>
              {new Date(datum.x).getFullYear()}
            </div>
            <div>
              {datum.y.toFixed(2)}
            </div>
          </span>
        ))}
      </div>

      <div className={css(styles.description)}>
        <span></span> {description}
        <span>Read more here <a href={link} rel="noopener noreferrer" target="_blank">here.</a></span>
      </div>
    </div >
  );
};
