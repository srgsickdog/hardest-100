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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

interface ShortlistedSongProps {
  accessToken: string;
  songId: string;
  showRemove?: boolean;
  removeFunction?: any;
  setTopTen?: any;
  addToTopTen?: any;
  showAddtoVotes?: boolean;
  showPosition?: boolean;
  position?: number;
}

const ShortlisedSong: React.FC<ShortlistedSongProps> = ({
  accessToken,
  songId,
  showRemove = false,
  removeFunction,
  setTopTen,
  addToTopTen,
  showAddtoVotes = false,
  showPosition = false,
  position,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playId, setPlayId] = useState(`audioPlayer${songId}`);
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

  useEffect(() => {
    const getSongDetailsCall = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSongDetails(response.data);
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    getSongDetailsCall();
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

  return (
    <Card padding={2} marginY={2}>
      <Stack direction="row" justifyContent="space-between">
        <Box style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
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
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {songDetails.preview_url !== null && (
                <div
                  onClick={togglePlay}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    rightIcon={!isPlaying ? <FaPlay /> : <FaPause />}
                    onClick={() => togglePlay()}
                    marginRight={2}
                  >
                    Song Preview
                  </Button>
                </div>
              )}
              {songDetails.preview_url !== null && (
                <div style={{ display: "none" }}>
                  <audio id={playId} controls>
                    <source src={songDetails.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              {showAddtoVotes && (
                // <Button
                //   colorScheme="blue"
                //   onClick={() => addToTopTen(songId)}
                //   marginY={2}
                // >
                //   Add to your votes
                // </Button>
                <IconButton
                  aria-label="Add to votes"
                  icon={<FaPlus />}
                  onClick={() => addToTopTen(songId)}
                  colorScheme="blue"
                  marginRight={2}
                />
              )}
              {showRemove && (
                <IconButton
                  aria-label="Remove"
                  icon={<CloseIcon />}
                  onClick={() => removeFunction(songId)}
                />
              )}
            </div>
          </div>
        </Box>
      </Stack>
    </Card>
  );
};

export default ShortlisedSong;
