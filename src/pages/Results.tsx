import { useEffect, useState } from "react";
import { getResults } from "../firebase/firebaseFunctions";
import { SongDetails } from "../types/types";
import {
  Card,
  Text,
  Box,
  Grid,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import VideoPlayer from "../components/VideoPlayer";
import HorizontalStack from "../Layout/HorizontalStack";
import HistorySongDetail from "../components/HistorySongDetail";

const timerDuration = 10;

interface ResultsProps {
  accessToken: string;
}

const Results: React.FC<ResultsProps> = ({ accessToken }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SongDetails[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<SongDetails[]>([]);
  const [timer, setTimer] = useState<number | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [goToIndexinputValue, setGoToIndexInputValue] = useState("");

  const [currentSong, setCurrentSong] = useState<SongDetails>({
    song: {
      id: "",
      name: "",
      youtubeUrl: "",
    },
    points: 0,
    details: [],
    placement: "",
  });

  const handleGetResults = async () => {
    try {
      const response = await getResults();

      setResults(response);
      setCurrentSong(response[0]);

      // Check if the history already contains an element with the same id
      const isDuplicate = history.some(
        (item) => item.song.id === response[0].song.id
      );

      if (!isDuplicate) {
        setHistory((prevArray) => [...prevArray, response[0]]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      handleGetResults();
    }
  }, []);

  // useEffect(() => {
  //   console.log("results: ", results);
  // }, [results]);

  useEffect(() => {
    setCurrentSong(results[currentSongIndex]);
    if (!loading) {
      // Check if the history already contains an element with the same id
      const isDuplicate = history.some(
        (item) => item.song.id === results[currentSongIndex].song.id
      );

      if (!isDuplicate) {
        setHistory((prevArray) => [...prevArray, results[currentSongIndex]]);
      }
    }
    setIsPlaying(true); // TODO change this to true for playing of video on song change
  }, [currentSongIndex]);

  const playNextSong = () => {
    onOpen();
    setIsPlaying(false);
    setTimer(timerDuration);
    const interval = setInterval(() => {
      setTimer((prevTime) => (prevTime !== null ? prevTime - 1 : null));
    }, 1000);

    setTimeout(() => {
      setCurrentSongIndex((prevIndex) => prevIndex + 1);
      clearInterval(interval);
      onClose();
      setTimer(null);
    }, timerDuration * 1000);
  };

  const goToIndex = () => {
    const numberInput = parseInt(goToIndexinputValue);
    if (numberInput >= 1 && numberInput <= results.length) {
      let reversedIndex = results.length - numberInput;

      setCurrentSongIndex(reversedIndex);
      setCurrentSong(results[reversedIndex]);

      const elementsToAdd = results.slice(0, reversedIndex);
      setHistory([]);
      setHistory((prevArray) => [...prevArray, ...elementsToAdd]);
    } else {
      console.log("Invalid input number");
    }
  };

  const getPositionRelativeToLength = (
    currentIndex: number,
    arrayLength: number
  ) => {
    return arrayLength - currentIndex;
  };

  function getPositionSuffix(position: any) {
    const remainder10 = position % 10;
    const remainder100 = position % 100;

    if (remainder10 === 1 && remainder100 !== 11) {
      return position + "st";
    } else if (remainder10 === 2 && remainder100 !== 12) {
      return position + "nd";
    } else if (remainder10 === 3 && remainder100 !== 13) {
      return position + "rd";
    } else {
      return position + "th";
    }
  }

  useEffect(() => {
    setTimer(null);
  }, [onClose]);

  useEffect(() => {
    if (timer) {
      if (timer >= 1) {
        const modalText = document.querySelector(".zoomFadeOut");
        if (modalText) {
          modalText.classList.remove("zoomFadeOut");
          //@ts-ignore
          void modalText.offsetWidth; // Trigger reflow to restart the animation
          modalText.classList.add("zoomFadeOut");
        }
      }
    }
  }, [timer]);

  return (
    <>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <Grid templateColumns="80% 20%" templateRows="96vh">
          <Box
            bg="black"
            h="100%"
            gridColumn="1 / 2"
            paddingY={4}
            paddingLeft={4}
            paddingRight={2}
          >
            <Card padding={3} height={"100%"} backgroundColor={"lightGrey"}>
              {/* <Text>index: {currentSongIndex}</Text> */}
              <Card marginBottom={2}>
                {getPositionRelativeToLength(
                  currentSongIndex,
                  results.length
                ) === 1 ? (
                  <Text fontSize={24} textAlign={"center"}>
                    {getPositionSuffix(
                      getPositionRelativeToLength(
                        currentSongIndex,
                        results.length
                      )
                    )}
                    , This better be Bring Me The Horizon
                  </Text>
                ) : (
                  <Text fontSize={24} textAlign={"center"}>
                    {getPositionSuffix(
                      getPositionRelativeToLength(
                        currentSongIndex,
                        results.length
                      )
                    )}
                  </Text>
                )}
              </Card>
              <VideoPlayer
                youtubeUrl={currentSong.song.youtubeUrl}
                onVideoEnd={playNextSong}
                playing={isPlaying}
              />
            </Card>
          </Box>
          <Box
            bg="black"
            h="100%"
            gridColumn="2 / 3"
            paddingY={4}
            paddingLeft={2}
            paddingRight={4}
            style={{ overflow: "auto" }}
            marginBottom={4}
          >
            <Card
              backgroundColor={"lightGrey"}
              maxHeight={"100%"}
              style={{ overflow: "auto" }}
            >
              <HorizontalStack style={{ padding: 8 }}>
                <Input
                  placeholder="Go To Song Number"
                  backgroundColor={"white"}
                  value={goToIndexinputValue}
                  onChange={(e) => setGoToIndexInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      goToIndex();
                    }
                  }}
                  maxWidth={500}
                  marginRight={4}
                />
                <Button colorScheme="blue" onClick={goToIndex}>
                  Go
                </Button>
              </HorizontalStack>
              <Box padding={3}>
                {history
                  .slice()
                  .reverse()
                  .map((songDetail: SongDetails, index) => {
                    return (
                      <HistorySongDetail
                        key={songDetail.song.id + index}
                        songDetails={songDetail}
                        currentSong={currentSong}
                        accessToken={accessToken}
                      />
                    );
                  })}
              </Box>
            </Card>
          </Box>
        </Grid>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"30%"}>
          <ModalBody display="flex" alignItems="center" justifyContent="center">
            <Box textAlign="center">
              <Text className="zoomFadeOut" fontSize="100">
                {timer}
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Results;
