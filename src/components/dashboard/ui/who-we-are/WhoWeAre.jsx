import { useState } from 'react';
import AboutTeam from './AboutTeam';
import VisionMission from './VisionMission';
import Values from './Values';

const tabs = [
  { key: 'AboutTeam', label: 'About Team' },
  { key: 'VisionMission', label: 'Vision & Mission' },
  { key: 'Values', label: 'Values' },
];

export default function WhoWeAre() {
  const [activeTab, setActiveTab] = useState('AboutTeam');

  const renderComponent = () => {
    switch (activeTab) {
      case 'AboutTeam':
        return <AboutTeam />;
      case 'VisionMission':
        return <VisionMission />;
      case 'Values':
        return <Values />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6 border-b border-lime-800 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium rounded-t border-b-2 transition-colors duration-200 ${
              activeTab === tab.key
                ? 'text-lime-400 border-lime-400'
                : 'text-gray-400 border-transparent hover:text-lime-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{renderComponent()}</div>
    </div>
  );
}
