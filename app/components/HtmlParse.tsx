import DOMPurify from "dompurify";

export default function HtmlParse({ htmlString }: { htmlString: string }) {
  const sanitizedHtml: string = DOMPurify.sanitize(htmlString);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
