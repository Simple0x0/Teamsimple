import React, { useState, useEffect } from 'react';
import style from '../../../../app/Style';
import { fetchCategories, addCategory, } from '../../utils/apiRequest';
import { filterByName } from '../../utils/filter';


export default function CategorySelector({selected, onChange, allowAdd = true }) {
    const [categories, setCategories] = useState([]);
    const [input, setInput] = useState('');
    const [desc, setDesc] = useState('');
    const [filtered, setFiltered] = useState([]);
    const s = style.categorySelector;
    const label = 'Categories';
    useEffect(() => {
        const load = async () => {
        const res = await fetchCategories();
        const normalized = res.data.map(c => ({
            id: c.CategoryID,
            name: c.Name,
        }));
        setCategories(normalized);
        setFiltered(normalized);
        };
        load();
    }, []);

    useEffect(() => {
        setFiltered(filterByName(categories, input));
    }, [input, categories]);

    const handleAdd = async () => {
        if (!input.trim()) return;
        const res = await addCategory({ name: input, description: desc });
        const newCat = res.data;
        const normalized = {
        id: newCat.CategoryID,
        name: newCat.Name,
        };
        const newCategories = [...categories, normalized];
        setCategories(newCategories);
        setFiltered(filterByName(newCategories, ''));
        onChange(normalized);
        setInput('');
        setDesc('');
    };

    const toggle = (item) => {
        if (selected?.id === item.id) {
        onChange(null);
        } else {
        onChange(item);
        }
    };

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

        {selected && selected.name && (
            <div className="flex flex-wrap gap-2 mb-2">
            <span
                className={`${s.categoryItem} ${s.categorySelected} cursor-pointer`}
                onClick={() => toggle(selected)}
                title="Click to clear selection"
            >
                {selected.name} ×
            </span>
            </div>
        )}

        <div className={s.listWrapper}>
            {filtered.length === 0 && (
            <span className="text-gray-500 text-xs">No matching {label} found.</span>
            )}
            {filtered.map(cat => (
            <span
                key={`list-cat-${cat.id}`}
                onClick={() => toggle(cat)}
                className={selected?.id === cat.id ? `${s.categoryItem} ${s.categorySelected}` : s.categoryItem}
            >
                {cat.name}
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