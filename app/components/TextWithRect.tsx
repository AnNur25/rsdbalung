export default function TextWithRect({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex max-h-min max-w-fit items-center">
      <div className="absolute -left-3 h-5 w-1.5 bg-yellow-400"></div>
      <p className="text-xl font-extrabold text-persian-blue-950">
        {children}
      </p>
    </div>
  );
}
