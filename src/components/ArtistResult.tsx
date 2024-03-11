import { Stack, Text, Image, Card, Button } from "@chakra-ui/react";

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
    <Card marginY={8} padding={4} style={{ display: "flex" }}>
      <Stack direction="row" style={{ flex: 1 }}>
        {artist.images.length > 0 && (
          <Image
            src={artist.images[0].url}
            alt={artist.name}
            style={{ borderRadius: "24px", width: "25%", minWidth: "25%" }}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text fontSize={22}>{artist.name}</Text>
        </div>
      </Stack>
      <Button
        colorScheme="blue"
        onClick={() => showArtistAlbums(artist.id)}
        marginY={2}
      >
        Show albums
      </Button>
    </Card>
  );
};

export default ArtistResult;
