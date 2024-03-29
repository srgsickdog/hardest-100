import { Stack, Text, Image, Card, Button } from "@chakra-ui/react";
import HorizontalStack from "../Layout/HorizontalStack";

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
      style={{
        display: "flex",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
      variant={"outline"}
      onClick={() => showAlbumSongs(album.id)}
      className="hover-card"
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
        <HorizontalStack style={{ justifyContent: "space-between", flex: 1 }}>
          <Text fontSize={22}>{album.name}</Text>
          <HorizontalStack>
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
          </HorizontalStack>
        </HorizontalStack>
      </Stack>
    </Card>
  );
};

export default ArtistAlbum;
