import {
  Button,
  Stack,
  Text,
  Input,
  Card,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import ArtistResult from "./ArtistResult";
import { searchSpotifyArtistCall } from "../api/spotifyCalls";
import ArtistAlbum from "./ArtistAlbum";
import SongResult from "./SongResult";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { addSongToShortList } from "../firebase/firebaseFunctions";
import { getSongDetailsCall } from "../api/spotifyCalls";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          You FFFFFFFFFFUCCCCKKKK Head, This song didn't come out in 2012 or
          2013
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onConfirm}>
            Add anyway
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const SONGS = "songs";
const ALBUMS = "albums";
const ARTISTS = "artists";
const ARTIST_ALBUMS = "artistAlbums";
const ALBUM_SONGS = "albumSongs";

interface SpotifySearchProps {
  accessToken: string;
  updateShortList: () => Promise<void>;
}

const SpotifySearch: React.FC<SpotifySearchProps> = ({
  accessToken,
  updateShortList,
}) => {
  const [albumSearch, setAlbumSearch] = useState("");
  const [songSearch, setSongSearch] = useState("");
  const [artistSearch, setArtistSearch] = useState("");

  const [songSearchResults, setSongSearchResults] = useState([]);
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);

  const [artistAlbums, setArtistAlbums] = useState([]);
  const [albumSongs, setAlbumSongs] = useState([]);

  const [showResultsFor, setShowResultsFor] = useState(ARTISTS);

  const [modalVisible, setModalVisible] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [selectedSongName, setSelectedSongName] = useState("");

  const onClose = () => setIsOpen(false);

  const onConfirm = async () => {
    const response = await addSongToShortList(selectedSongId, selectedSongName);
    updateShortList();
    onClose();
  };

  const searchSpotifyArtist = async () => {
    setSongSearch("");
    setAlbumSearch("");
    const response = await searchSpotifyArtistCall(accessToken, artistSearch);
    if (response !== "error") {
      setArtistSearchResults(response);
    }
    setShowResultsFor(ARTISTS);
  };

  const searchSpotifySong = async () => {
    setAlbumSearch("");
    setArtistSearch("");
    setShowResultsFor(SONGS);
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${songSearch}&type=track`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      setSongSearchResults(response.data.tracks.items);
    } catch (error) {
      // handle error here
      console.log("search failed: ");
    }
  };
  const searchSpotifyAlbum = async () => {
    setArtistSearch("");
    setSongSearch("");
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${albumSearch}&type=album`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      setShowResultsFor(ARTIST_ALBUMS);
      setArtistAlbums(response.data.albums.items);
    } catch (error) {
      // handle error here
      console.log("search failed: ");
    }
  };

  const showArtistAlbums = async (id: string) => {
    setArtistAlbums([]);
    setShowResultsFor(ARTIST_ALBUMS);
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${id}/albums`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      setArtistAlbums(response.data.items);
    } catch (error) {
      // handle error here
      console.log("search failed: ");
    }
  };

  const showAlbumSongs = async (id: string) => {
    setAlbumSongs([]);
    setShowResultsFor(ALBUM_SONGS);
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${id}/tracks`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      setAlbumSongs(response.data.items);
    } catch (error) {
      // handle error here
      console.log("search failed: ");
    }
  };

  const addToShortList = async (songId: string, songName: string) => {
    setSelectedSongId(songId);
    setSelectedSongName(songName);
    console.log("songId: ", songId);
    console.log("songName: ", songName);

    const songDetails = await getSongDetailsCall(accessToken, songId);
    try {
      const date = new Date(songDetails.album.release_date);
      const year = date.getFullYear();
      // Check if the year is either 2012 or 2013
      if (year === 2012 || year === 2013) {
        const response = await addSongToShortList(songId, songName);
        updateShortList();
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.log("no year listed");
    }
  };
  return (
    <>
      <Card padding={4}>
        <SimpleGrid
          columns={2}
          spacing={5}
          style={{ maxHeight: "30vh", minHeight: "30vh" }}
        >
          <Box>
            <Text fontSize={22}>Add songs to Shortlist</Text>
            <Stack direction="row" marginY={2}>
              <Input
                placeholder="Search Artist"
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchSpotifyArtist();
                  }
                }}
                maxWidth={500}
              />
              <Button colorScheme="blue" onClick={searchSpotifyArtist}>
                Search
              </Button>
            </Stack>
            <Text>or</Text>
            <Stack direction="row" marginY={2}>
              <Input
                placeholder="Search Album"
                value={albumSearch}
                onChange={(e) => setAlbumSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchSpotifyAlbum();
                  }
                }}
                maxWidth={500}
              />
              <Button colorScheme="blue" onClick={searchSpotifyAlbum}>
                Search
              </Button>
            </Stack>
            <Text>or</Text>
            <Stack direction="row" marginY={2}>
              <Input
                placeholder="Search Song"
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchSpotifySong();
                  }
                }}
                maxWidth={500}
              />
              <Button colorScheme="blue" onClick={searchSpotifySong}>
                Search
              </Button>
            </Stack>
          </Box>
          <div style={{ maxHeight: "30vh", overflow: "auto" }}>
            {showResultsFor === ARTISTS &&
              artistSearchResults.map(
                (artist: {
                  id: React.Key;
                  images: Array<{ url: string }>;
                  name: string;
                }) => {
                  return (
                    <ArtistResult
                      key={artist.id}
                      artist={artist}
                      showArtistAlbums={showArtistAlbums}
                    />
                  );
                }
              )}
            {showResultsFor === ARTIST_ALBUMS &&
              artistAlbums.map(
                (album: {
                  id: React.Key;
                  images: Array<{ url: string }>;
                  name: string;
                  release_date: string;
                }) => {
                  return (
                    <ArtistAlbum
                      key={album.id}
                      album={album}
                      showAlbumSongs={showAlbumSongs}
                    />
                  );
                }
              )}
            {showResultsFor === ALBUM_SONGS && (
              <>
                <Button
                  colorScheme="blue"
                  leftIcon={<ArrowBackIcon />}
                  width={150}
                  onClick={() => setShowResultsFor(ARTIST_ALBUMS)}
                >
                  Go Back
                </Button>
                {albumSongs.map(
                  (song: {
                    id: React.Key;
                    name: string;
                    release_date: string;
                    preview_url: string;
                  }) => {
                    return (
                      <SongResult
                        key={song.id}
                        song={song}
                        addToShortList={addToShortList}
                      />
                    );
                  }
                )}
              </>
            )}
            {showResultsFor === SONGS &&
              songSearchResults.map(
                (song: {
                  id: React.Key;
                  name: string;
                  release_date: string;
                  preview_url: string;
                  artists: Array<{ name: string }>;
                  album: { release_date: string; name: string };
                }) => {
                  return (
                    <SongResult
                      key={song.id}
                      song={song}
                      addToShortList={addToShortList}
                      artist={song.artists[0].name}
                      album={song.album.name}
                      albumReleaseDate={song.album.release_date}
                    />
                  );
                }
              )}
          </div>
        </SimpleGrid>
      </Card>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default SpotifySearch;
