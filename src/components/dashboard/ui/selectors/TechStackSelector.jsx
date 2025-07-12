import React, { useState, useEffect } from 'react';
import style from '../../../app/Style';
import { fetchTechStacks, addTechStack, } from '../../utils/apiRequest';
import { filterByName } from '../../utils/filter';


export default function TechStackSelector({ selected = [], onChange, allowAdd = true }) {
  const [techStacks, setTechStacks] = useState([]);
  const [input, setInput] = useState('');
  const [desc, setDesc] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchTechStacks();
      const normalized = res.data.map(t => ({ id: t.TechStackID, name: t.Name }));
      setTechStacks(normalized);
      setFiltered(normalized);
    };
    load();
  }, []);

  useEffect(() => {
    setFiltered(filterByName(techStacks, input));
  }, [input, techStacks]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const res = await addTechStack({ name: input, description: desc });
    const newStack = res.data;
    const normalized = { id: newStack.TechStackID, name: newStack.Name };
    const newStacks = [...techStacks, normalized];
    setTechStacks(newStacks);
    setFiltered(filterByName(newStacks, ''));
    onChange([...selected, normalized]);
    setInput('');
    setDesc('');
  };

  const toggle = (item) => {
    const exists = selected.some(i => i.id === item.id);
    if (exists) {
      onChange(selected.filter(i => i.id !== item.id));
    } else {
      onChange([...selected, item]);
    }
  };

  const s = style.categorySelector;

  return (
    <div className={s.wrapper}>
      <label className="text-sm text-gray-300">Tech Stacks</label>
      <input
        className={s.input}
        type="text"
        placeholder="Search or add Tech Stacks..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      {selected?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(stack => (
            <span
              key={`selected-stack-${stack.id}`}
              className={`${s.categoryItem} ${s.categorySelected} cursor-pointer`}
              onClick={() => toggle(stack)}
              title="Click to remove"
            >
              {stack.name} ×
            </span>
          ))}
        </div>
      )}

      <div className={s.listWrapper}>
        {filtered.length === 0 && (
          <span className="text-gray-500 text-xs">No matching tech stacks found.</span>
        )}
        {filtered.map(stack => (
          <span
            key={`list-stack-${stack.id}`}
            onClick={() => toggle(stack)}
            className={selected.some(i => i.id === stack.id) ? `${s.categoryItem} ${s.categorySelected}` : s.categoryItem}
          >
            {stack.name}
          </span>
        ))}
      </div>

      {allowAdd && input && filtered.length === 0 && (
        <div className="mt-2">
          <textarea
            className={s.descriptionInput}
            placeholder="Optional description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button onClick={handleAdd} className={s.addBtn}>+ Add "{input}"</button>
        </div>
      )}
    </div>
  );
}
