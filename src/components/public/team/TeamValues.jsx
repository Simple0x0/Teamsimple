import React, { useEffect, useState } from 'react';
import { fetchTeamSection } from '../utils/team';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import ContentMDRender from '../contents/ContentMDRender';

export default function TeamValues() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTeamSection('Values')
      .then(setContent)
      .catch(() => setError('Failed to load section'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Values" errorType="server" message={error} />;
  if (!content) return null;

  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-lime-400 mb-6">Our Values</h2>
      <ContentMDRender
        Header={() => null}
        Contents={{ Content: content }}
        Footer={() => null}
      />
    </section>
  );
}
