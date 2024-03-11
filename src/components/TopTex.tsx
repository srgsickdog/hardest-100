import { Box, Button, Card, Stack, Text } from "@chakra-ui/react";
import SingleSong from "./SingleSong";

interface TopTenProps {
  accessToken: string;
  topTen: Array<any>;
  submitVotes: any;
}

const points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const TopTen: React.FC<TopTenProps> = ({
  accessToken,
  topTen,
  submitVotes,
}) => {
  return (
    <Card padding={4}>
      <Stack direction="row" justifyContent="space-between">
        <Text fontSize="4xl">Current Votes</Text>
        <Button onClick={submitVotes} colorScheme="blue">
          Save Votes
        </Button>
      </Stack>
      {topTen.map((songId, index) => {
        return (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            key={songId}
          >
            <Text flex={1} fontSize={18} textAlign="center">
              {points[index]} Points
            </Text>
            <Box flex={10}>
              <SingleSong songId={songId} accessToken={accessToken} />
            </Box>
          </Stack>
        );
      })}
    </Card>
  );
};

export default TopTen;
