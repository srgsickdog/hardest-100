import {
  Box,
  Button,
  Card,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import SpotifySearch from "../components/SpotifySearch";
import Shortlist from "../components/Shortlist";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  getShortListedSongs,
  getTopTen,
  deleteSongFromShortList,
  submitVotesCall,
} from "../firebase/firebaseFunctions";
import TopTen from "../components/TopTen";
const CLIENT_ID = "d9f86c8c80f64a639f2cf4dfe67d5ce5";
const CLIENT_SECRET = "6f66d41dc20c4bd4897f9e5065995c2b";

const Home = () => {
  const [accessToken, setAccessToken] = useState("");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");
  const [topTen, setTopTen] = useState<Array<any>>([]);
  const [username, setUserName] = useState("");
  const [showTopVotes, setShowTopVotes] = useState(false);

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

  const removeFromShortlist = async (songId: string) => {
    await deleteSongFromShortList(songId);
    callShortListedSongs();
  };

  function sortSongsAscending(songs: any) {
    songs.sort((a: any, b: any) => a.position - b.position);
    return songs;
  }

  const handleGetTopTen = async () => {
    const response = await getTopTen(codeInput);
    const sorted = sortSongsAscending(response.songs);
    setTopTen(sorted);
    setUserName(response.personName);
    setShowTopVotes(true);
  };
  const submitVotes = async () => {
    const response = await submitVotesCall(topTen, username);
  };
  const removeSongFromTopTen = async (songId: string) => {
    const newTopTen = topTen.filter((song) => song.id !== songId);
    const sorted = sortSongsAscending(newTopTen);
    setTopTen(sorted);
  };
  const addToTopTen = (songId: string) => {
    // don't add duplicate ids
    if (topTen.some((song) => song.id === songId)) {
      return;
    }
    const newTopTen = [...topTen, { id: songId, position: topTen.length }];
    const sorted = sortSongsAscending(newTopTen);
    setTopTen(sorted);
  };

  useEffect(() => {
    const sorted = sortSongsAscending(topTen);
    setTopTen(sorted);
    submitVotes();
  }, [topTen]);
  return (
    <>
      <SimpleGrid
        columns={3}
        spacing={5}
        paddingLeft={8}
        paddingTop={4}
        paddingRight={8}
        paddingBottom={4}
      >
        <Card>
          <Text marginX={8} fontSize={22}>
            Enter Code To get your top ten
          </Text>
          <Stack direction="row" marginY={2} marginX={8} maxWidth={500}>
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
        </Card>
      </SimpleGrid>
      <Box paddingX={8} paddingBottom={4}>
        <SpotifySearch
          accessToken={accessToken}
          updateShortList={callShortListedSongs}
        />
      </Box>

      <SimpleGrid columns={2} spacing={5} paddingX={8}>
        <Shortlist
          shortlist={shortlist}
          accessToken={accessToken}
          removeFromShortlist={removeFromShortlist}
          addToTopTen={addToTopTen}
        />
        {showTopVotes && (
          <TopTen
            submitVotes={submitVotes}
            topTen={topTen}
            accessToken={accessToken}
            removeSongFromTopTen={removeSongFromTopTen}
            setTopTen={setTopTen}
          />
        )}
      </SimpleGrid>
    </>
  );
};

export default Home;
