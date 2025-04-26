import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

export default function HtmlParse({ htmlString }: { htmlString: string }) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");

  useEffect(() => {
    const clean = DOMPurify.sanitize(htmlString);
    setSanitizedHtml(clean);
  }, [htmlString]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
