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
          <div style={{ marginRight: "0.2rem" }}>
            <audio controls>
              <source src={song.preview_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <Button
            colorScheme="blue"
            onClick={() => addToShortList(song.id)}
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
