import { CloseIcon } from "@chakra-ui/icons";
import {
  Stack,
  Text,
  Card,
  Button,
  Box,
  Image,
  IconButton,
  Icon,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  setYoutubeUrl,
  getShortlistedSong,
} from "../firebase/firebaseFunctions";
import { fetchSongDetails } from "../api/spotifyCalls";
import HorizontalStack from "../Layout/HorizontalStack";

interface ShortlistedSongProps {
  accessToken: string;
  song: any;
  showRemove?: boolean;
  removeFunction?: any;
  setTopTen?: any;
  addToTopTen?: any;
  showAddtoVotes?: boolean;
  showPosition?: boolean;
  position?: number;
  showUrl?: boolean;
}

const ShortlistedSong: React.FC<ShortlistedSongProps> = ({
  accessToken,
  song,
  showRemove = false,
  removeFunction,
  setTopTen,
  addToTopTen,
  showAddtoVotes = false,
  showPosition = false,
  showUrl = false,
  position,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playId, setPlayId] = useState(`audioPlayer${song.id}`);
  const [songDetails, setSongDetails] = useState<{
    name: string;
    artists: Array<{ name: string }>;
    preview_url: string | null;
    album: {
      name: string;
      release_date: string;
      images: Array<{ url: string }>;
    };
  }>({
    name: "",
    artists: [{ name: "" }],
    album: { name: "", release_date: "", images: [{ url: "" }] },
    preview_url: null,
  });
  const [finishedSongDetailsFetch, setFinishedSongDetailsFetch] =
    useState(false);
  const [youtubeUrlValue, setYoutubeUrlValue] = useState("");

  const getSongDetails = async () => {
    const response = await fetchSongDetails(accessToken, song.id);
    setSongDetails(response);
    setFinishedSongDetailsFetch(true);
  };
  const getYoutubeUrl = async () => {
    const response = await getShortlistedSong(song.id);
    if (response) {
      if (response.youtubeUrl) {
        setYoutubeUrlValue(response.youtubeUrl);
      }
    }
  };

  useEffect(() => {
    getSongDetails();
    getYoutubeUrl();
  }, []);

  const togglePlay = () => {
    const audioElement = document.getElementById(playId) as HTMLAudioElement;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSetYoutubeUrl = async () => {
    const response = await setYoutubeUrl(
      song.id,
      youtubeUrlValue,
      songDetails.name
    );
  };

  return (
    <>
      {finishedSongDetailsFetch ? (
        <Card padding={2} marginY={2}>
          <Stack direction="row" justifyContent="space-between">
            <Box style={{ flex: 1 }}>
              <HorizontalStack style={{ justifyContent: "space-between" }}>
                <HorizontalStack>
                  {showPosition && (
                    <Text fontSize={22} color="grey" marginRight={4}>
                      {position}
                    </Text>
                  )}
                  <Image
                    src={songDetails.album.images[0].url}
                    alt={songDetails.album.name}
                    style={{
                      maxWidth: "50px",
                      minWidth: "50px",
                      maxHeight: "50px",
                      marginRight: "1rem",
                    }}
                  />
                  <div>
                    <Text fontSize={20}>{songDetails.name}</Text>
                    <Stack direction="row" alignItems="center">
                      <Text fontSize={15} color="grey">
                        {songDetails.artists[0].name}
                      </Text>
                      <Text fontSize={15} color="grey">
                        {songDetails.album.name}
                      </Text>
                      <Text fontSize={15} color="grey">
                        {songDetails.album.release_date}
                      </Text>
                    </Stack>
                  </div>
                </HorizontalStack>
                <HorizontalStack>
                  {songDetails.preview_url !== null && (
                    <Box onClick={togglePlay}>
                      <HorizontalStack>
                        <Button
                          rightIcon={!isPlaying ? <FaPlay /> : <FaPause />}
                          onClick={() => togglePlay()}
                          marginRight={2}
                        >
                          Song Preview
                        </Button>
                      </HorizontalStack>
                    </Box>
                  )}
                  {songDetails.preview_url !== null && (
                    <div style={{ display: "none" }}>
                      <audio id={playId} controls>
                        <source
                          src={songDetails.preview_url}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {showAddtoVotes && (
                    <IconButton
                      aria-label="Add to votes"
                      icon={<FaPlus />}
                      onClick={() => addToTopTen(song.id)}
                      colorScheme="blue"
                      marginRight={2}
                    />
                  )}
                  {showRemove && (
                    <IconButton
                      aria-label="Remove"
                      icon={<CloseIcon />}
                      onClick={() => removeFunction(song.id)}
                    />
                  )}
                </HorizontalStack>
              </HorizontalStack>
              {showUrl && (
                <HorizontalStack
                  style={{ marginTop: 4, justifyContent: "space-between" }}
                >
                  <Input
                    placeholder="Enter Youtube URL"
                    value={youtubeUrlValue}
                    onChange={(e) => setYoutubeUrlValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSetYoutubeUrl();
                      }
                    }}
                    maxWidth={500}
                    marginRight={4}
                  />
                  <Button colorScheme="blue" onClick={handleSetYoutubeUrl}>
                    Save Youtube URL
                  </Button>
                </HorizontalStack>
              )}
            </Box>
          </Stack>
        </Card>
      ) : null}
    </>
  );
};

export default ShortlistedSong;
