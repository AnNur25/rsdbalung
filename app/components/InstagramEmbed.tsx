import { useEffect } from "react";

const InstagramEmbed = ({ url }: { url: string }) => {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <blockquote
        className="instagram-media w-80vw"
        data-instgrm-permalink={url}
        // data-instgrm-version="14"
      ></blockquote>
    </div>
  );
};

export default InstagramEmbed;
