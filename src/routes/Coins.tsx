import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { isDarkAtom } from "./atom";

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
  font-size: 35px;
  font-weight: 600;
`;

const CoinList = styled.ul``;

const CoinLi = styled.li`
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: 450;
  background-color: rgba(0, 0, 0, 0.5);
  &:hover {
    cursor: pointer;
    a {
      color: ${(props) => props.theme.liColor};
    }
  }
`;

const Loading = styled.h1`
  font-size: 30px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Coins() {
  const { isLoading, data } = useQuery<CoinInterface[]>("repoData", () =>
    fetch("https://api.coinpaprika.com/v1/coins").then((res) => res.json())
  );

  const [isDark, isDarkFn] = useRecoilState(isDarkAtom);
  const toggleFn = () => isDarkFn((prev) => !prev);

  return isLoading ? (
    <Loading>
      <span>Loading...</span>
    </Loading>
  ) : (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>Coins</title>
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
        <Title>코인</Title>
      </Header>

      <CoinList>
        {data?.slice(0, 100).map((coin) => (
          <CoinLi key={coin.id}>
            <Link
              to={{
                pathname: `/${coin.id}`,
                state: { name: coin.name },
              }}
            >
              {coin.name} &rarr;
            </Link>
          </CoinLi>
        ))}
      </CoinList>
    </Container>
  );
}

export default Coins;
