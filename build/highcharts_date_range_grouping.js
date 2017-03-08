/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

console.log('hey');

/*
module.exports = function() {
  console.log('RUnning');
  
  const H = Highcharts;
  H.Chart.prototype.callbacks.push(function (chart) {
    if (chart.userOptions.dateRangeGrouping) {
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
};
*/

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);