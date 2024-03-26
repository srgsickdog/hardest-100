import { Card, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";
import { useEffect, useState } from "react";

interface PersonResultProps {
  personResult: any;
  accessToken: string;
  setAllSongVotes: React.Dispatch<React.SetStateAction<any>>;
}

const PersonResult: React.FC<PersonResultProps> = ({
  personResult,
  accessToken,
  setAllSongVotes,
}) => {
  const handleGetSong = async () => {};
  useEffect(() => {
    handleGetSong();
  }, []);

  return (
    <Card padding={4}>
      <Text fontSize={25}>{personResult.personName}</Text>
      <hr />
      <>
        {personResult.songs.map((song: any) => {
          return (
            <SingleSong
              key={song.id}
              accessToken={accessToken}
              song={{ id: song.id }}
              position={song.position + 1}
              miniView={true}
              showPosition
              setAllSongVotes={setAllSongVotes}
            />
          );
        })}
      </>
    </Card>
  );
};

export default PersonResult;
