## Highcharts Date Range Grouping

![higcharts-plugin-gif-demo](https://github.com/notryanb/highcharts_date_range_grouping/blob/master/images/plugin-01.gif?raw=true)

This plugin is meant to help group data over a time domain. The raw dataset should be datapoints
broken down by day in order for the plugin to make weekly and monthly sums.

## Basic Usage
Chart Options: `dateRangeGrouping: true`  
Chart Options 
```
dateRangeGrouping: {
  dayFormat: { month: 'numeric', day: 'numeric', year: 'numeric' },
  weekFormat: { month: 'numeric', day: 'numeric', year: 'numeric' },
  monthFormat: { month: 'numeric', year: 'numeric'  }
}
```

[toLocaleDateString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) configurations are used to format the date strings in this plugin.

## Demos
[Defaults](https://jsfiddle.net/9kyw8uky/5/) 
[Date Formatting Options](https://jsfiddle.net/9kyw8uky/6/)

