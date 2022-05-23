import { Route, Switch, useParams } from "react-router";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { Link, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "./atom";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface Params {
  coinId: string;
}

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
  font-size: 30px;
  font-weight: 600;
`;

const InfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const InfoDivItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  color: ${(props) => props.theme.textColor};
  margin: 40px 0;
  font-size: 17px;
  line-height: 22px;
`;

const Loading = styled.h1`
  font-size: 30px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 30px 0px;
  gap: 30px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 11px;
  border-radius: 11px;
  color: ${(props) => (props.isActive ? "violet" : props.theme.textColor)};
  a {
    display: block;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  button {
    appearance: none;
    padding: 10px 15px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
  }
`;

function Coin() {
  const { coinId } = useParams<Params>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");

  const { isLoading: infoLoading, data: info } = useQuery<IInfoData>(
    "infoData",
    () =>
      fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`).then((res) =>
        res.json()
      ),
    { refetchInterval: 5000 }
  );

  const { isLoading: priceLoading, data: priceInfo } = useQuery<IPriceData>(
    "priceData",
    () =>
      fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`).then((res) =>
        res.json()
      ),
    { refetchInterval: 5000 }
  );

  const [isDark, isDarkFn] = useRecoilState(isDarkAtom);
  const toggleFn = () => isDarkFn((prev) => !prev);

  return infoLoading || priceLoading ? (
    <Loading>
      <span>Loading...</span>
    </Loading>
  ) : (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>{priceInfo?.id}</title>
        </Helmet>
      </HelmetProvider>

      <Top>
        <button>
          <Link to="/">Home</Link>
        </button>
        <button onClick={toggleFn}>
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </Top>

      <Header>
        <Title>{priceInfo?.id}</Title>
      </Header>

      <InfoDiv>
        <InfoDivItem>
          <span>RANK :</span>
          <span>{info?.rank}</span>
        </InfoDivItem>
        <InfoDivItem>
          <span>SYMBOL :</span>
          <span>${info?.symbol}</span>
        </InfoDivItem>
        <InfoDivItem>
          <span>PRICE :</span>
          <span>{priceInfo?.quotes.USD.price.toFixed(0)}</span>
        </InfoDivItem>
      </InfoDiv>

      <Description>{info?.description}</Description>

      <InfoDiv>
        <InfoDivItem>
          <span>TOTAL_SUPPLY :</span>
          <span>{priceInfo?.total_supply}</span>
        </InfoDivItem>
        <InfoDivItem>
          <span>MAX_SUPPLY :</span>
          <span>{priceInfo?.max_supply}</span>
        </InfoDivItem>
      </InfoDiv>

      <Tabs>
        <Tab isActive={chartMatch !== null}>
          <Link to={`/${coinId}/chart`}>Chart</Link>
        </Tab>
        <Tab isActive={priceMatch !== null}>
          <Link to={`/${coinId}/price`}>Price</Link>
        </Tab>
      </Tabs>

      <Switch>
        <Route path={`/${coinId}/price`}>
          <Price
            coinId={coinId}
            changeMin={priceInfo?.quotes.USD.percent_change_15m}
            changeDay={priceInfo?.quotes.USD.percent_change_24h}
          />
        </Route>
        <Route path={`/${coinId}/chart`}>
          <Chart coinId={coinId} />
        </Route>
      </Switch>
    </Container>
  );
}

export default Coin;
