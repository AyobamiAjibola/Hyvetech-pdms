import React, { useRef } from "react";

import { Box } from "@mui/material";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import highchartsAccessibility from "highcharts/modules/accessibility";
import highChartsNoDataToDisplay from "highcharts/modules/no-data-to-display";

highchartsAccessibility(Highcharts);
highChartsNoDataToDisplay(Highcharts);

interface IProps {
  [p: string]: any;

  title: string;
  caption?: string;
  series: any;
}

export default function AppPieChart(props: IProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const options: Highcharts.Options = {
    chart: {
      plotBackgroundColor: undefined,
      plotBorderWidth: undefined,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: props.title,
    },
    caption: {
      text: props.caption,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: props.series,
    credits: { enabled: false },
  };

  return (
    <Box
      sx={{
        boxShadow: 5,
        minWidth: 300,
      }}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        {...props}
      />
    </Box>
  );
}
