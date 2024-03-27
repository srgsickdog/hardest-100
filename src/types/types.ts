export interface PersonsResults {
  personName: string;
  songs: Array<{ id: string; position: number }>;
}

export interface SongDetails {
  song: Song;
  points: number;
  details: Array<{ voterName: string; position: number }>;
  placement: string;
}

export interface Song {
  id: string;
  name: string;
  youtubeUrl: string;
}
