import axios from "axios";

const CLIENT_ID = "d9f86c8c80f64a639f2cf4dfe67d5ce5";
const CLIENT_SECRET = "6f66d41dc20c4bd4897f9e5065995c2b";

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

export const fetchSpotifySong = async (token: string, song: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${song}&type=track`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data.tracks.items;
    // setSongSearchResults(response.data.tracks.items);
  } catch (error) {
    // handle error here
    return "error";
  }
};

export const fetchSpotifyAlbum = async (token: string, album: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${album}&type=album`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data.albums.items;
  } catch (error) {
    return "error";
  }
};

export const fetchArtistAlbum = async (token: string, id: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${id}/albums`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    return "error";
  }
};

export const fetchAlbumSongs = async (token: string, id: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${id}/tracks`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    return "error";
  }
};

export const fetchSongDetails = async (token: string, songId: string) => {
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

export const fetchSpotifyToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    return "error";
  }
};
