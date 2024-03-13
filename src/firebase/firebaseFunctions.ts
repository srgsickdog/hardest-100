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
};

export const getTopTen = async (code: string) => {
  const name = checkCode(code.toLowerCase());

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
};

export const setYoutubeUrl = async (songId: string, url: string) => {
  try {
    const docRef = doc(db, "shortlistedSongs", songId);
    await setDoc(docRef, { youtubeUrl: url }, { merge: true });
  } catch (e) {
    console.error("Error adding document: ", e);
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
    default:
      name = "Sorry, that's not a valid option.";
      break;
  }

  return name;
};
