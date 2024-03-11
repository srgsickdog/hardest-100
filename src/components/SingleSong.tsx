import { Stack, Text, Card, Button, Box, Image } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface ShortlistedSongProps {
  accessToken: string;
  songId: string;
}

const ShortlisedSong: React.FC<ShortlistedSongProps> = ({
  accessToken,
  songId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songDetails, setSongDetails] = useState<{
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      release_date: string;
      images: Array<{ url: string }>;
    };
  }>({
    name: "",
    artists: [{ name: "" }],
    album: { name: "", release_date: "", images: [{ url: "" }] },
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
    <Card padding={4} marginY={2} height={75}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Text fontSize={20}>{songDetails.name}</Text>
          <Stack direction="row" alignItems="center">
            <Text fontSize={15} color="grey">
              {songDetails.artists[0].name} |
            </Text>
            <Text fontSize={15} color="grey">
              {songDetails.album.name} |
            </Text>
            <Text fontSize={15} color="grey">
              {songDetails.album.release_date}
            </Text>
          </Stack>
        </Box>

        <Image
          src={songDetails.album.images[0].url}
          alt={songDetails.album.name}
          style={{ maxWidth: "50px", minWidth: "50px" }}
        />
      </Stack>
    </Card>
    // <Card marginY={8} padding={4} style={{ display: "flex" }}>
    //   <Stack direction="row" style={{ flex: 1 }}>
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //       }}
    //     >
    //       <Text fontSize={22}>{song.name}</Text>
    //       {artist && (
    //         <Text fontSize={18} color="grey">
    //           {artist}
    //         </Text>
    //       )}
    //       {album && (
    //         <Text fontSize={18} color="grey">
    //           {album}
    //         </Text>
    //       )}
    //       {albumReleaseDate && (
    //         <Text fontSize={18} color="grey">
    //           {albumReleaseDate.substring(0, 4)}
    //         </Text>
    //       )}
    //     </div>
    //   </Stack>
    //   <Button
    //     colorScheme="blue"
    //     onClick={() => addToShortList(song.id)}
    //     marginY={2}
    //   >
    //     Add To Shortlist
    //   </Button>
    //   <div style={{ display: "flex", justifyContent: "center" }}>
    //     <audio controls>
    //       <source src={song.preview_url} type="audio/mpeg" />
    //       Your browser does not support the audio element.
    //     </audio>
    //   </div>
    // </Card>
  );
};

export default ShortlisedSong;
