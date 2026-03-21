import React, { useState, useEffect } from 'react';

interface FixedAsset {
  id: string;
  name: string;
  category: string;
  initialValue: number;
  depreciation: number;
  residualValue: number;
  status: string;
}

export const AssetsList: React.FC = () => {
  const [assets, setAssets] = useState<FixedAsset[]>(() => {
    const saved = localStorage.getItem('fixedAssets');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FixedAsset>>({});

  useEffect(() => {
    localStorage.setItem('fixedAssets', JSON.stringify(assets));
  }, [assets]);

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newAsset: FixedAsset = {
      id: newId,
      name: '',
      category: 'Оборудование',
      initialValue: 0,
      depreciation: 0,
      residualValue: 0,
      status: 'В эксплуатации'
    };
    setAssets([newAsset, ...assets]);
    setEditingId(newId);
    setEditForm(newAsset);
  };

  const handleEdit = (asset: FixedAsset) => {
    setEditingId(asset.id);
    setEditForm(asset);
  };

  const handleSave = () => {
    if (!editForm.name?.trim()) return;
    const residual = (editForm.initialValue || 0) - (editForm.depreciation || 0);
    const updatedForm = { ...editForm, residualValue: residual };
    setAssets(prev => prev.map(a => a.id === editingId ? { ...a, ...updatedForm } as FixedAsset : a));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + ' ₸';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Основные Средства</h2>
          <p className="text-sm text-slate-500 mt-1">Учет оборудования, транспорта, недвижимости и расчет амортизации</p>
        </div>
        <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Добавить актив
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 border-b border-slate-200 font-medium">Наименование</th>
              <th className="p-3 border-b border-slate-200 font-medium">Категория</th>
              <th className="p-3 border-b border-slate-200 font-medium text-right">Первоначальная стоимость</th>
              <th className="p-3 border-b border-slate-200 font-medium text-right">Накопленная амортизация</th>
              <th className="p-3 border-b border-slate-200 font-medium text-right">Остаточная стоимость</th>
              <th className="p-3 border-b border-slate-200 font-medium text-center">Статус</th>
              <th className="p-3 border-b border-slate-200 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                {editingId === asset.id ? (
                  <>
                    <td className="p-2">
                      <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1" placeholder="Название" autoFocus />
                    </td>
                    <td className="p-2">
                      <input type="text" value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1" placeholder="Категория" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={editForm.initialValue || 0} onChange={e => setEditForm({...editForm, initialValue: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded px-2 py-1 text-right" />
                    </td>
                    <td className="p-2">
                      <input type="number" value={editForm.depreciation || 0} onChange={e => setEditForm({...editForm, depreciation: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded px-2 py-1 text-right" />
                    </td>
                    <td className="p-2 text-right text-slate-500">
                      {formatMoney((editForm.initialValue || 0) - (editForm.depreciation || 0))}
                    </td>
                    <td className="p-2">
                      <select value={editForm.status || ''} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1">
                        <option value="В эксплуатации">В эксплуатации</option>
                        <option value="Списано">Списано</option>
                        <option value="На консервации">На консервации</option>
                      </select>
                    </td>
                    <td className="p-2 text-right space-x-2">
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800 font-medium">Сохранить</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-medium text-slate-800">{asset.name}</td>
                    <td className="p-3 text-slate-600">{asset.category}</td>
                    <td className="p-3 text-right text-slate-800">{formatMoney(asset.initialValue)}</td>
                    <td className="p-3 text-right text-red-600">{formatMoney(asset.depreciation)}</td>
                    <td className="p-3 text-right font-medium text-slate-800">{formatMoney(asset.residualValue)}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${asset.status === 'В эксплуатации' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(asset)} className="text-indigo-600 hover:text-indigo-800">
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(asset.id)} className="text-red-500 hover:text-red-700">
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Нет добавленных основных средств
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
