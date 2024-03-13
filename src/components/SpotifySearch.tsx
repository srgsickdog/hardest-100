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
import {
  searchSpotifyArtistCall,
  fetchSpotifySong,
  fetchSpotifyAlbum,
  fetchArtistAlbum,
  fetchAlbumSongs,
} from "../api/spotifyCalls";
import ArtistAlbum from "./ArtistAlbum";
import SongResult from "./SongResult";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { addSongToShortList } from "../firebase/firebaseFunctions";
import { fetchSongDetails } from "../api/spotifyCalls";

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

  const handleSearchSpotifySong = async () => {
    setAlbumSearch("");
    setArtistSearch("");
    const response = await fetchSpotifySong(accessToken, songSearch);
    if (response !== "error") {
      setSongSearchResults(response);
    }
    setShowResultsFor(SONGS);
  };

  const handleSearchSpotifyAlbum = async () => {
    setArtistSearch("");
    setSongSearch("");
    const response = await fetchSpotifyAlbum(accessToken, albumSearch);
    if (response !== "error") {
      setArtistAlbums(response);
    }
    setShowResultsFor(ARTIST_ALBUMS);
  };

  const handleShowArtistAlbum = async (id: string) => {
    setArtistAlbums([]);
    const response = await fetchArtistAlbum(accessToken, id);
    if (response !== "error") {
      setArtistAlbums(response);
    }
    setShowResultsFor(ARTIST_ALBUMS);
  };

  const handleShowAlbumSongs = async (id: string) => {
    setAlbumSongs([]);
    setShowResultsFor(ALBUM_SONGS);
    const response = await fetchAlbumSongs(accessToken, id);
    if (response !== "error") {
      setAlbumSongs(response);
    }
  };

  const handleAddToShortlist = async (songId: string, songName: string) => {
    setSelectedSongId(songId);
    setSelectedSongName(songName);
    const songDetails = await fetchSongDetails(accessToken, songId);
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
      const response = await addSongToShortList(songId, songName);
      updateShortList();
    }
  };
  return (
    // <Box style={{ maxHeight: "25vh", minHeight: "25vh", overflow: "auto" }}>
    <Box>
      <Card padding={4}>
        <SimpleGrid columns={2}>
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
                    handleSearchSpotifyAlbum();
                  }
                }}
                maxWidth={500}
              />
              <Button colorScheme="blue" onClick={handleSearchSpotifyAlbum}>
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
                    handleSearchSpotifySong();
                  }
                }}
                maxWidth={500}
              />
              <Button colorScheme="blue" onClick={handleSearchSpotifySong}>
                Search
              </Button>
            </Stack>
          </Box>
          <div>
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
                      showArtistAlbums={handleShowArtistAlbum}
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
                      showAlbumSongs={handleShowAlbumSongs}
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
                        addToShortList={handleAddToShortlist}
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
                      addToShortList={handleAddToShortlist}
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
    </Box>
  );
};

export default SpotifySearch;
