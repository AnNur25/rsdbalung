import { useState, useEffect, useRef, type ReactNode } from "react";

interface SliderProps {
  children: ReactNode[]; // Accept an array of ReactNode as slides
}

export default function Slider({ children }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [childWidth, setChildWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (sliderRef.current) {
      const firstChild = sliderRef.current.firstElementChild as HTMLElement;
      if (firstChild) {
        setChildWidth(firstChild.offsetWidth);
      }
    }
  }, [children]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000); // Change slide every 3 seconds
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50) {
        nextSlide(); // Swipe left
      } else if (diff < -50) {
        prevSlide(); // Swipe right
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative max-w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content Track - Flexbox for showing next content dynamically */}
      <div
        ref={sliderRef}
        className="mb-12 flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * childWidth}px)`, // Move the track dynamically
        }}
      >
        {children.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}

        {/* {children.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))} */}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute bottom-0 left-0 rounded-full p-2 text-black transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 bottom-0 rounded-full p-2 text-black transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full ${
              index === currentIndex
                ? "w-8 bg-persian-blue-950 shadow-md"
                : "w-3 bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
