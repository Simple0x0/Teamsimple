import React, { useEffect, useState } from 'react';
import style from '../../../app/Style';
import { useNavigate } from 'react-router-dom';
import '../../../index.css';
import LatestSection from '../ui/LatestSection';
import { fetchHomeLatest } from '../utils/fetchHomeLatest';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Home() {
  const [homeLatest, setHomeLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featured, setFeatured] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeLatest()
      .then(data => {
        setHomeLatest(data);
        setLoading(false);
        if (data && data.length) {
          const sorted = [...data].sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));
          setFeatured(sorted[0]);
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const groupByType = (type) => {
    const sorted = [...homeLatest]
      .filter(item => item.ContentType === type)
      .sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));
    return sorted.slice(0, 3);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* Hero Banner */}
        <section className="w-full relative border border-1 border-lime-900 rounded-3xl overflow-hidden shadow-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-br to-slate-800 opacity-50"></div>
          <div className="relative px-6 md:px-16 py-20 text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">
          Welcome to <span className="text-purple-700">Team Simple</span>
            </h1>
            <p className="text-gray-100 text-lg md:text-xl max-w-3xl leading-relaxed">
          Simplifying the complex—one blog, project, and idea at a time.
            </p>
            <p className="text-gray-100 text-lg md:text-xl max-w-3xl mb-6 leading-relaxed">
          One team. One vision. Simpler, smarter, and more human-centered
            </p>
            <button
          onClick={() => navigate('/blogs')}
          className="mt-2 inline-block bg-lime-400 hover:bg-lime-500 text-slate-900 font-semibold px-8 py-3 rounded-full transition duration-200 shadow-xl"
            >
          Explore Our Content
            </button>
          </div>
        </section>

        {/* Featured */}
      {featured && (
        <section className="mb-16 relative">
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold text-left flex items-center gap-3 relative">
              <span className="relative inline-block">
                <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-lime-400 opacity-20 animate-pulse"></span>
                <span className="relative z-10 text-lime-400 drop-shadow-lg">Recent</span>
              </span>
              <span className="ml-2 animate-bounce inline-block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block align-middle">
                  <circle cx="13" cy="13" r="7" fill="#a3e635"/>
                </svg>
              </span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={featured.Image?.startsWith('http') ? featured.Image : `/${featured.Image}`}
              alt={featured.Title}
              className="w-full md:w-1/2 h-72 object-cover rounded-xl shadow-lg"
            />
            <div className="flex-1 text-gray-300">
              <h3 className="text-2xl font-semibold mb-2">{featured.Title}</h3>
              <p className="mb-4 text-base md:text-lg leading-relaxed">{featured.Description}</p>
              <div className="text-sm text-gray-500">
                <span className="mr-4 bg-slate-700 px-3 py-1 rounded-full text-white">{featured.ContentType}</span>
                <span>{new Date(featured.DateCreated).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading / Error */}
      {loading && <div className="text-gray-400 mb-4 text-center">Loading latest content...</div>}
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {/* Sections */}
      <LatestSection title="Blogs" items={groupByType('Blog')} link="/blogs" iconLeft={<FaChevronLeft />} iconRight={<FaChevronRight />} />
      <LatestSection title="WriteUps" items={groupByType('WriteUp')} link="/writeups" iconLeft={<FaChevronLeft />} iconRight={<FaChevronRight />} />
      <LatestSection title="Projects" items={groupByType('Project')} link="/projects" iconLeft={<FaChevronLeft />} iconRight={<FaChevronRight />} />
      <LatestSection title="Podcasts" items={groupByType('Podcast')} link="/podcasts" iconLeft={<FaChevronLeft />} iconRight={<FaChevronRight />} />
      <LatestSection title="Achievements" items={groupByType('Achievement')} link="/achievements" iconLeft={<FaChevronLeft />} iconRight={<FaChevronRight />} />
      <LatestSection title="Events" items={groupByType('Event')} link="/events" iconLeft={<FaChevronLeft />} iconRight={<FaChevronRight />} />

      {/* CTA */}
      <section className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-12 rounded-2xl shadow-lg mt-24 text-center">
        <h3 className="text-3xl font-bold text-white mb-3">Ready to make an impact?</h3>
        <p className="text-gray-400 mb-6 text-lg">
          Join the team that’s simplifying tech & security for everyone. Future-forward, inclusive, and impactful.
        </p>
        <button
          onClick={() => navigate('/team')}
          className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-full text-lg transition-all"
        >
          Meet the Team
        </button>
      </section>
    </div>
  );
}
