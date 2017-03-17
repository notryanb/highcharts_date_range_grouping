import './css/styles.scss';

if(module.hot) {
  module.hot.accept();
}

((H) => {
  H.Chart.prototype.callbacks.push((chart) => {

    if (chart.userOptions.dateRangeGrouping) {
      const chartRender = chart.renderTo;
      const btnList = [
        { text: 'Day',   dateObj: 'day' },
        { text: 'Week',  dateObj: 'week' },
        { text: 'Month', dateObj: 'month' }
      ];

      let rawDataObj = {};

      /*
       * When making AJAX requests, adhere to addSeries interface
       * to trigger this event.
       */
      H.addEvent(chart, 'addSeries', (e) => {
        rawDataObj = rawData(chart, e.options.data, rawDataObj);
      });
      
      /*
       * If chart data is available upon load (non-AJAX)
       */
      H.addEvent(chart, 'load', (e) => {
        e.target.xAxis[0].series.forEach(i => {
          let yData = i.data.map(datum => datum.y);
          rawDataObj = rawData(chart, yData, rawDataObj);
        });
      });
      
      btnList.forEach(grouping => {
        let btn = document.createElement('button');
        btn.innerHTML += grouping.text;
        btn.classList.add('btn', 'btn-xs', '_hDateRangeGrouping');
        if (grouping.dateObj === 'day') btn.classList.add('active');
        btn.addEventListener('click', (e) => {
          viewBreakdown(chart, rawDataObj, grouping.dateObj);
          updateButtons(e.target);
        });
        chartRender.insertBefore(btn, chartRender.firstChild);
      });
    }
  });

  const rawData = (chart, data, container) => {
    let rawDataObj = container;
    let dateArr = chart.xAxis[0].categories.map(date => new Date(date).toISOString());

    data.forEach((dataPoint, i) => {
      rawDataObj[dateArr[i]] ? rawDataObj[dateArr[i]].push(dataPoint) : rawDataObj[dateArr[i]] = [dataPoint];
    });

    return rawDataObj;
  }

  const viewBreakdown = (chart, data, dateObj) => {
    const dateFormat = chart.userOptions.dateRangeGrouping.dateFormat
    const grouped = groupByDateObject(dateFormat, data, dateObj);
    const sum = sumMatrixColumns(grouped);
    const xAxis = xAxisCategories(sum);
    const yAxis = yAxisSeries(sum);
    const tickInterval = determineTickInterval(dateObj, xAxis.length);
    const values = Object.keys(yAxis).map(key => yAxis[key]);

    chart.xAxis[0].setCategories(xAxis);
    chart.xAxis[0].options.tickInterval = tickInterval;

    values.forEach((category, i) => {
      chart.series[i].setData(category);
    });
  }

  const updateButtons = (btn) => {
    let oldSelection = document.getElementsByClassName('_hDateRangeGrouping active');
    if (oldSelection.length > 0) for (const i of Array.from(oldSelection)) { i.classList.remove('active'); };
    btn.classList.add('active');
  }

  const determineTickInterval = (dateObj, catCount) => {
    switch (dateObj) {
      case('week'):
        return Math.round(catCount / 5); 
        break;
      case('month'):
        return 1; 
        break;
      default:
        return Math.round(catCount / 10); 
    }
  }

  const xAxisCategories = data => {
    return Object.keys(data);
  }

  const yAxisSeries = data => {
    // Transposes matrix
    const values = Object.keys(data).map(key => data[key]);
    return values[0].map((col, i) => values.map(row => row[i]));
  }

  const sumMatrixColumns = (data) => {
    let columnsSum = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)){
        columnsSum[key] = data[key].reduce((acc, val) => acc.map((item, idx) => item + val[idx]));
      }
    }
    return columnsSum;
  }

  const groupByDateObject = (dateFormat, data, grouping) => {
    let dates = Object.keys(data);
    const defaultFormats = {
      dayFormat: { month: '2-digit', day: '2-digit', year: 'numeric' },
      weekFormat: { month: '2-digit', day: '2-digit', year: 'numeric' },
      monthFormat: { month: 'short', year: 'numeric' } 
    }

    return dates.reduce((acc, date) => {
      let dateObj = new Date(date);
      let val;

      switch (grouping) {
        case 'day':
          var formatOptions = dateFormat.dayFormat || defaultFormats.dayFormat;
          val = dateObj.toLocaleDateString(undefined, formatOptions);
          break;
        case 'week':
          var formatOptions = dateFormat.weekFormat || defaultFormats.weekFormat;
          const weekStart = new Date(dateObj);
          const weekEnd = new Date(dateObj);
          weekStart.setDate(dateObj.getDate() - dateObj.getDay());
          weekEnd.setDate((6 - dateObj.getDay()) + dateObj.getDate());

          val = weekStart.toLocaleDateString(undefined, formatOptions) + ' - ' + weekEnd.toLocaleDateString(undefined, formatOptions);
          break;
        case 'month': 
          var formatOptions = dateFormat.monthFormat || defaultFormats.monthFormat;
          val = dateObj.toLocaleString(undefined, formatOptions);
          break;
        default:
          'Error: Please use a valid date grouping';
      }

      (acc[val] = acc[val] || []).push(data[date]);
      return acc;
    }, {});
  }
})(Highcharts);
