import React, { useEffect, useState } from 'react';
import { fetchTeamSection } from '../utils/team';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import ContentMDRender from '../contents/ContentMDRender';

export default function TeamWhoWeAre() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTeamSection('AboutUs')
      .then(setContent)
      .catch(() => setError('Failed to load section'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Who We Are" errorType="server" message={error ?? 'Unknown error'} />;
  if (!content) return null;

  // ContentMDRender expects an object with a Content property
  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-lime-400 mb-6">Who We Are</h2>
      <ContentMDRender
        Header={() => null}
        Contents={{ Content: content ?? '' }}
        Footer={() => null}
      />
    </section>
  );
}
