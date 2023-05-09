import { Chart as ChartJS } from "chart.js";
export const noDataPlugin = [
  {
    id: "noData",
    beforeDraw: (chart: ChartJS) => {
      if (chart.data.datasets[0].data.length === 0) {
        let ctx = chart.ctx;
        let width = chart.width;
        let height = chart.height;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "1.1em Montserrat, sans-serif";
        ctx.fillText("No data to display", width / 2, height / 2);
        ctx.restore();
      }
    },
  },
];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        position: "end",
        font: {
          size: 10,
        },
      },
    },
  },
};