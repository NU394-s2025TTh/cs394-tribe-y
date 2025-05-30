import React, { useState, useEffect } from 'react';
import { useJsonData } from '../../context/JsonDataContext';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const TableView: React.FC = () => {
  const { jsonData } = useJsonData();
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!jsonData) return;

    let data: any[] = [];
    let cols: string[] = [];

    if (Array.isArray(jsonData.raw)) {
      data = jsonData.raw;
      if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
        cols = Object.keys(data[0]);
      }
    } else if (typeof jsonData.raw === 'object' && jsonData.raw !== null) {
      // Convert object to array if possible
      const objKeys = Object.keys(jsonData.raw);
      if (objKeys.length > 0 && Array.isArray(jsonData.raw[objKeys[0]])) {
        data = jsonData.raw[objKeys[0]];
        if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
          cols = Object.keys(data[0]);
        }
      } else {
        // Create a simple array from object
        data = Object.entries(jsonData.raw).map(([key, value]) => ({ key, value }));
        cols = ['key', 'value'];
      }
    }

    setTableData(data);
    setColumns(cols);
  }, [jsonData]);

  // Search filter function
  const filteredData = tableData.filter(item => {
    return columns.some(column => {
      const value = item[column];
      return value !== undefined && 
             String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sorting function
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue > bValue ? 1 : -1) 
      : (bValue > aValue ? 1 : -1);
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderCellContent = (value: any): React.ReactNode => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (value === undefined) return <span className="text-gray-400">undefined</span>;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') return JSON.stringify(value).substring(0, 50) + '...';
    return String(value);
  };

  if (!jsonData) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Table View</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search in table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {columns.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">This JSON data doesn't seem to have a tabular structure.</p>
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="text-xs text-gray-800 dark:text-gray-200 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column} 
                      scope="col" 
                      className="px-6 py-3 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center">
                        {column}
                        {sortColumn === column ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="ml-1 w-4 h-4" />
                          ) : (
                            <ChevronDown className="ml-1 w-4 h-4" />
                          )
                        ) : (
                          <ChevronDown className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-50" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {columns.map((column, colIndex) => (
                      <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis" style={{maxWidth: '300px'}}>
                        {renderCellContent(item[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, sortedData.length)}
                  </span>{' '}
                  of <span className="font-medium">{sortedData.length}</span> entries
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};