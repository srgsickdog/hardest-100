import { useEffect, useState } from "react";
import { getAllResults } from "../firebase/firebaseFunctions";
import PersonResult from "../components/PersonResult";
import { SimpleGrid, Text, Card, Box, Image } from "@chakra-ui/react";
import HorizontalStack from "../Layout/HorizontalStack";

interface AllResultsProps {
  accessToken: string;
}

const AllResults: React.FC<AllResultsProps> = ({ accessToken }) => {
  const [loading, setLoading] = useState(true);
  const [allResults, setAllResults] = useState([]);
  const [allSongVotes, setAllSongVotes] = useState([]);
  const [albumResultCount, setAlbumResultCount] = useState<Array<any>>([]);
  const [artistResultCount, setArtistResultCount] = useState<Array<any>>([]);

  const handleGetAllResults = async () => {
    const response = await getAllResults();
    setAllResults(response);
    setLoading(false);
  };

  useEffect(() => {
    handleGetAllResults();
  }, []);

  useEffect(() => {
    if (!loading) {
      const resultsCounted = countSongsInAlbums(allSongVotes);
      const artistsResultsCounted = countArtistOccurrences(allSongVotes);
      setArtistResultCount(artistsResultsCounted);
      setAlbumResultCount(resultsCounted);
    }
  }, [allSongVotes]);

  const countSongsInAlbums = (data: any) => {
    const albumCounts: any = {};

    data.forEach((item: any) => {
      const albumId = item.album.id;
      albumCounts[albumId] = (albumCounts[albumId] || 0) + 1;
    });

    const result = Object.keys(albumCounts).map((albumId) => {
      const albumData = data.find((item: any) => item.album.id === albumId);
      return {
        count: albumCounts[albumId],
        name: albumData.album.name,
        images: albumData.album.images,
        artist: albumData.artists[0].name,
      };
    });

    result.sort((a, b) => b.count - a.count);

    return result;
  };

  function countArtistOccurrences(
    tracks: any
  ): { name: string; count: number }[] {
    const artistCountMap = new Map<string, number>();

    tracks.forEach((track: any) => {
      track.artists.forEach((artist: any) => {
        const { id } = artist;
        const count = artistCountMap.get(id) || 0;
        artistCountMap.set(id, count + 1);
      });
    });

    const artistCounts: { name: string; count: number }[] = [];
    artistCountMap.forEach((count, id) => {
      const artist = tracks.find((track: any) =>
        track.artists.some((a: any) => a.id === id)
      );
      if (artist) {
        artistCounts.push({ name: artist.artists[0].name, count });
      }
    });

    artistCounts.sort((a, b) => b.count - a.count);

    return artistCounts;
  }

  return (
    <>
      {albumResultCount.length > 0 && artistResultCount.length > 0 && (
        <SimpleGrid padding={2} columns={2} spacing={4}>
          <Card>
            <Text fontSize={25}>Album Ranks</Text>
            {albumResultCount.map((album: any, index) => {
              return (
                <Card margin={1} padding={0.5} key={index}>
                  <HorizontalStack style={{ justifyContent: "space-between" }}>
                    <HorizontalStack>
                      <Image
                        src={album.images[0].url}
                        alt={album.images[0].url}
                        style={{
                          maxWidth: "25px",
                          minWidth: "25px",
                          maxHeight: "25px",
                          marginRight: "1rem",
                          borderRadius: "5px",
                        }}
                      />
                      <Text>{album.name}</Text>
                    </HorizontalStack>
                    <HorizontalStack>
                      <Text color={"grey"} paddingRight={8}>
                        {album.artist}
                      </Text>
                      <Text>{album.count}</Text>
                    </HorizontalStack>
                  </HorizontalStack>
                </Card>
              );
            })}
          </Card>
          <Card>
            <Text fontSize={25}>Artist Ranks</Text>
            {artistResultCount.map((artist: any, index) => {
              return (
                <Card margin={1} padding={0.5} key={index}>
                  <HorizontalStack style={{ justifyContent: "space-between" }}>
                    <Text>{artist.name}</Text>
                    <Text>{artist.count}</Text>
                  </HorizontalStack>
                </Card>
              );
            })}
          </Card>
        </SimpleGrid>
      )}
      {!loading && (
        <SimpleGrid padding={2} columns={2} spacing={4}>
          {allResults.map((result: any) => (
            <PersonResult
              personResult={result}
              key={result.personName}
              accessToken={accessToken}
              setAllSongVotes={setAllSongVotes}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default AllResults;
