import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from './EventList';
import EventParticipants from './EventParticipants';
import style from '../../../../app/Style';

const tabs = [
  { key: 'EventList', label: 'Event Lists' },
  { key: 'EventParticipants', label: 'Event Participants' },
];

export default function EventMgmt() {
  const [activeTab, setActiveTab] = useState('EventList');
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeTab) {
      case 'EventList':
        return <EventList />;
      case 'EventParticipants':
        return <EventParticipants />;
      default:
        return null;
    }
  };
  const s = style.blogMgmt;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Events</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/events/new')}>
            + Add New
          </button>
          <button className={s.actionBtn}>Export</button>
        </div>
      </div>


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
    </div>
  );
}
