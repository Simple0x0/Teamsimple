import React from 'react';

export default function TeamJoin() {
  return (
    <section className="max-w-3xl mx-auto py-12 px-6 text-center">
      <h2 className="text-3xl font-bold text-lime-400 mb-6">Join Team Simple</h2>
      <p className="text-lg text-white mb-4">Interested in joining our team? Fill out the application form and become part of our mission!</p>
      <button className="py-4 px-8 bg-gradient-to-r from-lime-400 to-lime-600 text-slate-950 font-bold rounded-full shadow-xl hover:from-lime-500 hover:to-lime-700 border-2 border-lime-300 text-lg">Apply Now</button>
      {/* Add form or link to application here */}
    </section>
  );
}
