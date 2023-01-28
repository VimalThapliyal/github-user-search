import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);
const Column3d = ({ data }) => {
  const chartConfigs = {
    type: "Column3d", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Most Popular",
        yAxisName: "Stars",
        xAxisName: "Repos",
        xAxisNameFontSize: "16px",
        yAxisNameFontSize: "16px",
      },
      // Chart Data
      data: data,
    },
  };

  return <ReactFC {...chartConfigs} />;
};

export default Column3d;
