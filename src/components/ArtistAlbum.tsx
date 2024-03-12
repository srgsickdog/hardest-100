import { Stack, Text, Image, Card, Button } from "@chakra-ui/react";

interface ArtistAlbumProps {
  album: {
    id: React.Key;
    images: Array<{ url: string }>;
    name: string;
    release_date: string;
  };
  showAlbumSongs: any;
}

const ArtistAlbum: React.FC<ArtistAlbumProps> = ({ album, showAlbumSongs }) => {
  return (
    <Card
      marginY={2}
      padding={2}
      style={{ display: "flex" }}
      variant={"outline"}
    >
      <Stack
        direction="row"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        {album.images.length > 0 && (
          <Image
            src={album.images[0].url}
            alt={album.name}
            style={{ borderRadius: "24px", width: "5%", minWidth: "5%" }}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <Text fontSize={22}>{album.name}</Text>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text fontSize={18} color="grey" marginRight={4}>
              {album.release_date.substring(0, 4)}
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => showAlbumSongs(album.id)}
              marginY={2}
            >
              Show Album Songs
            </Button>
          </div>
        </div>
      </Stack>
    </Card>
  );
};

export default ArtistAlbum;
