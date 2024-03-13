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
import {
  getShortListedSongs,
  getTopTen,
  deleteSongFromShortList,
  submitVotesCall,
} from "../firebase/firebaseFunctions";
import { fetchSpotifyToken } from "../api/spotifyCalls";
import { headings } from "../heading";

import TopTen from "../components/TopTen";

const Home = () => {
  const [randomHeading, setRandomHeading] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");
  const [topTen, setTopTen] = useState<Array<any>>([]);
  const [username, setUserName] = useState("");
  const [showTopVotes, setShowTopVotes] = useState(false);
  const [showSpotifySearch, setShowStoptifySearch] = useState(true);
  const [bottomSectionHeight, setBottomSectionHeight] = useState("50vh");

  const [accessTokenFetched, setAccessTokenFetched] = useState(false);
  const [shortlistFilterValue, setShortlistFilterValue] = useState("");

  const callShortListedSongs = async () => {
    const response = await getShortListedSongs();
    setShortlist(response);
  };

  useEffect(() => {
    callShortListedSongs();
  }, []);

  const getRandomHeading = () => {
    const randomIndex = Math.floor(Math.random() * headings.length);
    return headings[randomIndex];
  };
  useEffect(() => {
    setRandomHeading(getRandomHeading());
  }, []);

  const getSpotifyToken = async () => {
    const token = await fetchSpotifyToken();
    setAccessToken(token);
    setAccessTokenFetched(true);
  };

  useEffect(() => {
    getSpotifyToken();
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

  const filterShortList = async () => {
    const listToSearch = await getShortListedSongs();
    const newList = listToSearch.filter(
      (item: any) =>
        item.name !== undefined &&
        item.name.toLowerCase().includes(shortlistFilterValue.toLowerCase())
    );
    setShortlist(newList);
  };
  const clearFilter = async () => {
    const response = await getShortListedSongs();
    setShortlist(response);
  };

  useEffect(() => {
    const sorted = sortSongsAscending(topTen);
    setTopTen(sorted);
    submitVotes();
  }, [topTen]);
  // style={{ maxHeight: "15vh", minHeight: "" }}
  return (
    <>
      <Box paddingY={1}>
        <Card marginX={8} padding={4} marginBottom={2}>
          <Text fontSize={30} textAlign={"center"}>
            {randomHeading}
          </Text>
        </Card>
        <Card marginX={8} padding={4}>
          <Text marginX={8} fontSize={22}>
            Enter Code To get your top ten
          </Text>
          <Stack direction="row" marginX={8} flex={1}>
            <Input
              placeholder="Enter Code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGetTopTen();
                }
              }}
              maxWidth={500}
            />
            <Button colorScheme="blue" onClick={handleGetTopTen}>
              Search
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                setShowStoptifySearch(!showSpotifySearch);

                showSpotifySearch
                  ? setBottomSectionHeight("75vh")
                  : setBottomSectionHeight("50svh");
              }}
            >
              {showSpotifySearch ? "Hide" : "Show"} Spotify Search Panel
            </Button>
          </Stack>
        </Card>
      </Box>
      {showSpotifySearch && (
        <Box marginX={8} paddingY={1}>
          <SpotifySearch
            accessToken={accessToken}
            updateShortList={callShortListedSongs}
          />
        </Box>
      )}
      {accessTokenFetched && (
        <Box paddingY={1}>
          <SimpleGrid columns={2} spacing={5} paddingX={8}>
            <Shortlist
              shortlist={shortlist}
              accessToken={accessToken}
              removeFromShortlist={removeFromShortlist}
              addToTopTen={addToTopTen}
              shortListFilterValue={shortlistFilterValue}
              setShortlistFilterValue={setShortlistFilterValue}
              filterShortList={filterShortList}
              clearFilter={clearFilter}
              bottomSectionHeight={bottomSectionHeight}
            />
            {showTopVotes ? (
              <TopTen
                submitVotes={submitVotes}
                topTen={topTen}
                accessToken={accessToken}
                removeSongFromTopTen={removeSongFromTopTen}
                setTopTen={setTopTen}
                bottomSectionHeight={bottomSectionHeight}
              />
            ) : (
              <Text fontSize={30}>
                Enter Your code in top right to add songs to your top votes
              </Text>
            )}
          </SimpleGrid>
        </Box>
      )}
    </>
  );
};

export default Home;
