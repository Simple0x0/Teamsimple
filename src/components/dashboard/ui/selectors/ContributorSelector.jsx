import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../../../../app/Style';
import { fetchContributors } from '../../utils/apiRequest';
import { filterByName } from '../../utils/filter';

export default function ContributorSelector({
  selected = [],
  onChange,
  allowAdd = true,
  content = '',
  slug = '',
  label = '',
}) {
  const [contributors, setContributors] = useState([]);
  const [input, setInput] = useState('');
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();
  const s = style.categorySelector;

  useEffect(() => {
    const load = async () => {
      const res = await fetchContributors(content, slug);
      const normalized = res.Contributors.map(c => ({
        id: c.ContributorID,
        name: c.Username,
      }));
      setContributors(normalized);
      setFiltered(normalized);
    };
    load();
  }, [content, slug]);

  useEffect(() => {
    setFiltered(filterByName(contributors, input));
  }, [input, contributors]);

  const toggle = (item) => {
    const exists = selected.some(i => i.id === item.id);
    if (exists) {
      onChange(selected.filter(i => i.id !== item.id));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className={s.wrapper}>
      <label className="text-sm text-gray-300">{label ? label : 'Contributors'}</label>
      <input
        className={s.input}
        type="text"
        placeholder={`Search ${label ? label : 'Contributors'}...`}
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {selected?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(con => (
            <span
              key={`selected-contributor-${con.id}`}
              className={`${s.categoryItem} ${s.categorySelected} cursor-pointer`}
              onClick={() => toggle(con)}
              title="Click to remove"
            >
              {con.name} ×
            </span>
          ))}
        </div>
      )}

      <div className={s.listWrapper}>
        {filtered.length === 0 && (
          <span className="text-gray-500 text-xs">No matching contributors found.</span>
        )}
        {filtered.map(con => (
          <span
            key={`list-contributor-${con.id}`}
            onClick={() => toggle(con)}
            className={selected.some(i => i.id === con.id) ? `${s.categoryItem} ${s.categorySelected}` : s.categoryItem}
          >
            {con.name}
          </span>
        ))}
      </div>

      {allowAdd && input && !contributors.some(c => c.name.toLowerCase() === input.toLowerCase()) && (
        <div className="mt-3">
          <button
            className={s.addBtn}
            onClick={() => navigate('/dashboard/contributors/add')}
          >
            + Add New
          </button>
        </div>
      )}
    </div>
  );
}
