import ReactPlayer from "react-player/youtube";
interface VideoPlayerProps {
  youtubeUrl: string;
  onVideoEnd: any;
  playing: boolean;
  width?: string | number; // Optional width prop
  height?: string | number; // Optional width prop
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeUrl,
  onVideoEnd,
  playing,
  width = "100%",
  height = "100%",
}) => {
  return (
    <ReactPlayer
      url={youtubeUrl}
      controls={true}
      onEnded={onVideoEnd}
      playing={playing}
      width={width}
      height={height}
    />
  );
};
export default VideoPlayer;
