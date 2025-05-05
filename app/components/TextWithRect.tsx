interface TextWithRectProps {
  children: React.ReactNode;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
}
export default function TextWithRect({
  children,
  textColor = "text-persian-blue-950",
  fontSize = "text-xl",
  fontWeight = "font-extrabold",
}: TextWithRectProps) {
  return (
    <div className="relative flex max-h-min max-w-fit items-center">
      <div className="absolute -left-3 h-5 w-1.5 bg-yellow-400"></div>
      <p className={`${fontSize} ${fontWeight} ${textColor}`}>{children}</p>
    </div>
  );
}
