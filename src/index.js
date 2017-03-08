(function(H) {
  H.Chart.prototype.callbacks.push(function (chart) {
    console.log('Chart: ', chart); 
    if (chart.userOptions.dateRangeGrouping) {
    console.log('Inside plugin'); 
      const chartRender = chart.renderTo;
      const btnList = [
        { text: 'Daily',   dateObj: 'date' },
        { text: 'Weekly',  dateObj: 'week'  },
        { text: 'Monthly', dateObj: 'month' }
      ];

      var rawDataObj = {};

      H.addEvent(chart, 'addSeries', function (e) {
        rawDataObj = rawData(chart, e.options.data, rawDataObj);
      });

      btnList.forEach(grouping => {
        let btn = document.createElement('button');
        btn.innerHTML += grouping.text;
        btn.classList.add('btn', 'btn-xs', '_hDateRangeGrouping');
        if (grouping.text === 'Daily') btn.classList.add('active');
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
    const grouped = groupByDateObject(data, dateObj);
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
    if (oldSelection.length > 0) for (const i of oldSelection) { i.classList.remove('active'); };
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
        columnsSum[key] = data[key].reduce((a, b) => a.map((x, i) => x + b[i]));
      }
    }
    return columnsSum;
  }

  const groupByDateObject = (data, grouping) => {
    let dates = Object.keys(data);

    return dates.reduce((acc, date) => {
      let val;

      switch (grouping) {
        case 'date':
          val = moment(date).format('MM/DD/YYYY');
          break;
        case 'week':
          val = moment(date).startOf('week').format('MM/DD/YYYY') + ' - ' + moment(date).endOf('week').format('MM/DD/YYYY');
          break;
        case 'month': 
          val = moment(date).format('MMM, YYYY');
          break;
        default:
          'Error: Please use a valid date grouping';
      }

      (acc[val] = acc[val] || []).push(data[date]);
      return acc;
    }, {});
  }
})(Highcharts);
