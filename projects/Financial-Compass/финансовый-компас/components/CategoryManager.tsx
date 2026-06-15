import React, { useState } from 'react';

interface CategoryManagerProps {
  categories: string[];
  onAdd: (category: string) => void;
  onRemove: (category: string) => void;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAdd, onRemove, onClose }) => {
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      onAdd(newCat.trim());
      setNewCat('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">Управление категориями</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleAdd} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Новая категория..."
              className="flex-1 rounded-lg border-slate-300 border p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button 
              type="submit"
              disabled={!newCat.trim()}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </form>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                <span className="text-sm text-slate-700">{cat}</span>
                <button 
                  onClick={() => onRemove(cat)}
                  className="text-slate-400 hover:text-red-500"
                  title="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};