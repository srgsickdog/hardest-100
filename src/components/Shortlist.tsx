import { Card, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";

interface ShortlistProps {
  accessToken: string;
  shortlist: Array<any>;
}

const Shortlist: React.FC<ShortlistProps> = ({ accessToken, shortlist }) => {
  return (
    <Card padding={4}>
      <Text fontSize="4xl">Shortlisted Songs</Text>
      {shortlist.map((songId) => {
        return (
          <SingleSong key={songId} songId={songId} accessToken={accessToken} />
        );
      })}
    </Card>
  );
};

export default Shortlist;
