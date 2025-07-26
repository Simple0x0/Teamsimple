import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { postContributor } from '../../utils/apiContributorRequests';
import MessageToast from '../MessageToast';
import ContributorModal from './ContributorModal';
import style from '../../../../app/Style';

export default function ContributorList({ contributors = [], showActions = true }) {
  const s = style.contributorList;
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });
  const [showModal, setShowModal] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [contributorList, setContributorList] = useState(contributors);

  const handleTypeChange = async (contributor, newType) => {
    const result = await postContributor({
      contributorData: { ...contributor, Type: newType },
      action: 'edit',
    });

    if (result.success) {
      setContributorList((prevList) =>
        prevList.map((c) =>
          c.ContributorID === contributor.ContributorID
            ? { ...c, Type: newType }
            : c
        )
      );
      setToast({ visible: true, message: 'Contributor type updated.', type: 'success', duration: 3000 });
    } else {
      setToast({ visible: true, message: `Update failed: ${result.error}`, type: 'failure', duration: 5000 });
    }
  };

  useEffect(() => {
    setContributorList([...contributors]);
  }, [contributors]);

 const handleModalSuccess = (message, contributor) => {
    setContributorList((prevList) => {
      const exists = prevList.find(c => c.ContributorID === contributor.ContributorID);
      if (exists) {
        return prevList.map(c => c.ContributorID === contributor.ContributorID ? contributor : c);
      }
      return [contributor, ...prevList];
    });

    setToast({ visible: true, message: message, type: 'success', duration: 3000 });
    setShowModal(false);
    setSelectedContributor(null);
  };


  const handleDeleteContributor = async (contributorId) => {
    const result = await postContributor({
      contributorData: { ContributorID: contributorId },
      action: 'delete',
    });

    if (result.success) {
      setToast({ visible: true, message: 'Contributor deleted successfully.', type: 'success', duration: 3000 });
      setContributorList(prev => prev.filter(c => c.ContributorID !== contributorId));
    } else {
      setToast({ visible: true, message: `Failed to delete contributor: ${result.error}`, type: 'failure', duration: 5000 });
    }
  };

  const handleEditClick = (contributor) => {
    setSelectedContributor(contributor);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedContributor(null);
  };

  if (!contributorList || contributorList.length === 0) {
    return <p className={s.noData}>No contributors available.</p>;
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
        <ContributorModal
          isOpen={showModal}
          onClose={handleModalClose}
          initialContributor={selectedContributor}
          onSuccess={handleModalSuccess}
        />
      )}

      <div className={s.wrapper} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {contributorList.map((c) => (
          <div key={c.ContributorID} className={s.item}>
            <img src={c.ProfilePicture} alt={c.Username} className={s.thumbnail} />
            <h3 className={s.title}>{c.FullName}</h3>
            <p className={s.meta}>
              Username: <span className={s.metaValue}>{c.Username}</span>
            </p>
            <select
              value={c.Type}
              onChange={(e) => handleTypeChange(c, e.target.value)}
              className={s.typeDropdown}
            >
              {['Guest', 'Author', 'Editor', 'Speaker', 'Member', 'Contributor'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className={s.summary}>{c.Bio}</p>

            {showActions && (
              <div className={s.actionsBar}>
                <button
                  className={s.actionBtn.edit}
                  title="Edit"
                  onClick={() => handleEditClick(c)}
                >
                  <FaEdit />
                </button>
                <button
                  className={s.actionBtn.delete}
                  onClick={() => handleDeleteContributor(c.ContributorID)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
