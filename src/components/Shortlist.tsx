import { Card, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";

interface ShortlistProps {
  accessToken: string;
  shortlist: Array<any>;
  removeFromShortlist: any;
}

const Shortlist: React.FC<ShortlistProps> = ({
  accessToken,
  shortlist,
  removeFromShortlist,
}) => {
  return (
    <Card padding={4}>
      <Text fontSize="4xl">Shortlisted Songs</Text>
      {shortlist.map((songId) => {
        return (
          <SingleSong
            key={songId}
            songId={songId}
            accessToken={accessToken}
            showRemove={true}
            removeFunction={removeFromShortlist}
          />
        );
      })}
    </Card>
  );
};

export default Shortlist;
