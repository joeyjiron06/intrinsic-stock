import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import TickerInput from '../components/tickerInput';
import { Row, Col, Container, Fade } from 'shards-react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Clock } from '../assets/clock.svg';
import { ReactComponent as BarChart } from '../assets/bar-chart.svg';
import { ReactComponent as ThumbsUp } from '../assets/thumbs-up.svg';
import { ReactComponent as Logo } from '../assets/logo.svg';
import ChartImg from '../assets/chart.png';

const styles = StyleSheet.create({
  root: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 760,
    minHeight: '100vh'
  },
  inputRow: {
    width: '100%'
  },
  row: {
    marginBottom: 60
  },
  header: {
    marginTop: 20,
    alignSelf: 'start'
  },
  iconBubble: {
    display: 'inline-block',
    backgroundColor: 'var(--green)',
    padding: 14,
    borderRadius: 100,
    marginBottom: 10
  },
  chartImage: {
    maxWidth: 250
  },
  footer: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'flex-end',
    marginBottom: 60
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
    justifyContent: 'space-between'
  }
});



export default () => {
  const history = useHistory();

  function onSelect(tickerSymbol) {
    history.push(`/stock/${tickerSymbol}`);
  }

  return (
    <Container className={css(styles.root)}>
      <Row className={css(styles.row, styles.header)}>
        <Col>
          <Logo width={50} height={50}/>
        </Col>
      </Row>


      <h1 className='text-light'>
        <b style={{color: 'var(--green)'}}>Intrinsic</b> Stock
      </h1>

      <p>Your stock picking journet starts here</p>


      <Row className={css(styles.row, styles.inputRow)}>
        <Col>
          <TickerInput
            size="lg"
            placeholder="Find Stock"
            onSelect={onSelect}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>A place to analyze your next stock pick</h2>
          <p>Using discounted cash flow analysis, Instrinsic Stock will help you invest like Warren Buffet by determining the instrinsic value of a company.</p>
        </Col>
      </Row>

      <Fade in={true}>
        <Row className={css(styles.row)}>
          <Col>
            <div className={css(styles.iconBubble)}>
              <ThumbsUp />
            </div>

            <h5>Easy to use</h5>
            <p>Search for a stock, and we’ll do the work to analyze the company.</p>
          </Col>

          <Col>
            <div className={css(styles.iconBubble)}>
              <BarChart />
            </div>

            <h5>Chart analysis</h5>
            <p>The details so you can invest like Warren Buffet.</p>
          </Col>

          <Col>
            <div className={css(styles.iconBubble)}>
              <Clock />
            </div>

            <h5>Real-time data</h5>
            <p>Get the latest information about a company’s stock.</p>
          </Col>
        </Row>
      </Fade>


      <Fade in={true}>
        <Row className={css(styles.row)}>
          <Col>
            <h2>Invest like Warren Buffet</h2>
            <p>We use value investing principles to evaluate stocks like Warren Buffet (the most sucessful investor of all time). </p>
          </Col>
        </Row>
      </Fade>


      <Fade in={true}>
        <Row className={css(styles.row)}>
          <Col>
            <h5 style={{color:'var(--green)'}}>REALTIME DATA</h5>
            <h3>Financial Charts</h3>
            <p>Real time charts with easy to understand explanations.</p>
          </Col>
          <Col>
            <img src={ChartImg} alt="Debt to equity ratio chart" className={css(styles.chartImage)}/>
          </Col>
        </Row>
      </Fade>

      <Fade in={true}>
        <Row>
          <Col>
          <h2>Start your stock analysis journey now!</h2>
          <p>Here to help you on your investment journey. While investing can be complicated, it doesn’t have to be. Check out our detailed explanations for beginners and start exploring your stock options.</p>
          </Col>
        </Row>
      </Fade>

      <Row className={css(styles.footer)}>
        <div className={css(styles.footerLeft)}>
          Made by <a href="http://joeyjiron06.github.io" style={{display:'inline-block'}} >Joey Jiron</a>
        </div>

        <div className={css(styles.footerRight)}>
          <a href="http://joeyjiron06.github.io">Privacy Policy</a>
          <a href="http://joeyjiron06.github.io">Terms of Service</a>
          <a href="http://joeyjiron06.github.io">About</a>
        </div>
      </Row>
      

    </Container>
  );
};
