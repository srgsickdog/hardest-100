import { Card, Text, Image, Box } from "@chakra-ui/react";
import { SongDetails } from "../types/types";
import HorizontalStack from "../Layout/HorizontalStack";
import { useEffect, useState } from "react";
import { fetchSongDetails } from "../api/spotifyCalls";

interface HistorySongDetailProps {
  songDetails: SongDetails;
  currentSong: SongDetails;
  accessToken: string;
}

const HistorySongDetail: React.FC<HistorySongDetailProps> = ({
  songDetails,
  currentSong,
  accessToken,
}) => {
  const [songInfo, setSongInfo] = useState<{
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
  const currentSongPlaying = currentSong.song.id === songDetails.song.id;

  const getSongDetails = async () => {
    const response = await fetchSongDetails(accessToken, songDetails.song.id);
    setSongInfo(response);
  };

  useEffect(() => {
    getSongDetails();
  }, []);
  function getPositionSuffix(position: any) {
    const suffixes = ["st", "nd", "rd"];
    const remainder10 = position % 10;
    const remainder100 = position % 100;

    if (remainder10 === 1 && remainder100 !== 11) {
      return position + "st";
    } else if (remainder10 === 2 && remainder100 !== 12) {
      return position + "nd";
    } else if (remainder10 === 3 && remainder100 !== 13) {
      return position + "rd";
    } else {
      return position + "th";
    }
  }

  return (
    <>
      {songInfo ? (
        <Card
          padding={3}
          marginBottom={2}
          borderColor={currentSongPlaying ? "blue.300" : "gray.200"} // Border color based on currentSongPlaying
          borderWidth={currentSongPlaying ? "2px" : "1px"} // Border width based on currentSongPlaying
        >
          <HorizontalStack style={{ justifyContent: "space-between" }}>
            <Text>{songInfo.name}</Text>
            <Text fontSize={15} color="grey">
              {songInfo.artists[0].name}
            </Text>
            <Image
              src={songInfo.album.images[0].url}
              alt={songInfo.album.name}
              style={{
                maxWidth: "25px",
                minWidth: "25px",
                maxHeight: "25px",
                borderRadius: "5px",
                marginBottom: 4,
              }}
            />
          </HorizontalStack>
          <hr />
          {songDetails.details.map((detail: any, index) => {
            return (
              <Box key={index}>
                <HorizontalStack style={{ justifyContent: "space-between" }}>
                  <Text fontSize={20} color={"grey"}>
                    {detail.voterName} voted it{" "}
                  </Text>
                  <Text fontSize={20}>
                    {getPositionSuffix(detail.position + 1)}
                  </Text>
                </HorizontalStack>
              </Box>
            );
          })}
          <Text>{songDetails.points} total points</Text>
        </Card>
      ) : (
        <Text>Error</Text>
      )}
    </>
  );
};

export default HistorySongDetail;
