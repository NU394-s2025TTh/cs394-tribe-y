import React, { useState, useEffect } from 'react';
import { useJsonData } from '../../context/JsonDataContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend 
} from 'recharts';
import { Layers, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const chartColors = [
  '#3B82F6', '#10B981', '#F97316', '#6366F1', '#EC4899', '#8B5CF6', 
  '#14B8A6', '#F59E0B', '#EF4444', '#06B6D4'
];

type ChartTypes = 'bar' | 'line' | 'pie';

export const ChartView: React.FC = () => {
  const { jsonData } = useJsonData();
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<ChartTypes>('bar');
  const [chartFields, setChartFields] = useState<{
    category: string;
    values: string[];
  }>({
    category: '',
    values: []
  });
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jsonData) return;

    try {
      let data: any[] = [];
      let fields: string[] = [];

      // Handle array of objects
      if (Array.isArray(jsonData.raw)) {
        if (jsonData.raw.length === 0) {
          setError('The JSON array is empty');
          return;
        }

        if (typeof jsonData.raw[0] === 'object' && jsonData.raw[0] !== null) {
          data = jsonData.raw.slice(0, 100);
          fields = Object.keys(jsonData.raw[0]);
        } else {
          // Handle array of primitive values
          data = jsonData.raw.slice(0, 100).map((value, index) => ({
            id: index.toString(),
            value: typeof value === 'number' ? value : 1
          }));
          fields = ['id', 'value'];
        }
      } 
      // Handle object
      else if (typeof jsonData.raw === 'object' && jsonData.raw !== null) {
        const objKeys = Object.keys(jsonData.raw);
        
        if (objKeys.length === 0) {
          setError('The JSON object is empty');
          return;
        }

        // Convert object to array format with proper null checks
        data = objKeys.map(key => {
          const value = jsonData.raw[key];
          return {
            name: key,
            value: typeof value === 'number' ? value : 
                   (typeof value === 'object' && value !== null) ? 
                   Object.keys(value).length : 
                   1
          };
        });
        fields = ['name', 'value'];
      } else {
        setError('The JSON data structure is not suitable for charting');
        return;
      }

      // Validate data
      if (!data.length || !fields.length) {
        setError('No valid data for visualization');
        return;
      }

      setError(null);
      setChartData(data);
      setAvailableFields(fields);
      
      // Select initial fields
      const numericFields = fields.filter(field => 
        data.length > 0 && typeof data[0][field] === 'number'
      );
      
      const nonNumericFields = fields.filter(field => 
        data.length > 0 && typeof data[0][field] === 'string'
      );
      
      if (numericFields.length > 0 && nonNumericFields.length > 0) {
        setChartFields({
          category: nonNumericFields[0],
          values: [numericFields[0]]
        });
      } else if (fields.includes('name') && fields.includes('value')) {
        setChartFields({
          category: 'name',
          values: ['value']
        });
      } else if (fields.length >= 2) {
        setChartFields({
          category: fields[0],
          values: [fields[1]]
        });
      }
    } catch (err) {
      setError('Error processing JSON data for visualization');
      console.error('Chart processing error:', err);
    }
  }, [jsonData]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartFields(prev => ({ ...prev, category: e.target.value }));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newValues = [...chartFields.values];
    newValues[index] = e.target.value;
    setChartFields(prev => ({ ...prev, values: newValues }));
  };

  const addValueField = () => {
    if (chartFields.values.length < 5) {
      setChartFields(prev => ({
        ...prev,
        values: [...prev.values, availableFields.filter(f => f !== prev.category)[0] || '']
      }));
    }
  };

  const removeValueField = (index: number) => {
    if (chartFields.values.length > 1) {
      setChartFields(prev => ({
        ...prev,
        values: prev.values.filter((_, i) => i !== index)
      }));
    }
  };

  const renderChart = () => {
    if (error) {
      return (
        <div className="h-96 flex items-center justify-center">
          <p className="text-error-500 dark:text-error-400">{error}</p>
        </div>
      );
    }

    if (!chartData.length || !chartFields.category || !chartFields.values.length) {
      return (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Select fields to visualize</p>
        </div>
      );
    }

    const validData = chartData.filter(item => 
      item[chartFields.category] !== undefined && 
      item[chartFields.category] !== null && 
      item[chartFields.category] !== ''
    );

    if (validData.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No valid data for visualization</p>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis 
                dataKey={chartFields.category} 
                angle={-45} 
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartFields.values.map((value, index) => (
                <Bar 
                  key={value} 
                  dataKey={value} 
                  name={value} 
                  fill={chartColors[index % chartColors.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis 
                dataKey={chartFields.category}
                angle={-45} 
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartFields.values.map((value, index) => (
                <Line 
                  key={value}
                  type="monotone" 
                  dataKey={value} 
                  name={value}
                  stroke={chartColors[index % chartColors.length]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={validData}
                dataKey={chartFields.values[0]}
                nameKey={chartFields.category}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {validData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  if (!jsonData) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chart View</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                "flex items-center p-2 rounded-md transition-colors",
                chartType === 'bar' 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <BarChartIcon className="h-4 w-4 mr-1" />
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                "flex items-center p-2 rounded-md transition-colors",
                chartType === 'line' 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <LineChartIcon className="h-4 w-4 mr-1" />
              Line
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={cn(
                "flex items-center p-2 rounded-md transition-colors",
                chartType === 'pie' 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              Pie
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category (X-Axis)
            </label>
            <select
              value={chartFields.category}
              onChange={handleCategoryChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select field</option>
              {availableFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Values (Y-Axis)
            </label>
            <div className="space-y-2">
              {chartFields.values.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={value}
                    onChange={e => handleValueChange(e, index)}
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select field</option>
                    {availableFields
                      .filter(field => field !== chartFields.category)
                      .map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                  </select>
                  {index > 0 && (
                    <button 
                      onClick={() => removeValueField(index)}
                      className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {chartFields.values.length < 5 && (
                <button 
                  onClick={addValueField}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Layers className="h-4 w-4 mr-1" /> Add another value field
                </button>
              )}
            </div>
          </div>
        </div>

        {renderChart()}
      </div>
    </div>
  );
};