import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import db from "../fireabaseConfig";
import { PersonsResults, SongDetails, Song } from "../types/types";

export const getShortListedSongs = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "shortlistedSongs"));
    const shortlistedSongs: any = [];

    querySnapshot.forEach((doc) => {
      shortlistedSongs.push({
        id: doc.data().id,
        name: doc.data().name,
        timeAdded: doc.data().timeAdded,
      });
    });

    shortlistedSongs.sort((a: any, b: any) => {
      if (!a.timeAdded && !b.timeAdded) return 0; // if both are undefined, maintain current order
      if (!a.timeAdded) return 1; // if a.timeAdded is undefined, move it to the end
      if (!b.timeAdded) return -1; // if b.timeAdded is undefined, move it to the end
      // Sort in descending order based on timeAdded
      return b.timeAdded.seconds - a.timeAdded.seconds;
    });

    return shortlistedSongs;
  } catch (error) {
    console.error("Error fetching document:", error);
    return [];
  }
};

export const deleteSongFromShortList = async (songId: string) => {
  try {
    const docRef = doc(db, "shortlistedSongs", songId);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export const addSongToShortList = async (songId: string, songName: string) => {
  try {
    const docRef = doc(db, "shortlistedSongs", songId);
    const timestamp = serverTimestamp();
    await setDoc(docRef, { id: songId, name: songName, timeAdded: timestamp });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const submitVotesCall = async (songs: object, personName: string) => {
  if (personName.includes("Test")) {
    try {
      // Find the document where personName matches
      const querySnapshot = await getDocs(
        query(
          collection(db, "topTensTest"),
          where("personName", "==", personName)
        )
      );
      let docId = "";
      querySnapshot.forEach(async (doc) => {
        docId = doc.id;
      });
      const docRef = doc(db, "topTensTest", docId);
      await updateDoc(docRef, { songs: songs });
    } catch (e) {
      console.error("Error updating document test: ", e);
    }
  } else {
    try {
      // Find the document where personName matches
      const querySnapshot = await getDocs(
        query(collection(db, "topTens"), where("personName", "==", personName))
      );
      let docId = "";
      querySnapshot.forEach(async (doc) => {
        docId = doc.id;
      });
      const docRef = doc(db, "topTens", docId);
      await updateDoc(docRef, { songs: songs });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }
};

export const setYoutubeUrl = async (
  songId: string,
  url: string,
  songName: string
) => {
  try {
    const docRef = doc(db, "shortlistedSongs", songId);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists() || !docSnapshot.data().timeAdded) {
      const timeAdded = serverTimestamp();
      await setDoc(
        docRef,
        { id: songId, youtubeUrl: url, timeAdded, name: songName },
        { merge: true }
      );
    } else {
      await setDoc(
        docRef,
        { youtubeUrl: url, name: songName },
        { merge: true }
      );
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getTopTen = async (code: string) => {
  const name: string = checkCode(code.toLowerCase());
  if (name.includes("Test")) {
    const q = query(
      collection(db, "topTensTest"),
      where("personName", "==", name)
    );
    const querySnapshot = await getDocs(q);
    let results: any = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
      const info = {
        name: doc.data().personName,
        songs: doc.data().songs,
      };
      results.push(info);
    });
    return results[0];
  } else {
    const q = query(collection(db, "topTens"), where("personName", "==", name));
    const querySnapshot = await getDocs(q);
    let results: any = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
      const info = {
        name: doc.data().personName,
        songs: doc.data().songs,
      };
      results.push(info);
    });
    return results[0];
  }
};

export const getShortlistedSong = async (documentId: string) => {
  const docRef = doc(db, "shortlistedSongs", documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

export const getResults = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "topTensTest")); //TODO change to real DB name
    const votingResults: Array<PersonsResults> = [];

    querySnapshot.forEach((doc) => {
      votingResults.push({
        personName: doc.data().personName,
        songs: doc.data().songs,
      });
    });

    const combinedResults = createCombinedVotingResults(votingResults);
    await addSongDetails(combinedResults);

    return combinedResults;
  } catch (error) {
    console.error("Error fetching document:", error);
    return [];
  }
};

export const getAllResults = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "topTensTest")); //TODO change to real DB name
    const allResults: any = [];
    querySnapshot.forEach((doc) => {
      allResults.push(doc.data());
    });

    return allResults;
  } catch (error) {
    console.error("Error fetching document:", error);
    return [];
  }
};

const addSongDetails = async (countedResults: any) => {
  await Promise.all(
    countedResults.map(async (result: SongDetails) => {
      const songDetails = await getShortlistedSong(result.song.id);
      result.song.name = songDetails?.name;
      result.song.youtubeUrl = songDetails?.youtubeUrl;
    })
  );
};

const createCombinedVotingResults = (personsResults: PersonsResults[]) => {
  const songPoints: Record<string, number> = {};
  const songDetails: Record<string, SongDetails> = {};

  personsResults.forEach((personResult) => {
    for (const song of personResult.songs) {
      if (song.position <= 19) {
        const maxPoints = 200;
        const pointsPerSong = 10;

        const points = maxPoints - song.position * pointsPerSong;

        if (songPoints[song.id]) {
          songPoints[song.id] += points;
        } else {
          songPoints[song.id] = points;
        }

        if (!songDetails[song.id]) {
          songDetails[song.id] = {
            song: {
              id: song.id,
              name: "",
              youtubeUrl: "",
            },
            points: 0,
            details: [],
          };
        }

        songDetails[song.id].points += points;
        songDetails[song.id].details.push({
          voterName: personResult.personName,
          position: song.position,
        });
      }
    }
  });
  const sortedSongDetails = Object.values(songDetails).sort(
    (a, b) => a.points - b.points
  );
  return sortedSongDetails;
};

const checkCode = (code: string) => {
  let name = "";

  switch (code) {
    case "qo3tu":
      name = "paul";
      break;
    case "hk7sl":
      name = "alex";
      break;
    case "md9az":
      name = "tom";
      break;
    case "rc2lf":
      name = "josh";
      break;
    case "py6wb":
      name = "dibs";
      break;
    case "gs4je":
      name = "daine";
      break;
    case "jdh7f":
      name = "chris";
      break;
    case "test1":
      name = "PaulTest";
      break;
    case "test2":
      name = "AlexTest";
      break;
    case "test3":
      name = "TomTest";
      break;
    case "test4":
      name = "JoshTest";
      break;
    case "test5":
      name = "DibsTest";
      break;
    case "test6":
      name = "DaineTest";
      break;
    case "test7":
      name = "ChrisTest";
      break;
    default:
      name = "Sorry, that's not a valid option.";
      break;
  }

  return name;
};
