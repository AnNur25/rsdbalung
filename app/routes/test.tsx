import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import banner from "~/assets/rsdbalung.jpeg";
import ImageGradientCard from "~/components/ImageGradientCard";
import ImageSlider from "~/components/ImageSlider";

export default function Test() {
  //   const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // new Quill("#editor", {
    //   theme: "snow",
    // });
  }, []);

  return (
    <>
      {/* <div ref={editorRef}></div> */}
      {/* <div id="editor">
        <p>Core build with no theme, formatting, non-essential modules</p>
      </div> */}
      {/* <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script> */}
      {/* <link
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
        rel="stylesheet"
      /> */}

      {/* <div id="editor">
        <h2>Demo Content</h2>
        <p>
          Preset build with <code>snow</code> theme, and some common formats.
        </p>
      </div> */}

      <ImageGradientCard />

      {/* <ImageSlider /> */}
    </>
  );
}
