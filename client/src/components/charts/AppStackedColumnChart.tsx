import React, { useRef } from 'react';

import { Box } from '@mui/material';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import highchartsAccessibility from 'highcharts/modules/accessibility';
import highChartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';

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
      type: 'column',
      width: 1660,
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
      y: 25,
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
    credits: { enabled: false },
  };

  return (
    <Box
      component="div"
      sx={{
        boxShadow: 5,
        width: '100%',
        minWidth: 1660,
      }}>
      <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} {...props} />
    </Box>
  );
}
