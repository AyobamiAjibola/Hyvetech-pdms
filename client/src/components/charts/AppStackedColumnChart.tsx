// @ts-nocheck
import React, { useRef, useEffect } from 'react';

// import { Box } from '@mui/material';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import highchartsAccessibility from 'highcharts/modules/accessibility';
import highChartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { width } from '@mui/system';

highchartsAccessibility(Highcharts);
highChartsNoDataToDisplay(Highcharts);

interface IProps {
  title: string;
  categories: string[];
  yAxisText: string;
  caption?: string;
  series: any;

  [p: string]: any;
}

export default function AppStackedColumnChart(props: IProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const options: Highcharts.Options = {
    chart: {
      // type: 'column',
      type: 'bar',
      // width: window.screen.width - 160,
    },
    title: {
      text: props.title,
    },
    caption: {
      text: props.caption,
    },
    xAxis: {
      categories: props.categories,
    },
    yAxis: {
      min: 0,
      allowDecimals: false,
      title: {
        text: props.yAxisText,
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color:
            // theme
            (Highcharts.defaultOptions.title?.style && Highcharts.defaultOptions.title?.style.color) || 'gray',
          textOutline: 'none',
        },
      },
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      // itemDistance: 10,
      y: 20,
      floating: true,
      backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      },
    },
    series: props.series,
    // series: [{
    //   name: 'Year 1990',
    //   data: [631, 727, 3202, 721, 26]
    // }, {
    //   name: 'Year 2000',
    //   data: [814, 8401, 3714, 726, 31]
    // }, {
    //   name: 'Year 2010',
    //   data: [1044, 944, 4170, 735, 40]
    // }, {
    //   name: 'Year 2018',
    //   data: [120076, 1007, 4561, 746, 42]
    // }],
    credits: { enabled: false },
  };

  return (
    <div
      style={{
        boxShadow: 5
      }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        containerProps={{ style: { width: '100%' } }}
        {...props}
      />
    </div>
  );
}
