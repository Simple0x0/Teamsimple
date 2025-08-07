
import React, { useEffect, useState } from 'react';
import { fetchAllTeamMembers } from '../utils/team';
import AuthorProfileModal from '../modals/AuthorProfileModal';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';

export default function TheTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bioModal, setBioModal] = useState({ open: false, member: null });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAllTeamMembers()
      .then(setMembers)
      .catch(() => setError('Failed to load team members'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-lime-400 py-8">Loading team...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-lime-400 mb-8 text-center">Meet the Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {members.map(member => (
          <div key={member.TeamMemberID || member.id} className="bg-slate-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-lime-700 hover:shadow-2xl transition">
            <img
              src={member.ProfilePicture || '/default-avatar.jpg'}
              alt={member.Username}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-lime-400 shadow"
            />
            <h3 className="text-sm text-lime-300 mb-1">{`@${member.Username}`}</h3>
            {/* Social Links */}
            {Array.isArray(member.SocialLinks) && member.SocialLinks.length > 0 && (
              <div className="flex gap-2 mb-2">
                {member.SocialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-800 hover:text-lime-200 text-md"
                  >
                    <span>{link.Platform}</span>
                  </a>
                ))}
              </div>
            )}
            {/* Bio Preview and Read More */}
            <p className="text-gray-300 text-sm mb-2">
              {member.BioPreview || member.Bio}
              {member.Bio && member.BioPreview && member.Bio !== member.BioPreview && (
                <>
                  {' '}
                  <button
                    className="text-lime-400 underline ml-1 hover:text-lime-200"
                    onClick={() => setBioModal({ open: true, member })}
                  >
                    Read more
                  </button>
                </>
              )}
            </p>
            {/* AuthorProfileModal for full bio */}
            {bioModal.open && bioModal.member?.TeamMemberID === member.TeamMemberID && (
              <AuthorProfileModal
                isOpen={bioModal.open}
                onClose={() => setBioModal({ open: false, member: null })}
                username={member.Username}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
