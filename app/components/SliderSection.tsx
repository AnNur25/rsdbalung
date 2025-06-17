import { useState, useEffect, useRef, type ReactNode } from "react";
import TextWithRect from "./TextWithRect";

interface SliderProps {
  title: string;
  subtitle: string;
  description: string;
  navInside?: boolean;
  overlapSize?: number;
  children: ReactNode[]; // Accept an array of ReactNode as slides
}

export default function SliderSection({
  title,
  subtitle,
  description,
  navInside = false,
  overlapSize = 16,
  children,
}: SliderProps) {
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
  const overlapEm = overlapSize * 4 || 0;
  return (
    <section className="flex flex-col items-center bg-gradient-to-b from-dark-blue-900 to-dark-blue-950 max-sm:gap-y-2 lg:flex-row lg:gap-x-8 lg:ps-8">
      <div className="flex flex-col gap-6 px-6 py-8 text-white min-md:flex-1">
        <TextWithRect leftShifted={false} textColor="text-white">
          {title}
        </TextWithRect>
        <h2 className="text-2xl font-black lg:text-4xl">{subtitle}</h2>

        <p className="text-justify lg:text-lg">{description}</p>

        {/* <div className="relative mt-6 flex flex-col items-center"> */}
        {/* Navigation Buttons */}
        <div className="flex w-fit items-center justify-between gap-6">
          <button
            onClick={prevSlide}
            className="rounded-full bg-white/80 p-2 text-black shadow transition hover:bg-white"
            aria-label="Previous slide"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {/* Dots Navigation */}
          <div className="flex items-center justify-center space-x-2">
            {children.map((_, index) => (
              <button
                key={index}
                className={`h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "w-8 shadow-md" : "w-3"
                } bg-white`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              ></button>
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="rounded-full bg-white/80 p-2 text-black shadow transition hover:bg-white"
            aria-label="Next slide"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* </div> */}

      <div
        className="relative h-full max-w-full overflow-hidden bg-white min-md:flex-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Content Track - Flexbox for showing next content dynamically */}
        <div
          ref={sliderRef}
          className="flex w-fit transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (childWidth - overlapEm)}px)`, // Move the track dynamically
          }}
        >
          {children.map((child, index) => (
            <div key={index} className={`grow ${overlapSize ? `-mr-16` : ""}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
