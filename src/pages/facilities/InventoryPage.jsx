import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Box, Plus, Trash2, Search } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getInventory, createInventory, deleteInventory } from '../../services/api';

const InventoryPage = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await getInventory();
      const list = res.inventories || res.inventory || res.items || (Array.isArray(res) ? res : []);
      setItems(list);
    } catch (err) {
      console.warn('Failed to load inventory from DB:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    const code = window.prompt('Enter Item Code (e.g. INV-009):');
    if (!code) return;
    const name = window.prompt('Enter Item Description (e.g. Physics Vernier Calipers):');
    if (!name) return;
    const category = window.prompt('Enter Category (Stationery, Sports, Laboratory, IT Equipment, Vocational):', 'Laboratory');
    const stock = window.prompt('Enter Current Stock (e.g. 15 Units):', '10 Units');

    try {
      await createInventory({
        code,
        name,
        category: category || 'General',
        stock: stock || '1 Unit',
        status: 'In Stock',
        location: 'Main Store'
      });
      showToast('Inventory item added to database successfully!', 'success');
      fetchInventory();
    } catch (err) {
      showToast(err.message || 'Failed to add inventory item', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    try {
      await deleteInventory(id);
      showToast('Item deleted successfully', 'success');
      fetchInventory();
    } catch (err) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const filtered = items.filter(i => {
    const term = search.toLowerCase();
    return (i.name || '').toLowerCase().includes(term) ||
           (i.code || '').toLowerCase().includes(term) ||
           (i.category || '').toLowerCase().includes(term);
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Inventory</h1>
          <p className="page-subtitle">Equipment, stationery, and laboratory asset stock management ({items.length} Tracked Assets)</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleAddItem}>
            <Plus size={16} /> Add Stock Item
          </button>
        )}
      </div>

      <div style={{ marginBottom: 'var(--space-4)', maxWidth: '350px' }}>
        <div className="header-search" style={{ margin: 0, width: '100%' }}>
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search inventory code, item or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="data-table-container glass-card hover-lift">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading inventory records...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Description</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Location</th>
                <th>Stock Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Sorry ! Not Available Data.
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr key={i._id || i.code}>
                    <td><strong>{i.code}</strong></td>
                    <td>
                      <div className="cell-with-icon">
                        <Box size={16} color="var(--primary)" />
                        <strong>{i.name}</strong>
                      </div>
                    </td>
                    <td><span className="badge neutral">{i.category}</span></td>
                    <td>{i.stock}</td>
                    <td>{i.location || 'Store Room'}</td>
                    <td>
                      <span className={`badge ${i.status === 'In Stock' ? 'success' : 'warning'}`}>
                        {i.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <button className="icon-btn danger" onClick={() => handleDelete(i._id || i.code)} title="Delete Stock Item">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;
