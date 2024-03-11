import axios from "axios";

export const searchSpotifyArtistCall = async (
  token: string,
  artist: string
) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    // handle response here if needed
    console.log("artist search response: ", response);

    return response.data.artists.items;
  } catch (error) {
    // handle error here
    console.log("search failed: ");
    return "error";
  }
};
