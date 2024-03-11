import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  //@ts-ignore
} from "react-beautiful-dnd";
import SingleSong from "./SingleSong";

interface Item {
  id: string;
  content: string;
}

interface TopTenProps {
  accessToken: string;
  topTen: Array<any>;
  submitVotes: any;
  removeSongFromTopTen: any;
  setTopTen: any;
}

const TopTen: React.FC<TopTenProps> = ({
  accessToken,
  topTen,
  submitVotes,
  removeSongFromTopTen,
  setTopTen,
}) => {
  const handleDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const reorderedItems = Array.from(topTen);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);
    console.log("reorderedItems: ", reorderedItems);
    reorderedItems.forEach((item, index) => {
      item.position = index;
    });

    setTopTen(reorderedItems);
  };

  return (
    <div style={{ maxHeight: "65vh", overflow: "auto", minHeight: "65vh" }}>
      <Card padding={4} variant={"outline"}>
        <Stack direction="row" justifyContent="space-between">
          <Text fontSize={22}>Current Votes</Text>
          {/* <Button onClick={submitVotes} colorScheme="blue">
          Save Votes
        </Button> */}
        </Stack>
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
                          songId={song.id}
                          accessToken={accessToken}
                          showRemove={true}
                          removeFunction={removeSongFromTopTen}
                          setTopTen={setTopTen}
                          showAddtoVotes={false}
                          showPosition={true}
                          position={index + 1}
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
    </div>
  );
};

export default TopTen;
