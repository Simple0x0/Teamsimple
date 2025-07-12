import React, { useState, useEffect } from 'react';
import style from '../../../../app/Style';
import { fetchTags, addTag, } from '../../utils/apiRequest';
import { filterByName } from '../../utils/filter';

export default function TagSelector({ selected = [], onChange, allowAdd = true }) {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  const [filtered, setFiltered] = useState([]);
  const label = "Tags";

  useEffect(() => {
  const load = async () => {
    const res = await fetchTags();
    const normalized = res.data.map(t => ({ id: t.TagID, name: t.Name }));
    setTags(normalized);
    setFiltered(normalized);

    // Normalize default tags selected
    const reconciledSelected = selected.map(sel => {
      const selName = typeof sel === 'string' ? sel
                     : typeof sel === 'object' && sel?.name ? sel.name
                     : null;

      if (!selName) return sel;

      const match = normalized.find(tag => tag.name.toLowerCase() === selName.toLowerCase());
      return match || sel;
    });

    onChange(reconciledSelected);
  };
  load();
}, []);



  useEffect(() => {
    setFiltered(filterByName(tags, input));
  }, [input, tags]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const res = await addTag({ name: input, type: 'tag' });
    const newTag = res.data ;
    const normalizedTag = { id: newTag.TagID, name: newTag.Name };
    const newTags = [...tags, normalizedTag];
    const updated = [...selected, normalizedTag];
    setTags(newTags);
    setFiltered(filterByName(newTags, input));
    onChange(updated);
    setInput('');
  };

  const toggle = (tag) => {
    if (selected.some(t => t.id === tag.id)) {
      onChange(selected.filter(t => t.id !== tag.id));
    } else {
      onChange([...selected, tag]);
    }
  };

  const s = style.tagSelector;

  return (
    <div className={s.wrapper}>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        className={s.input}
        type="text"
        placeholder={`Search or add ${label}...`}
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(tag => (
            <span
              key={`selected-tag-${tag.id || tag.name || tag}`}
              className={`${s.tagItem} ${s.tagSelected} cursor-pointer`}
              onClick={() => toggle(tag)}
              title="Click to remove"
            >
              {tag.name} ×
            </span>
          ))}
        </div>
      )}

      <div className={s.listWrapper}>
        {filtered.length === 0 && (
          <span className="text-gray-500 text-xs">No matching tags found.</span>
        )}
        {filtered.map(tag => (
          <span
            key={`list-tag-${tag.id}`}
            onClick={() => toggle(tag)}
            className={selected.some(t => t.id === tag.id) ? `${s.tagItem} ${s.tagSelected}` : s.tagItem}
          >
            {tag.name}
          </span>
        ))}
        {allowAdd && input && !tags.some(tag => tag.name?.toLowerCase() === input.toLowerCase()) && (
          <button onClick={handleAdd} className={s.addBtn}>+ Add "{input}"</button>
        )}
      </div>
    </div>
  );
}
