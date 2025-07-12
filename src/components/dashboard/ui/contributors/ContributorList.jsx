import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import style from '../../../../app/Style';

export default function ContributorList({ contributors = [], showActions = true }) {
  const navigate = useNavigate();
  const s = style.contributorList;

  if (!contributors || contributors.length === 0) {
    return <p className={s.noData}>No contributors available.</p>;
  }

  const handleDeleteContributor = (contributorId) => {
    console.log('Delete Contributor:', contributorId);
    // TODO: API call to delete contributor
  };

  return (
    <div className={s.wrapper}>
      {contributors.map((c) => (
        <div key={c.ContributorID} className={s.item}>
          {/* Contributor Info */}
          <div className={s.left}>
            <img src={c.ProfilePicture} alt={c.Username} className={s.thumbnail} />
            <div className={s.info}>
              <h3 className={s.title}>{c.FullName}</h3>
              <p className={s.meta}>
                Username: <span className={s.metaValue}>{c.Username}</span> &nbsp;|&nbsp;
                Type: <span className={s.metaValue}>{c.Type}</span>
              </p>
              <p className={s.summary}>{c.Bio}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className={s.actions}>
              <Link
                to={`/dashboard/contributors/edit`}
                state={{ contributor: c }}
                className={s.actionBtn.edit}
                title="Edit"
              >
                <FaEdit />
              </Link>
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
  );
}
