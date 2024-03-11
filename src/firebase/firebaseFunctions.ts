import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import db from "../fireabaseConfig";

export const getShortListedSongs = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "shortlistedSongs"));
    const shortlistedSongs: string[] = [];

    querySnapshot.forEach((doc) => {
      shortlistedSongs.push(doc.data().id);
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

export const addSongToShortList = async (songId: string) => {
  try {
    const docRef = doc(db, "shortlistedSongs", songId);
    await setDoc(docRef, { id: songId });
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
    default:
      name = "Sorry, that's not a valid option.";
      break;
  }

  return name;
};
