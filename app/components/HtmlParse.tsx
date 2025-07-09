import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

export default function HtmlParse({ htmlString, className = "" }: { htmlString: string, className?: string }) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");

  useEffect(() => {
    const clean = DOMPurify.sanitize(htmlString);
    setSanitizedHtml(clean);
  }, [htmlString]);

  return <div className={`sanitizedHtml ${className}`} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
