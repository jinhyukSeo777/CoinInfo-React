import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atom";
import styled, { keyframes } from "styled-components";

interface Iprops {
  coinId: string;
  changeMin?: number;
  changeDay?: number;
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

const animation = keyframes`
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const PriceDiv = styled.div<{ delay: number }>`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 25px 0;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  animation: ${animation} ${(props) => props.delay}s linear;
  > span {
    font-size: 13.5px;
    font-weight: 400;
    margin-bottom: 20px;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  > span {
    font-size: 17px;
    width: 33%;
    text-align: center;
  }
`;

const ChangeInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  > span {
    font-size: 17px;
    width: 33%;
    text-align: center;
  }
`;

const ChangeSpan = styled.span<{ isPlus: boolean }>`
  color: ${(props) => (props.isPlus ? "red" : "blue")};
`;

function Price({ coinId, changeMin = 1, changeDay = 1 }: Iprops) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 365;
  const { isLoading, data } = useQuery<Idata[]>(
    "chartData",
    () =>
      fetch(
        `https://api.coinpaprika.com/v1/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
      ).then((res) => res.json()),
    { refetchInterval: 5000 }
  );

  const highestObj = {
    price: 0,
    day: "",
  };
  const lowestObj = {
    price: 1000 * 1000 - 1,
    day: "",
  };

  data?.map((value) => {
    if (value.high > highestObj.price) {
      highestObj.price = value.high;
      highestObj.day = value.time_open;
    }
    if (value.low < lowestObj.price) {
      lowestObj.price = value.low;
      lowestObj.day = value.time_open;
    }
  });

  console.log(data);

  return (
    <div>
      {isLoading ? (
        "Loading price..."
      ) : (
        <div>
          <PriceDiv delay={1}>
            <span>Percent Change (last 15 Miniutes) :</span>
            <ChangeInfo>
              <ChangeSpan isPlus={changeMin > 0 ? true : false}>
                {changeMin}
              </ChangeSpan>
            </ChangeInfo>
          </PriceDiv>

          <PriceDiv delay={2}>
            <span>Percent Change (last 1 Day) :</span>
            <ChangeInfo>
              <ChangeSpan isPlus={changeDay > 0 ? true : false}>
                {changeDay}
              </ChangeSpan>
            </ChangeInfo>
          </PriceDiv>

          <PriceDiv delay={3}>
            <span>Highest day (last 1 Year) :</span>
            <PriceInfo>
              <span>{highestObj.day.slice(0, 10)}</span>
              <span>{highestObj.price.toFixed(2)}</span>
            </PriceInfo>
          </PriceDiv>

          <PriceDiv delay={4}>
            <span>Lowest day (last 1 Year) :</span>
            <PriceInfo>
              <span>{lowestObj.day.slice(0, 10)}</span>
              <span>{lowestObj.price.toFixed(2)}</span>
            </PriceInfo>
          </PriceDiv>
        </div>
      )}
    </div>
  );
}

export default Price;
