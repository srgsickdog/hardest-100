import { Stack, Text, Card, Button } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

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
  const [playId, setPlayId] = useState(`audioPlayer${song.id}`);
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
    <Card
      marginY={2}
      padding={2}
      style={{ display: "flex" }}
      variant={"outline"}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text fontSize={17}>{song.name}</Text>
        <div style={{ display: "flex" }}>
          {song.preview_url !== null && (
            <div
              onClick={togglePlay}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                rightIcon={!isPlaying ? <FaPlay /> : <FaPause />}
                onClick={() => togglePlay()}
                marginRight={4}
              >
                Song Preview
              </Button>
            </div>
          )}
          {song.preview_url !== null && (
            <div style={{ display: "none" }}>
              <audio id={playId} controls>
                <source src={song.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          <Button
            colorScheme="blue"
            onClick={() => addToShortList(song.id, song.name)}
            marginY={2}
          >
            Add To Shortlist
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {artist && (
          <Text fontSize={15} color="grey" style={{ marginRight: "0.2rem" }}>
            {artist},
          </Text>
        )}
        {album && (
          <Text fontSize={15} color="grey" style={{ marginRight: "0.2rem" }}>
            {album},
          </Text>
        )}
        {albumReleaseDate && (
          <Text fontSize={15} color="grey">
            {albumReleaseDate.substring(0, 4)}
          </Text>
        )}
      </div>
    </Card>
  );
};

export default SongResult;
