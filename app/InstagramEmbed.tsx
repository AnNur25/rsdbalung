import { useEffect } from 'react';

const InstagramEmbed = () => {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/p/DG2qlZTtRFQ/"
        data-instgrm-version="14"
      ></blockquote>
    </div>
  );
};

export default InstagramEmbed;
