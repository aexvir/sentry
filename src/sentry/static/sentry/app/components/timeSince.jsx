import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';

import ConfigStore from 'app/stores/configStore';
import {t} from 'app/locale';

class TimeSince extends React.PureComponent {
  static propTypes = {
    date: PropTypes.any.isRequired,
    suffix: PropTypes.string,
  };
  static defaultProps = {
    suffix: 'ago',
  };

  static getDateObj(date) {
    if (_.isString(date) || _.isNumber(date)) {
      date = new Date(date);
    }
    return date;
  }

  static getRelativeDate = (currentDateTime, suffix) => {
    const date = TimeSince.getDateObj(currentDateTime);

    if (!suffix) {
      return moment(date).fromNow(true);
    } else if (suffix === 'ago') {
      return moment(date).fromNow();
    } else if (suffix === 'old') {
      return t('%(time)s old', {time: moment(date).fromNow(true)});
    } else {
      throw new Error('Unsupported time format suffix');
    }
  };

  state = {
    relative: '',
  };

  static getDerivedStateFromProps(props) {
    return {
      relative: TimeSince.getRelativeDate(props.date, props.suffix),
    };
  }

  componentDidMount() {
    this.setRelativeDateTicker();
  }

  componentWillUnmount() {
    if (this.ticker) {
      clearTimeout(this.ticker);
      this.ticker = null;
    }
  }

  setRelativeDateTicker = () => {
    const ONE_MINUTE_IN_MS = 60000;

    this.ticker = setTimeout(() => {
      this.setState({
        relative: TimeSince.getRelativeDate(this.props.date, this.props.suffix),
      });
      this.setRelativeDateTicker();
    }, ONE_MINUTE_IN_MS);
  };

  render() {
    const date = TimeSince.getDateObj(this.props.date);
    const user = ConfigStore.get('user');
    const options = user ? user.options : {};
    const format = options.clock24Hours ? 'MMMM D YYYY HH:mm:ss z' : 'LLL z';
    return (
      <time
        dateTime={date.toISOString()}
        title={moment.tz(date, options.timezone).format(format)}
        className={this.props.className}
      >
        {this.state.relative}
      </time>
    );
  }
}

export default TimeSince;
