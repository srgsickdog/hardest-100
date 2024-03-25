import {
  Button,
  Card,
  Grid,
  GridItem,
  Input,
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

interface HomeProps {
  accessToken: string;
}

const Home: React.FC<HomeProps> = ({ accessToken }) => {
  const [randomHeading, setRandomHeading] = useState("");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");
  const [topTen, setTopTen] = useState<Array<any>>([]);
  const [username, setUserName] = useState("");
  const [showTopVotes, setShowTopVotes] = useState(false);
  const [showSpotifySearch, setShowStoptifySearch] = useState(true);
  const [bottomSectionHeight, setBottomSectionHeight] = useState("50vh");

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

  const removeFromShortlist = async (songId: string) => {
    await deleteSongFromShortList(songId);
    callShortListedSongs();
  };

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
    const newTopTenIndexed = newTopTen.map((song, index) => {
      return { id: song.id, position: index };
    });
    const sorted = sortSongsAscending(newTopTenIndexed);
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
    setShortlistFilterValue("");
    const response = await getShortListedSongs();
    setShortlist(response);
  };

  useEffect(() => {
    const sorted = sortSongsAscending(topTen);
    setTopTen(sorted);
    submitVotes();
  }, [topTen]);

  function sortSongsAscending(songs: any) {
    songs.sort((a: any, b: any) => a.position - b.position);
    return songs;
  }
  return (
    <div style={{ height: "96vh" }}>
      <Grid
        h="100%"
        templateRows="repeat(6, 1fr) 2fr" // Adjusted row sizes
        templateColumns="1fr 1fr"
        style={{ height: "100%" }}
      >
        <GridItem rowSpan={1} colSpan={2} margin={2}>
          <Card padding={4}>
            <Text fontSize={30} textAlign={"center"}>
              {randomHeading}
            </Text>
            <Text fontSize={22}>Enter Code To get your votes</Text>
            <Stack direction="row" flex={1}>
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
        </GridItem>
        {showSpotifySearch && (
          <GridItem
            rowSpan={1}
            colSpan={2}
            style={{
              overflow: "auto",
              borderRadius: "10px",
              minHeight: "300px",
            }}
            margin={2}
            bg={"white"}
          >
            <SpotifySearch
              accessToken={accessToken}
              updateShortList={callShortListedSongs}
            />
          </GridItem>
        )}
        <GridItem
          rowSpan={showSpotifySearch ? 5 : 6}
          colSpan={1}
          style={{ overflow: "auto" }}
          margin={2}
        >
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
        </GridItem>
        <GridItem
          rowSpan={showSpotifySearch ? 5 : 6}
          colSpan={1}
          style={{ overflow: "auto" }}
          margin={2}
        >
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
        </GridItem>
      </Grid>
    </div>
  );
};

export default Home;
