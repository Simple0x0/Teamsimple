// src/components/ui/ContentContainer.jsx
import React from 'react';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import ErrorHandle from './ErrorHandle';

export default function ContentContainer({ loading, error, children }) {
  if (loading) return <div className="min-h-[200px]"><Loading /></div>;
  if (error) return <ErrorHandle type="Blog" errorType="server" message=' ' rightbar={true} />;
  //if (error) return <ErrorMessage message={error} />;
  return <>{children}</>;
}
