import React from 'react';
import { FaSearch } from "react-icons/fa";
import style from '../../../app/Style';

export default function Search({ 
    title = "Search", 
    placeholder = "Search...", 
    filterOptions = [], 
    onSearchChange, 
    onFilterChange,
    showFilter = true // toggle visibility
}) {
    const handleSearchInput = (e) => {
        onSearchChange?.(e.target.value);
    };

    const handleFilterSelect = (e) => {
        const value = e.target.value;
        onFilterChange?.(value ? [value] : []);
    };

    return (
        <div className={style.search.container}>
            <div className={style.search.inputContainer}>
                <h1 className={style.search.header}>{title}</h1>

                {/* Search Input */}
                <div className={`${style.search.searchBox}  ${!showFilter ? 'flex-1' : ''}`}>
                    <FaSearch className={style.search.icon} />
                    <input 
                        id="main-search"
                        name="main-search"
                        type="text" 
                        placeholder={placeholder} 
                        className={style.search.input}
                        onChange={handleSearchInput}
                    />
                </div>

                {/* Optional Filter Dropdown */}
                {showFilter && filterOptions.length > 0 && (
                    <select 
                        id="main-filter"
                        name="main-filter"
                        className={style.search.dropdown}
                        onChange={handleFilterSelect}
                    >
                        <option value="">Filter</option>
                        {filterOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}
