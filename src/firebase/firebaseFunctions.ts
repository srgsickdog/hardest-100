import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
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

export const addSongToShortList = async (songId: string) => {
  try {
    const docRef = await addDoc(collection(db, "shortlistedSongs"), {
      id: songId,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getTopTen = async (code: string) => {
  const name = checkCode(code.toLowerCase());

  const q = query(collection(db, "topTens"), where("personName", "==", name));
  const querySnapshot = await getDocs(q);
  let results: any = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    results.push(doc.data());
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
