import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookshelfSection = ({
  windowSize,
  title,
  topic,
  backgroundColor = "#4F46E5",
  books = [],
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsToShow(2);
      else if (width < 768) setItemsToShow(3);
      else if (width < 1024) setItemsToShow(4);
      else setItemsToShow(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation handlers
  const handleNext = () => {
    setStartIndex((prev) => {
      if (prev + itemsToShow >= books.length) return 0;
      return prev + itemsToShow;
    });
  };

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - itemsToShow));
  };

  // Touch and mouse handlers...
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const dist = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - dist;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const navigateToBookDetail = (bookId, title) => {
    if (!isDragging) {
      navigate("/description-book", { state: { bookId, bookTitle: title } });
    }
  };

  if (books.length === 0) return null;

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = rating || 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-base ${
            i < roundedRating ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center space-x-3 mb-6 md:mb-8">
          <div
            className="h-6 md:h-8 w-1 rounded-full"
            style={{ backgroundColor }}
          />
          <span className="text-indigo-600 font-semibold uppercase tracking-wide text-sm md:text-base">
            {title}
          </span>
        </div>

        {/* Books Carousel Container */}
        <div className="relative px-2 md:px-12">
          {" "}
          {/* Reduced side padding on mobile */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="relative flex gap-3 md:gap-6 px-8 md:px-0" // Added padding for overlapped navigation
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {books.slice(startIndex, startIndex + itemsToShow).map((book) => (
              <div
                key={book.id}
                className="flex-1"
                onClick={() => navigateToBookDetail(book.id, book.title)}
              >
                <div className="group relative transition-all duration-300 hover:scale-105">
                  <div className="relative aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm ring-1 ring-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${book?.formats?.["image/jpeg"]}')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                      <button className="w-full px-4 py-2 rounded-lg bg-white font-medium text-gray-900 hover:bg-opacity-90 transition-colors duration-300 shadow-lg">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4 px-2">
                    <h3 className="text-center text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {book.title}
                    </h3>
                    <p className="mt-1 md:mt-2 text-center text-xs font-medium text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">
                      {book.authors?.[0]?.name || "Unknown Author"}
                    </p>
                    {book.averageRating > 0 && (
                      <div className="flex justify-center items-center mt-2 gap-2">
                        <div className="flex space-x-0.5">
                          {renderStars(book.averageRating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          {book.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Navigation Buttons */}
          {books.length > itemsToShow && (
            <>
              {startIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2
                           w-8 h-8 md:w-10 md:h-10
                           flex items-center justify-center
                           rounded-full
                           bg-white/90
                           hover:bg-white
                           shadow-lg hover:shadow-xl
                           transition-all duration-300 group z-10"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300" />
                </button>
              )}

              {startIndex + itemsToShow < books.length && (
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2
                           w-8 h-8 md:w-10 md:h-10
                           flex items-center justify-center
                           rounded-full
                           bg-white/90
                           hover:bg-white
                           shadow-lg hover:shadow-xl
                           transition-all duration-300 group z-10"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookshelfSection;
