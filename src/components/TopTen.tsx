import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  //@ts-ignore
} from "react-beautiful-dnd";
import SingleSong from "./SingleSong";
import HorizontalStack from "../Layout/HorizontalStack";

interface TopTenProps {
  accessToken: string;
  topTen: Array<any>;
  submitVotes: any;
  removeSongFromTopTen: any;
  setTopTen: any;
  bottomSectionHeight: string;
}

const TopTen: React.FC<TopTenProps> = ({
  accessToken,
  topTen,
  submitVotes,
  removeSongFromTopTen,
  setTopTen,
  bottomSectionHeight,
}) => {
  const [miniView, setMiniView] = useState(false);
  const handleDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const reorderedItems = Array.from(topTen);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    reorderedItems.forEach((item, index) => {
      item.position = index;
    });

    setTopTen(reorderedItems);
  };

  return (
    <Card padding={4} variant={"outline"}>
      <HorizontalStack style={{ marginBottom: "2px" }}>
        <Text fontSize={22} marginRight={8}>
          Current Votes
        </Text>
        <Button onClick={() => setMiniView(!miniView)} colorScheme="blue">
          Toggle Mini View
        </Button>
      </HorizontalStack>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {topTen.map((song, index) => (
                <Draggable key={song.id} draggableId={song.id} index={index}>
                  {(provided: any) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SingleSong
                        song={song}
                        accessToken={accessToken}
                        showRemove={true}
                        removeFunction={removeSongFromTopTen}
                        setTopTen={setTopTen}
                        showAddtoVotes={false}
                        showPosition={true}
                        position={index + 1}
                        showUrl={true}
                        miniView={miniView}
                        showYoutubeWarning={true}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
};

export default TopTen;
