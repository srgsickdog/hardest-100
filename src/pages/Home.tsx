import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../fireabaseConfig";
import axios from "axios";

import { Button, Stack } from "@chakra-ui/react";

const CLIENT_ID = "d9f86c8c80f64a639f2cf4dfe67d5ce5";
const CLIENT_SECRET = "6f66d41dc20c4bd4897f9e5065995c2b";

const Home = () => {
  const [accessToken, setAccessToken] = useState("");
  const checkFirebase = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "first",
        last: "last",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //   useEffect(() => {
  //     console.log("accessToken: ", accessToken);
  //   }, [accessToken]);

  useEffect(() => {
    const checkSpotify = async () => {
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
        setAccessToken(response.data.access_token);
      } catch (error) {}
    };
    checkSpotify();
  }, []);

  const checkArtistSearch = async () => {
    // get artist ID
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/search?q=Taylor Swift&type=artist",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      // handle response here if needed
      console.log("artist search response: ", response);
    } catch (error) {
      // handle error here
      console.log("search failed: ");
    }
  };

  const checkSongSearch = async () => {
    // get artist ID
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/search?q=gravedigger&type=track",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      // handle response here if needed
      console.log("song search response: ", response);
    } catch (error) {
      // handle error here
      console.log("search failed: ");
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      <Button colorScheme="blue" onClick={checkFirebase}>
        Check firebase
      </Button>
      <Button colorScheme="blue" onClick={checkArtistSearch}>
        Check spotify artist search
      </Button>
      <Button colorScheme="blue" onClick={checkSongSearch}>
        check song search
      </Button>
    </Stack>
  );
};

export default Home;
