import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atom";

interface Iprops {
  coinId: string;
}

interface Idata {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: Iprops) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 14;
  const { isLoading, data } = useQuery<Idata[]>(
    "chartData",
    () =>
      fetch(
        `https://api.coinpaprika.com/v1/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
      ).then((res) => res.json()),
    { refetchInterval: 5000 }
  );

  const isDark = useRecoilValue(isDarkAtom);

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data:
                data?.map((price) => {
                  const obj = {
                    x: new Date(price.time_open).getTime(),
                    y: [
                      price.open.toFixed(2),
                      price.high.toFixed(2),
                      price.low.toFixed(2),
                      price.close.toFixed(2),
                    ],
                  };
                  return obj;
                }) ?? [],
            },
          ]}
          options={{
            chart: {
              type: "candlestick",
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            theme: {
              mode: `${isDark ? "dark" : "light"}`,
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((price) => price.time_open),
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
              labels: {
                formatter: (value) => `${value.toFixed(0)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
