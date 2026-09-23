import * as XLSX from 'xlsx';

/**
 * Standard utility to export data to an Excel (.xlsx) file,
 * fully compatible with Google Sheets, Microsoft Excel, and Apple Numbers.
 * Automatically triggers browser download.
 *
 * @param {Array<Object>} data - Array of row objects
 * @param {string} fileName - Base filename without extension
 * @param {string} sheetName - Sheet tab name (default: "Data")
 */
export const exportToExcel = (data, fileName = 'Export_Data', sheetName = 'Data') => {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert('No records available to export.');
      return false;
    }

    // Clean data for spreadsheet
    const cleanData = data.map((row) => {
      const cleanRow = {};
      Object.entries(row).forEach(([key, val]) => {
        if (val === null || val === undefined) {
          cleanRow[key] = '';
        } else if (typeof val === 'object') {
          cleanRow[key] = val.name || val.title || JSON.stringify(val);
        } else {
          cleanRow[key] = val;
        }
      });
      return cleanRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Write and trigger download as .xlsx file (Excel / Google Sheets compatible)
    const sanitizedFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
    XLSX.writeFile(workbook, sanitizedFileName);
    return true;
  } catch (err) {
    console.error('Failed to export Excel file:', err);
    alert('An error occurred while generating the Excel spreadsheet.');
    return false;
  }
};
