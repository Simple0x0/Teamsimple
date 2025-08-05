import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function LatestSection({ title, items = [], link }) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;

  const maxIndex = items.length - 1;
  const showPrev = index > 0;
  const showNext = index < maxIndex;

  return (
    <section className="w-full mb-20">
      <div className="flex justify-between items-center mb-6 px-2 md:px-0">
        <h3 className="text-xl md:text-2xl font-bold text-lime-400">{title}</h3>
        {link && (
          <a
            href={link}
            className="text-sm md:text-base text-blue-400 hover:underline flex items-center gap-1"
          >
            See More <FaChevronRight className="inline-block text-xs mt-0.5" />
          </a>
        )}
      </div>
      <div className="relative flex items-center justify-center w-full group">
        {/* Prev Icon - fixed on mobile, visible on hover otherwise */}
        {showPrev && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 text-lime-400 rounded-full p-2 shadow-lg transition-opacity
              opacity-0 group-hover:opacity-100 md:opacity-100 md:hover:opacity-100"
            style={{ pointerEvents: showPrev ? 'auto' : 'none' }}
            onClick={() => setIndex(index - 1)}
            aria-label="Previous"
          >
            <FaChevronLeft size={28} />
          </button>
        )}

        {/* Carousel Item */}
        <a
          href={`/${items[index].ContentType.toLowerCase()}s/${items[index].Slug || ''}`}
          className="block w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 px-0 md:px-8"
        >
          {items[index].Image && (
            <img
              src={items[index].Image.startsWith('http') ? items[index].Image : `/${items[index].Image}`}
              alt={items[index].Title}
              className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="p-5 flex flex-col justify-between">
            <h4 className="text-white text-md md:text-xl font-semibold mb-2 line-clamp-2">
              {items[index].Title}
            </h4>
            <p className="text-gray-400 text-sm md:text-base line-clamp-3 mb-3">
              {items[index].Description}
            </p>
            <div className="flex justify-between text-xs md:text-sm text-gray-500">
              <span>{items[index].ContentType}</span>
              <span>{new Date(items[index].DateCreated).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </a>

        {/* Next Icon - fixed on mobile, visible on hover otherwise */}
        {showNext && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 text-lime-400 rounded-full p-2 shadow-lg transition-opacity
              opacity-0 group-hover:opacity-100 md:opacity-100 md:hover:opacity-100"
            style={{ pointerEvents: showNext ? 'auto' : 'none' }}
            onClick={() => setIndex(index + 1)}
            aria-label="Next"
          >
            <FaChevronRight size={28} />
          </button>
        )}
      </div>
    </section>
  );
}
