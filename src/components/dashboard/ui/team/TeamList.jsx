import React, { useState, useEffect } from 'react';
import { FaEdit, FaBan, FaPauseCircle, FaCheckCircle } from 'react-icons/fa';
import { postTeamMember } from '../../utils/apiTeamRequest';
import MessageToast from '../MessageToast';
import TeamModal from './TeamModal';
import style from '../../../../app/Style';

export default function TeamList({ team = [], showActions = true }) {
  const s = style.teamList;
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamList, setTeamList] = useState([...team]);

  const handleRoleChange = async (member, newRole) => {
    const result = await postTeamMember({
      memberData: { ...member, Role: newRole },
      action: 'edit',
    });

    if (result.success) {
      setTeamList(prev =>
        prev.map(m =>
          m.TeamMemberID === member.TeamMemberID ? { ...m, Role: newRole } : m
        )
      );
      setToast({ visible: true, message: result.data.message, type: 'success', duration: 3000 });
    } else {
      setToast({ visible: true, message: result.error, type: 'failure', duration: 5000 });
    }
  };
  useEffect(() => {
      setTeamList([...team]);
  }, [team]);
    
  const handleStatusChange = async (member, status) => {
    const result = await postTeamMember({
      memberData: { Username: member.Username, TeamMemberID: member.TeamMemberID },
      action: status.toLowerCase(),
    });

    if (result.success) {
      setTeamList(prev =>
        prev.map(m =>
          m.TeamMemberID === member.TeamMemberID ? { ...m, Status: status } : m
        )
      );
      setToast({ visible: true, message: result.data.message, type: 'success', duration: 3000 });
    } else {
      setToast({ visible: true, message: result.error, type: 'failure', duration: 5000 });
    }
  };

  const handleModalSuccess = (message, member) => {
    setTeamList(prev => {
      const exists = prev.find(m => m.TeamMemberID === member.TeamMemberID);
      if (exists) {
        return prev.map(m => m.TeamMemberID === member.TeamMemberID ? member : m);
      }
      return [member, ...prev];
    });
    setToast({ visible: true, message, type: 'success', duration: 3000 });
    setShowModal(false);
    setSelectedMember(null);
  };

  const handleEditClick = member => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  if (!teamList || teamList.length === 0) {
    return <p className={s.noData}>No team members available.</p>;
  }

  return (
    <>
      {toast.visible && (
        <MessageToast
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}

      {showModal && (
        <TeamModal
          isOpen={showModal}
          onClose={handleModalClose}
          initialMember={selectedMember}
          onSuccess={handleModalSuccess}
          New={false}
        />
      )}

      <div className=''>
        <div className={s.wrapper}>
          {teamList.map((m) => (
            <div key={m.TeamMemberID} className={s.item}>
              <span className={`${s.statusDot} ${s.status[m.Status?.toLowerCase()] || s.status.active}`} />
              <img src={m.ProfilePicture} alt={m.Username} className={s.thumbnail} />
              <h3 className={s.title}>{m.FullName}</h3>
              <p className={s.meta}>
                Username: <span className={s.metaValue}>{m.Username}</span>
              </p>
              <select
                value={m.Role}
                onChange={(e) => handleRoleChange(m, e.target.value)}
                className={s.typeDropdown}
              >
                {['Member', 'Admin', 'Superadmin'].map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <p className={s.summary}>{m.Bio}</p>

              {showActions && (
                <div className={s.actionsBar}>
                  <button
                    className={s.actionBtn.edit}
                    title="Edit"
                    onClick={() => handleEditClick(m)}
                  >
                    <FaEdit />
                  </button>
                  {m.Status !== 'Banned' && (
                    <button className={s.actionBtn.ban} title="Ban" onClick={() => handleStatusChange(m, 'banned')}>
                      <FaBan />
                    </button>
                  )}
                  {m.Status !== 'Suspended' && (
                    <button className={s.actionBtn.suspend} title="Suspend" onClick={() => handleStatusChange(m, 'suspend')}>
                      <FaPauseCircle />
                    </button>
                  )}
                  {m.Status !== 'Active' && (
                    <button className={s.actionBtn.activate} title="Activate" onClick={() => handleStatusChange(m, 'active')}>
                      <FaCheckCircle />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
