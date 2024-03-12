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
    return response.data.artists.items;
  } catch (error) {
    // handle error here
    console.log("search failed: ");
    return "error";
  }
};

export const getSongDetailsCall = async (token: string, songId: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching song details:", error);
  }
};
