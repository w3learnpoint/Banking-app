// utils/sortUtils.js
import React from 'react';

/**
 * Sort array of objects by a specified field and order.
 * Supports nested fields via dot notation (e.g., "role.name").
 * 
 * @param {Array} data - Array to sort.
 * @param {string} field - Field name or nested path (e.g., "role.name").
 * @param {'asc' | 'desc'} order - Sort order (default: "asc").
 * @returns {Array}
 */
export const sortByField = (data, field, order = 'asc') => {
    const getValue = (obj, path) =>
        path.split('.').reduce((acc, part) => acc && acc[part], obj);

    return [...data].sort((a, b) => {
        const valA = (getValue(a, field) || '').toString().toLowerCase();
        const valB = (getValue(b, field) || '').toString().toLowerCase();

        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
};

/**
 * Render sort icon for a given column.
 * 
 * @param {string} field - Column field name.
 * @param {string} currentField - Currently active sort field.
 * @param {'asc' | 'desc'} currentOrder - Current sort order.
 * @returns {JSX.Element}
 */
export const renderSortIcon = (field, currentField, currentOrder) => {
    if (field !== currentField) return <span className="ms-1">⇅</span>;
    return currentOrder === 'asc' ? <span className="ms-1">↑</span> : <span className="ms-1">↓</span>;
};
