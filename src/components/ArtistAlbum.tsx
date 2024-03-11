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
    <Card marginY={8} padding={4} style={{ display: "flex" }}>
      <Stack direction="row" style={{ flex: 1 }}>
        {album.images.length > 0 && (
          <Image
            src={album.images[0].url}
            alt={album.name}
            style={{ borderRadius: "24px", width: "25%", minWidth: "25%" }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text fontSize={22}>{album.name}</Text>
          <Text fontSize={18} color="grey">
            {album.release_date}
          </Text>
        </div>
      </Stack>
      <Button
        colorScheme="blue"
        onClick={() => showAlbumSongs(album.id)}
        marginY={2}
      >
        Show Album Songs
      </Button>
    </Card>
  );
};

export default ArtistAlbum;
