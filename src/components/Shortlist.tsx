import { Card, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";

interface ShortlistProps {
  accessToken: string;
  shortlist: Array<any>;
  removeFromShortlist: any;
  addToTopTen: any;
}

const Shortlist: React.FC<ShortlistProps> = ({
  accessToken,
  shortlist,
  removeFromShortlist,
  addToTopTen,
}) => {
  return (
    <div style={{ maxHeight: "65vh", overflow: "auto" }}>
      <Card padding={4}>
        <Text fontSize={22}>Shortlisted Songs</Text>
        {shortlist.map((songId) => {
          return (
            <SingleSong
              key={songId}
              songId={songId}
              accessToken={accessToken}
              showRemove={true}
              removeFunction={removeFromShortlist}
              addToTopTen={addToTopTen}
              showAddtoVotes={true}
            />
          );
        })}
      </Card>
    </div>
  );
};

export default Shortlist;
