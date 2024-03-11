import { Stack, Text, Card, Button } from "@chakra-ui/react";
import { useState } from "react";

interface SongResultProps {
  song: {
    id: React.Key;
    name: string;
    release_date: string;
    preview_url: string;
  };
  artist?: string;
  album?: string;
  albumReleaseDate?: string;
  addToShortList: any;
}

const SongResult: React.FC<SongResultProps> = ({
  song,
  addToShortList,
  artist,
  album,
  albumReleaseDate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  return (
    <Card marginY={8} padding={4} style={{ display: "flex" }}>
      <Stack direction="row" style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text fontSize={22}>{song.name}</Text>
          {artist && (
            <Text fontSize={18} color="grey">
              {artist}
            </Text>
          )}
          {album && (
            <Text fontSize={18} color="grey">
              {album}
            </Text>
          )}
          {albumReleaseDate && (
            <Text fontSize={18} color="grey">
              {albumReleaseDate.substring(0, 4)}
            </Text>
          )}
        </div>
      </Stack>
      <Button
        colorScheme="blue"
        onClick={() => addToShortList(song.id)}
        marginY={2}
      >
        Add To Shortlist
      </Button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <audio controls>
          <source src={song.preview_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </Card>
  );
};

export default SongResult;
