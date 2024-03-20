import { Box, Button, Card, Input, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";
import HorizontalStack from "../Layout/HorizontalStack";
import { useState } from "react";

interface ShortlistProps {
  accessToken: string;
  shortlist: Array<any>;
  removeFromShortlist: any;
  addToTopTen: any;
  shortListFilterValue: string;
  setShortlistFilterValue: React.Dispatch<React.SetStateAction<string>>;
  filterShortList: any;
  clearFilter: any;
  bottomSectionHeight: string;
}

const Shortlist: React.FC<ShortlistProps> = ({
  accessToken,
  shortlist,
  removeFromShortlist,
  addToTopTen,
  shortListFilterValue,
  setShortlistFilterValue,
  filterShortList,
  clearFilter,
  bottomSectionHeight,
}) => {
  const [miniView, setMiniView] = useState(true);
  return (
    <Box>
      <Card padding={4}>
        <HorizontalStack>
          <Text fontSize={22} style={{ flex: 2 }}>
            {shortlist.length} Shortlisted Songs
          </Text>
          <Input
            style={{ flex: 1, marginRight: 4 }}
            placeholder="filter"
            value={shortListFilterValue}
            onChange={(e) => setShortlistFilterValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                filterShortList();
              }
            }}
          />
          <Button
            style={{ flex: 0.3, marginRight: 4 }}
            colorScheme="blue"
            onClick={filterShortList}
          >
            Filter
          </Button>
          <Button
            style={{ marginRight: 4 }}
            colorScheme="blue"
            onClick={clearFilter}
          >
            Clear Filter
          </Button>
          <Button onClick={() => setMiniView(!miniView)} colorScheme="blue">
            Toggle Mini View
          </Button>
        </HorizontalStack>

        {shortlist.map((song) => {
          return (
            <SingleSong
              key={song.id}
              song={song}
              accessToken={accessToken}
              showRemove={true}
              removeFunction={removeFromShortlist}
              addToTopTen={addToTopTen}
              showAddtoVotes={true}
              miniView={miniView}
            />
          );
        })}
      </Card>
    </Box>
  );
};

export default Shortlist;
