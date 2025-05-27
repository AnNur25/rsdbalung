export default function YoutubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div>
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    </div>
  );
}
