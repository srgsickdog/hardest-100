import { CloseIcon } from "@chakra-ui/icons";
import {
  Stack,
  Text,
  Card,
  Button,
  Box,
  Image,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";

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
    setIsPlaying(!isPlaying);
  };
  return (
    <Card padding={4} marginY={2}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          {showPosition && (
            <Text fontSize={22} color="grey">
              {position}
            </Text>
          )}
          <Text
            fontSize={20}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "330px", // Adjust the value according to your requirement
            }}
          >
            {songDetails.name}
          </Text>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-around"}
          >
            <Text
              fontSize={15}
              color="grey"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "120px", // Adjust the value according to your requirement
              }}
            >
              {songDetails.artists[0].name}
            </Text>
            <Text
              fontSize={15}
              color="grey"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "135px", // Adjust the value according to your requirement
              }}
            >
              {songDetails.album.name}
            </Text>
            <Text fontSize={15} color="grey">
              {songDetails.album.release_date}
            </Text>
          </Stack>
        </Box>
        <Stack direction="row">
          <Image
            src={songDetails.album.images[0].url}
            alt={songDetails.album.name}
            style={{ maxWidth: "50px", minWidth: "50px", maxHeight: "50px" }}
          />
          {showRemove && (
            <IconButton
              aria-label="Remove"
              icon={<CloseIcon />}
              onClick={() => removeFunction(songId)}
            />
          )}
        </Stack>
      </Stack>
      {songDetails.preview_url !== null && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <audio controls>
            <source src={songDetails.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {showAddtoVotes && (
        <Button
          colorScheme="blue"
          onClick={() => addToTopTen(songId)}
          marginY={2}
        >
          Add to your votes
        </Button>
      )}
    </Card>
  );
};

export default ShortlisedSong;
