import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Results from "./pages/Results";
import { useEffect, useState } from "react";
import { fetchSpotifyToken } from "./api/spotifyCalls";
import { Text } from "@chakra-ui/react";
import AllResults from "./pages/AllResults";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getSpotifyToken = async () => {
      const token = await fetchSpotifyToken();
      setAccessToken(token);
      setLoading(false);
    };

    if (loading) {
      getSpotifyToken();
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home accessToken={accessToken} />} />
              {/* <Route
                path="results"
                element={<Results accessToken={accessToken} />}
              />
              <Route
                path="allResults"
                element={<AllResults accessToken={accessToken} />}
              /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
