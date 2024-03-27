import { Box, Button, Card, Input, Text, Image, Stack } from "@chakra-ui/react";
import HorizontalStack from "../Layout/HorizontalStack";
import { fetchSongDetails } from "../api/spotifyCalls";
import { useEffect, useState } from "react";

interface RankedSongResultProps {
  accessToken: string;
  result: {
    details: Array<any>;
    points: number;
    song: {
      name: string;
      id: string;
    };
  };
}

const RankedSongResult: React.FC<RankedSongResultProps> = ({
  accessToken,
  result,
}) => {
  const [songDetails, setSongDetails] = useState({
    name: "",
    album: { images: [{ url: "" }], name: "", release_date: "" },
    artists: [{ name: "" }],
  });
  const [loading, setLoading] = useState(true);

  const getSongDetails = async () => {
    const response = await fetchSongDetails(accessToken, result.song.id);
    setSongDetails(response);
    setLoading(false);
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
      {!loading && songDetails && (
        <Card margin={1} padding={1}>
          <HorizontalStack style={{ marginBottom: 2 }}>
            <Image
              src={songDetails.album.images[0].url}
              alt={songDetails.album.name}
              style={{
                maxWidth: "50px",
                minWidth: "50px",
                maxHeight: "50px",
                marginRight: "1rem",
                borderRadius: "5px",
              }}
            />
            <HorizontalStack
              style={{ justifyContent: "space-between", flex: 1 }}
            >
              <Box>
                <Text fontSize={18}>{songDetails.name}</Text>
                <Text fontSize={12} color={"grey"}>
                  {result.points} points
                </Text>
              </Box>
              <Text fontSize={12} color="grey" marginX={2}>
                {songDetails.artists[0].name}
              </Text>
            </HorizontalStack>
          </HorizontalStack>
          <hr />
          {result.details.map((detail: any, index) => {
            return (
              <Card marginY={1} width={"10%"} key={index}>
                <HorizontalStack>
                  <Text marginRight={2} width={100}>
                    {detail.voterName}:{" "}
                  </Text>
                  <Text>{getPositionSuffix(detail.position + 1)}</Text>
                </HorizontalStack>
              </Card>
            );
          })}
        </Card>
      )}
    </>
  );
};

export default RankedSongResult;
