'use client';

import { ReactNode } from 'react';

interface DataTableProps {
  data: any[];
  columns: string[];
  isLoading?: boolean;
  renderRow?: (item: any, index: number) => ReactNode;
}

export const DataTable = ({ data, columns, isLoading, renderRow }: DataTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  if (renderRow) {
    return <div className="space-y-3">{data.map(renderRow)}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-sm text-gray-700">
                  {item[col.toLowerCase()] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;