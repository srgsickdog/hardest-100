import { Box, Button, Card, Input, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";
import HorizontalStack from "../Layout/HorizontalStack";

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
  return (
    <Box
      style={{
        maxHeight: bottomSectionHeight,
        minHeight: bottomSectionHeight,
        overflow: "auto",
      }}
    >
      <Card padding={4}>
        <HorizontalStack>
          <Text fontSize={22} style={{ flex: 2 }}>
            {shortlist.length} Shortlisted Songs
          </Text>
          <Input
            style={{ flex: 1, marginRight: 8 }}
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
            style={{ flex: 0.3, marginRight: 8 }}
            colorScheme="blue"
            onClick={filterShortList}
          >
            Filter
          </Button>
          <Button
            style={{ flex: 0.3 }}
            colorScheme="blue"
            onClick={clearFilter}
          >
            Clear Filter
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
            />
          );
        })}
      </Card>
    </Box>
  );
};

export default Shortlist;
