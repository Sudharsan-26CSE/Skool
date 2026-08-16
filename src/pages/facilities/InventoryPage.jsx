import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { Box, Plus } from 'lucide-react';

const InventoryPage = () => {
  const items = [
    { code: 'INV-001', name: 'Whiteboard Markers (Blue/Black)', category: 'Stationery', stock: '45 Boxes', status: 'In Stock' },
    { code: 'INV-002', name: 'A4 Printing Paper Reams', category: 'Stationery', stock: '8 Reams', status: 'Low Stock' },
    { code: 'INV-003', name: 'Basketballs (Spalding Official)', category: 'Sports', stock: '20 Balls', status: 'In Stock' },
  ];

  return (
    <DashboardLayout>
      <Breadcrumbs />
      <div className="page-header">
        <div>
          <h1 className="page-title">School Inventory</h1>
          <p className="page-subtitle">Equipment, stationery, and asset stock management</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Stock Item
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Description</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.code}>
                <td><strong>{i.code}</strong></td>
                <td>{i.name}</td>
                <td><span className="badge neutral">{i.category}</span></td>
                <td>{i.stock}</td>
                <td><span className={`badge ${i.status === 'In Stock' ? 'success' : 'warning'}`}>{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;
