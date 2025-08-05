import React from 'react';
import style from '../../../../app/Style';

export default function EventHeader({ event }) {
  if (!event) return null;
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-center mb-8">
      {event.Image && (
        <img
          src={event.Image}
          alt={event.Title}
          className="w-full md:w-1/3 h-56 object-cover rounded-xl shadow-lg"
        />
      )}
      <div className="flex-1 text-gray-300">
        <h2 className="text-3xl font-bold text-lime-400 mb-2">{event.Title}</h2>
        <p className="mb-4 text-base md:text-lg leading-relaxed">{event.Description}</p>
        <div className="text-sm text-gray-500 mb-2">
          <span className="mr-4 bg-slate-700 px-3 py-1 rounded-full text-white">{event.Type}</span>
          <span>{new Date(event.Date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="text-sm text-gray-400">
          <span className="mr-4">Location: {event.Location}</span>
          {event.Status && <span>Status: {event.Status}</span>}
        </div>
      </div>
    </div>
  );
}
