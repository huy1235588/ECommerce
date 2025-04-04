import { Product } from '@/types/product';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import '@/styles/components/ui/dataGridView.css';
import dayjs from 'dayjs';

interface Column {
    key: keyof Product;
    label?: string;
    sortAble?: boolean;
    style?: React.CSSProperties;
    width?: number;
    renderCell?: (value: Product[keyof Product], row: Product) => React.ReactNode;
}
interface DataGridProps {
    columns: Column[];
    data: Product[];
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRowsPerPage: number) => void;
    onSort: (column: string, direction: 'asc' | 'desc') => void;
    onSearch: (query: string) => void;
    onRowClick?: (id: number) => void;
    isLoading?: boolean;
}

const DataGrid: React.FC<DataGridProps> = ({
    columns,
    data,
    total,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onSort,
    onSearch,
    onRowClick,
    isLoading = false,
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [orderBy, setOrderBy] = useState<string>(columns[0].key);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Handler cho tìm kiếm với debounce
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handler cho tìm kiếm với debounce
    const debouncedHandleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Clear timeout cũ
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set timeout mới
        timeoutRef.current = setTimeout(() => {
            onSearch(query);
        }, 500);
    }, [onSearch]);

    // Dọn dẹp timeout khi component unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Handler cho sắp xếp
    const handleSort = (column: string) => {
        let newSortDirection: 'asc' | 'desc' = 'asc';
        if (orderBy === column) {
            newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        }
        setOrderBy(column);
        setSortDirection(newSortDirection);
        onSort(column, newSortDirection); // Thông báo cho component cha
    };

    // Handler cho thay đổi số hàng trên mỗi trang
    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRowsPerPage = parseInt(e.target.value);
        onRowsPerPageChange(newRowsPerPage); // Thông báo cho component cha
    };

    // Handler cho click vào row
    const handleClickRow = (id: number | undefined) => {
        if (onRowClick && id !== undefined) {
            onRowClick(id);
        }
    };

    // Render search input
    const renderSearch = () => (
        <div className="search-container">
            <div className="search-input-container">
                <span className="search-icon">
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        className="searchIcon"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                    </svg>
                </span>
                <input
                    className="data-grid-search"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={debouncedHandleSearch}
                    onFocus={(e) => e.currentTarget.parentElement?.parentElement?.classList.add('focus')}
                    onBlur={(e) => e.currentTarget.parentElement?.parentElement?.classList.remove('focus')}
                />
            </div>
            <button
                className="button-clear"
                type="button"
                onClick={() => setSearchQuery('')}
            >
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
                </svg>
            </button>
        </div>
    );

    // Render table header
    const renderTh = () => (
        <>
            {columns.map((col) => (
                <th
                    key={col.key}
                    onClick={col.sortAble !== false ? () => handleSort(col.key) : undefined}
                    style={{
                        ...col.style,
                        width: col.width,
                    }}
                >
                    {col.label || ''}
                    {col.sortAble !== false && (
                        <span className={`sort-icon ${orderBy === col.key ? sortDirection : ''}`}></span>
                    )}
                </th>
            ))}
        </>
    );

    // Hàm render cell của table
    const renderTd = (row: Product) => (
        <>
            {columns.map((col) => {
                // Xử lý giá trị trước khi render
                const cellValue = row[col.key];
                let displayValue: React.ReactNode = '';

                if (dayjs.isDayjs(cellValue)) {
                    // Convert Dayjs sang string
                    displayValue = cellValue.format('YYYY-MM-DD');
                } else if (cellValue instanceof Date) {
                    // Convert Date sang string
                    displayValue = cellValue.toLocaleDateString();
                } else if (typeof cellValue === 'boolean') {
                    // Xử lý boolean
                    displayValue = cellValue ? 'Yes' : 'No';
                } else if (Array.isArray(cellValue)) {
                    // Convert array sang string
                    displayValue = JSON.stringify(cellValue);
                } else if (cellValue instanceof File) {
                    // Handle File objects
                    displayValue = cellValue.name;
                } else if (typeof cellValue === 'object' && cellValue !== null) {
                    // Convert objects sang string
                    displayValue = JSON.stringify(cellValue);
                } else {
                    // Giữ nguyên các giá trị hợp lệ hoặc convert sang string
                    displayValue = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
                }

                return (
                    <td
                        key={col.key}
                        style={{ width: col.width, ...col.style }}
                    >
                        <div className="data-grid-cell" style={col.style}>
                            {col.renderCell
                                ? col.renderCell(row[col.key], row)
                                : displayValue
                            }
                        </div>
                    </td>
                );
            })}
        </>
    );

    // Hàm render table
    const renderTable = () => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        const rows = data.slice(start, end);

        return (
            <table className="data-grid-table">
                <thead>
                    <tr>{renderTh()}</tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={row._id}
                            className="data-grid-row"
                            data-id={row._id}
                            onClick={() => handleClickRow(row._id)}
                        >
                            {renderTd(row)}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Render rows per page selection
    const renderRowsPerPage = () => (
        <div className="data-grid-rows-per-page">
            <label htmlFor="rowsPerPage">Rows per page:</label>
            <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                {[5, 10, 25, 50].map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );

    // Render pagination controls
    const totalPages = Math.ceil(total / rowsPerPage);
    const renderPagination = () => (
        <div className="data-grid-pagination">
            <button disabled={page === 1} onClick={() => onPageChange(page - 1)} data-action="prev">
                Previous
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} data-action="next">
                Next
            </button>
        </div>
    );

    return (
        <div className="data-grid-container">
            {renderSearch()}
            <div id="data-grid-table-container" className="data-grid-table-container">
                {renderTable()}
                {isLoading && (
                    <div className="data-grid-loading">
                        <div className="loading-spinner"></div>
                    </div>
                )}
                {total === 0 &&
                    <div className="data-grid-no-data">No data</div>
                }
                <div className="data-grid-footer">
                    {renderRowsPerPage()}
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
};

export default DataGrid;