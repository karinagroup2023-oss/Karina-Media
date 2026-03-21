import React, { useState, useEffect } from 'react';
import { ReferenceArticle } from '../types';

const DEFAULT_ARTICLES: ReferenceArticle[] = [
  { id: '1', name: 'Аренда', activityType: 'Операционная деятельность', costType: 'постоянные', description: 'Аренда помещения кухни/зала/склада' },
  { id: '2', name: 'Аренда: депозит/обеспечительный платеж', activityType: 'Инвестиционная деятельность', costType: 'не в P&L', description: 'Залог арендодателю (можно как отдельная статья; обычно не расход P&L)' },
  { id: '3', name: 'Банк: инкассация', activityType: 'Операционная деятельность', costType: 'постоянные', description: 'Если появится инкассация наличных' },
  { id: '4', name: 'Банк: комиссия за прием оплат (QR / эквайринг)', activityType: 'Операционная деятельность', costType: 'переменные', description: 'Комиссии банка, эквайринг, комиссии по реестрам' },
  { id: '5', name: 'Банк: обслуживание счета/тарифы', activityType: 'Операционная деятельность', costType: 'постоянные', description: 'Тариф банка, пакет обслуживания, "Точка тариф"' },
  { id: '6', name: 'Бухгалтерия: сервисы отчетности', activityType: 'Операционная деятельность', costType: 'постоянные', description: 'Контур/СБИС и т.п.' },
  { id: '7', name: 'Выручка: наличные', activityType: 'Операционная деятельность', costType: 'Доходы', description: 'Наличные продажи' },
  { id: '8', name: 'Выручка: эквайринг картой', activityType: 'Операционная деятельность', costType: 'Доходы', description: 'Оплаты по терминалу/интернет-эквайринг' },
  { id: '9', name: 'Маркетинг: реклама/таргет', activityType: 'Операционная деятельность', costType: 'переменные', description: 'Таргет, контекст, продвижение, рекламные кабинеты' },
  { id: '10', name: 'Налоги: УСН', activityType: 'Операционная деятельность', costType: 'ниже EBITDA', description: 'УСН 6%/15% (выделить внутри налогов)' },
  { id: '11', name: 'Себестоимость: продукты', activityType: 'Операционная деятельность', costType: 'переменные', description: 'Лосось, тунец, угорь, креветки, мидии и т.п.' },
  { id: '12', name: 'ФОТ: админ/касса', activityType: 'Операционная деятельность', costType: 'постоянные', description: 'Оклады/выплаты администраторам, кассирам' },
];

const ACTIVITY_TYPES = [
  'Операционная деятельность',
  'Инвестиционная деятельность',
  'Финансовая деятельность',
  'Собственник'
];

const COST_TYPES = [
  'постоянные',
  'переменные',
  'не в P&L',
  'Доходы',
  'ниже EBITDA'
];

export const ReferenceBook: React.FC = () => {
  const [articles, setArticles] = useState<ReferenceArticle[]>(() => {
    const saved = localStorage.getItem('referenceArticles');
    return saved ? JSON.parse(saved) : DEFAULT_ARTICLES;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ReferenceArticle>>({});

  useEffect(() => {
    localStorage.setItem('referenceArticles', JSON.stringify(articles));
  }, [articles]);

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newArticle: ReferenceArticle = {
      id: newId,
      name: '',
      activityType: ACTIVITY_TYPES[0],
      costType: COST_TYPES[0],
      description: ''
    };
    setArticles([newArticle, ...articles]);
    setEditingId(newId);
    setEditForm(newArticle);
  };

  const handleEdit = (article: ReferenceArticle) => {
    setEditingId(article.id);
    setEditForm(article);
  };

  const handleSave = () => {
    if (!editForm.name?.trim()) {
      alert('Название статьи не может быть пустым');
      return;
    }
    setArticles(prev => prev.map(a => a.id === editingId ? { ...a, ...editForm } as ReferenceArticle : a));
    setEditingId(null);
  };

  const handleCancel = (id: string) => {
    // If it was a newly added empty row, remove it
    const article = articles.find(a => a.id === id);
    if (article && !article.name.trim()) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Справочник статей</h2>
          <p className="text-sm text-slate-500 mt-1">Управление статьями доходов и расходов</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Добавить статью
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Статья</th>
              <th className="px-6 py-3">Деятельность</th>
              <th className="px-6 py-3">Тип</th>
              <th className="px-6 py-3">Пояснение</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                {editingId === article.id ? (
                  <>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Название статьи"
                        autoFocus
                      />
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={editForm.activityType || ''}
                        onChange={(e) => setEditForm({ ...editForm, activityType: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {ACTIVITY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={editForm.costType || ''}
                        onChange={(e) => setEditForm({ ...editForm, costType: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {COST_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Пояснение"
                      />
                    </td>
                    <td className="px-6 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={handleSave}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => handleCancel(article.id)}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                      >
                        Отмена
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-medium text-slate-800">{article.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {article.activityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.costType === 'Доходы' ? 'bg-green-100 text-green-800' :
                        article.costType === 'постоянные' ? 'bg-blue-100 text-blue-800' :
                        article.costType === 'переменные' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {article.costType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{article.description}</td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Редактировать"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Удалить"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Справочник пуст. Добавьте первую статью.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
