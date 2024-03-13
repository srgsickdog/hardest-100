import { Stack, Text, Image, Card, Button } from "@chakra-ui/react";
import HorizontalStack from "../Layout/HorizontalStack";

interface ArtistResultProps {
  artist: {
    id: React.Key;
    images: Array<{ url: string }>;
    name: string;
  };
  showArtistAlbums: any;
}

const ArtistResult: React.FC<ArtistResultProps> = ({
  artist,
  showArtistAlbums,
}) => {
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
      onClick={() => showArtistAlbums(artist.id)}
      className="hover-card"
    >
      <Stack
        direction="row"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        {artist.images.length > 0 && (
          <Image
            src={artist.images[0].url}
            alt={artist.name}
            style={{ borderRadius: "24px", width: "5%", minWidth: "5%" }}
          />
        )}
        <HorizontalStack style={{ justifyContent: "space-between", flex: 1 }}>
          <Text fontSize={22}>{artist.name}</Text>
          <Button
            colorScheme="blue"
            onClick={() => showArtistAlbums(artist.id)}
            marginY={2}
          >
            Show albums
          </Button>
        </HorizontalStack>
      </Stack>
    </Card>
  );
};

export default ArtistResult;
