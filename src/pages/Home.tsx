import { Box, Button, Input, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import SpotifySearch from "../components/SpotifySearch";
import Shortlist from "../components/Shortlist";
import { useEffect, useState } from "react";
import axios from "axios";
import { getShortListedSongs, getTopTen } from "../firebase/firebaseFunctions";
import TopTen from "../components/TopTex";

const CLIENT_ID = "d9f86c8c80f64a639f2cf4dfe67d5ce5";
const CLIENT_SECRET = "6f66d41dc20c4bd4897f9e5065995c2b";

const Home = () => {
  const [accessToken, setAccessToken] = useState("");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");
  const [topTen, setTopTen] = useState<Array<any>>([]);

  const callShortListedSongs = async () => {
    const response = await getShortListedSongs();
    setShortlist(response);
  };

  useEffect(() => {
    callShortListedSongs();
  }, []);

  useEffect(() => {
    const checkSpotify = async () => {
      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {}
    };
    checkSpotify();
  }, []);

  const handleGetTopTen = async () => {
    const response = await getTopTen(codeInput);
    setTopTen(response.songIds);
  };
  const submitVotes = async () => {
    console.log("submit votes: ");
  };
  return (
    <>
      <Text marginX={8} fontSize={30}>
        Enter Code To get your top ten
      </Text>
      <Stack direction="row" marginY={2} marginX={8} width={500}>
        <Input
          placeholder="Enter Code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGetTopTen();
            }
          }}
        />
        <Button colorScheme="blue" onClick={handleGetTopTen}>
          Search
        </Button>
      </Stack>
      <SimpleGrid columns={3} spacing={5} padding={8}>
        <SpotifySearch
          accessToken={accessToken}
          updateShortList={callShortListedSongs}
        />
        <Shortlist shortlist={shortlist} accessToken={accessToken} />
        <TopTen
          topTen={topTen}
          accessToken={accessToken}
          submitVotes={submitVotes}
        />
      </SimpleGrid>
    </>
  );
};

export default Home;
