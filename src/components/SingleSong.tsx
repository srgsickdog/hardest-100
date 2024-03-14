import { CloseIcon } from "@chakra-ui/icons";
import {
  Stack,
  Text,
  Card,
  Button,
  Box,
  Image,
  IconButton,
  Icon,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  setYoutubeUrl,
  getShortlistedSong,
} from "../firebase/firebaseFunctions";
import { fetchSongDetails } from "../api/spotifyCalls";
import HorizontalStack from "../Layout/HorizontalStack";
import ConfirmationModal from "./ConfirmationModal";

interface ShortlistedSongProps {
  accessToken: string;
  song: any;
  showRemove?: boolean;
  removeFunction?: any;
  setTopTen?: any;
  addToTopTen?: any;
  showAddtoVotes?: boolean;
  showPosition?: boolean;
  position?: number;
  showUrl?: boolean;
  miniView?: boolean;
  showYoutubeWarning?: boolean;
}

const ShortlistedSong: React.FC<ShortlistedSongProps> = ({
  accessToken,
  song,
  showRemove = false,
  removeFunction,
  setTopTen,
  addToTopTen,
  showAddtoVotes = false,
  showPosition = false,
  showUrl = false,
  position,
  miniView = false,
  showYoutubeWarning = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playId, setPlayId] = useState(`audioPlayer${song.id}`);
  const [songDetails, setSongDetails] = useState<{
    name: string;
    artists: Array<{ name: string }>;
    preview_url: string | null;
    album: {
      name: string;
      release_date: string;
      images: Array<{ url: string }>;
    };
  }>({
    name: "",
    artists: [{ name: "" }],
    album: { name: "", release_date: "", images: [{ url: "" }] },
    preview_url: null,
  });
  const [finishedSongDetailsFetch, setFinishedSongDetailsFetch] =
    useState(false);
  const [finishedYoutubeFetch, setFinishedYoutubeFetch] = useState(false);
  const [youtubeUrlValue, setYoutubeUrlValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);

  const getSongDetails = async () => {
    const response = await fetchSongDetails(accessToken, song.id);
    setSongDetails(response);
    setFinishedSongDetailsFetch(true);
  };
  const getYoutubeUrl = async () => {
    const response = await getShortlistedSong(song.id);
    if (response) {
      if (response.youtubeUrl) {
        setYoutubeUrlValue(response.youtubeUrl);
      }
    }
    setFinishedYoutubeFetch(true);
  };

  useEffect(() => {
    getYoutubeUrl();
    getSongDetails();
  }, []);

  const togglePlay = () => {
    const audioElement = document.getElementById(playId) as HTMLAudioElement;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSetYoutubeUrl = async () => {
    const response = await setYoutubeUrl(
      song.id,
      youtubeUrlValue,
      songDetails.name
    );
  };

  return (
    <>
      {finishedSongDetailsFetch && finishedYoutubeFetch ? (
        <>
          {!miniView ? (
            <Card
              padding={2}
              marginY={2}
              borderColor={
                youtubeUrlValue === "" && showYoutubeWarning
                  ? "rgba(223, 67, 67, 0.61)"
                  : ""
              }
              style={{
                boxShadow:
                  youtubeUrlValue === "" && showYoutubeWarning
                    ? "1px 1px 3px rgba(223, 67, 67, 0.5)"
                    : "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Box style={{ flex: 1 }}>
                  <HorizontalStack style={{ justifyContent: "space-between" }}>
                    <HorizontalStack>
                      {showPosition && (
                        <Text fontSize={22} color="grey" marginRight={4}>
                          {position}
                        </Text>
                      )}
                      <Image
                        src={songDetails.album.images[0].url}
                        alt={songDetails.album.name}
                        style={{
                          maxWidth: "50px",
                          minWidth: "50px",
                          maxHeight: "50px",
                          marginRight: "1rem",
                        }}
                      />
                      <div>
                        <Text fontSize={20}>{songDetails.name}</Text>
                        <Stack direction="row" alignItems="center">
                          <Text fontSize={15} color="grey">
                            {songDetails.artists[0].name}
                          </Text>
                          <Text fontSize={15} color="grey">
                            {songDetails.album.name}
                          </Text>
                          <Text fontSize={15} color="grey">
                            {songDetails.album.release_date.substring(0, 4)}
                          </Text>
                        </Stack>
                      </div>
                    </HorizontalStack>
                    <HorizontalStack>
                      {songDetails.preview_url !== null && (
                        <Box onClick={togglePlay}>
                          <HorizontalStack>
                            <Button
                              rightIcon={!isPlaying ? <FaPlay /> : <FaPause />}
                              onClick={() => togglePlay()}
                              marginRight={2}
                            >
                              Song Preview
                            </Button>
                          </HorizontalStack>
                        </Box>
                      )}
                      {songDetails.preview_url !== null && (
                        <div style={{ display: "none" }}>
                          <audio id={playId} controls>
                            <source
                              src={songDetails.preview_url}
                              type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                      {showAddtoVotes && (
                        <IconButton
                          aria-label="Add to votes"
                          icon={<FaPlus />}
                          onClick={() => addToTopTen(song.id)}
                          colorScheme="blue"
                          marginRight={2}
                        />
                      )}
                      {showRemove && (
                        <IconButton
                          aria-label="Remove"
                          icon={<CloseIcon />}
                          onClick={() => setIsModalOpen(true)}
                        />
                      )}
                    </HorizontalStack>
                  </HorizontalStack>
                  {showUrl && (
                    <HorizontalStack
                      style={{ marginTop: 4, justifyContent: "space-between" }}
                    >
                      <Input
                        placeholder="Enter Youtube URL"
                        value={youtubeUrlValue}
                        onChange={(e) => setYoutubeUrlValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSetYoutubeUrl();
                          }
                        }}
                        maxWidth={500}
                        marginRight={4}
                      />
                      <Button colorScheme="blue" onClick={handleSetYoutubeUrl}>
                        Save Youtube URL
                      </Button>
                    </HorizontalStack>
                  )}
                </Box>
              </Stack>
            </Card>
          ) : (
            <Card
              marginY={1}
              paddingY={1}
              borderColor={
                youtubeUrlValue === "" && showYoutubeWarning
                  ? "rgba(223, 67, 67, 0.61)"
                  : ""
              }
              style={{
                boxShadow:
                  youtubeUrlValue === "" && showYoutubeWarning
                    ? "1px 1px 3px rgba(223, 67, 67, 0.5)"
                    : "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <HorizontalStack style={{ justifyContent: "space-between" }}>
                <HorizontalStack>
                  {showPosition && (
                    <Text fontSize={15} color="grey" marginLeft={2} width={8}>
                      {position}
                    </Text>
                  )}
                  <Image
                    src={songDetails.album.images[0].url}
                    alt={songDetails.album.name}
                    style={{
                      maxWidth: "25px",
                      minWidth: "25px",
                      maxHeight: "25px",
                      marginRight: "1rem",
                      borderRadius: "5px",
                    }}
                  />
                  <HorizontalStack
                    style={{ justifyContent: "space-between", flex: 1 }}
                  >
                    <Text fontSize={18}>{songDetails.name}</Text>
                    <Text fontSize={12} color="grey" marginX={2}>
                      {songDetails.artists[0].name}
                    </Text>
                  </HorizontalStack>
                </HorizontalStack>
                <HorizontalStack>
                  <Text fontSize={12} color="grey" marginX={2}>
                    {songDetails.album.name}
                  </Text>
                  <Text fontSize={12} color="grey" marginX={2}>
                    {songDetails.album.release_date.substring(0, 4)}
                  </Text>
                  {songDetails.preview_url !== null ? (
                    <IconButton
                      aria-label="Remove"
                      icon={!isPlaying ? <FaPlay /> : <FaPause />}
                      onClick={() => togglePlay()}
                      size="10"
                      backgroundColor={"white"}
                      marginX={4}
                    />
                  ) : (
                    <Box width="12" />
                  )}
                  {songDetails.preview_url !== null && (
                    <div style={{ display: "none" }}>
                      <audio id={playId} controls>
                        <source
                          src={songDetails.preview_url}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {showRemove && (
                    <IconButton
                      aria-label="Remove"
                      icon={<CloseIcon />}
                      onClick={() => setIsModalOpen(true)}
                      size="10"
                      backgroundColor={"white"}
                      marginX={4}
                    />
                  )}
                </HorizontalStack>
              </HorizontalStack>
            </Card>
          )}
        </>
      ) : null}
      <ConfirmationModal
        isOpen={isModalOpen}
        modalText={
          showAddtoVotes
            ? "Sure you want to delete from shortlist cunt?"
            : "Sure you want to delete from votes cunt?"
        }
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => removeFunction(song.id)}
      />
    </>
  );
};

export default ShortlistedSong;
