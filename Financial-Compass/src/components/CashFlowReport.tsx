import React, { useMemo, useState, useEffect } from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const ACTIVITY_MAPPING: Record<string, string> = {
  'Аренда': 'Операционная деятельность',
  'Аренда: депозит/обеспечительный платеж': 'Инвестиционная деятельность',
  'Банк: инкассация': 'Операционная деятельность',
  'Банк: комиссия за прием оплат (QR / эквайринг)': 'Операционная деятельность',
  'Банк: обслуживание счета/тарифы': 'Операционная деятельность',
  'Банк: прочие комиссии': 'Операционная деятельность',
  'Банк: СМС/уведомления': 'Операционная деятельность',
  'Бухгалтерия: сервисы отчетности': 'Операционная деятельность',
  'Бухгалтерия/аутсорс': 'Операционная деятельность',
  'Возвраты клиентам': 'Операционная деятельность',
  'Возвраты/сторно продаж (минус)': 'Операционная деятельность',
  'Вывоз мусора/утилизация': 'Операционная деятельность',
  'Выручка: наличные': 'Операционная деятельность',
  'Выручка: переводы / СБП': 'Операционная деятельность',
  'Выручка: QR': 'Операционная деятельность',
  'Выручка: сертификаты/депозиты': 'Операционная деятельность',
  'Выручка: эквайринг картой': 'Операционная деятельность',
  'Выручка: агрегаторы': 'Операционная деятельность',
  'выручка: бартер (рассчитался товаром, который ушЁл собственнику)': 'Операционная деятельность',
  'выручка: бартер (рассчитался товаром, который ушЁл на производство)': 'Операционная деятельность',
  'выручка: заказ в долг': 'Операционная деятельность',
  'выручка: предоплата': 'Операционная деятельность',
  'выручка: избыток': 'Операционная деятельность',
  'выручка: недостача': 'Операционная деятельность',
  'Дезинфекция/дератизация/санобработка': 'Операционная деятельность',
  'Инвестиции: кассы/терминалы/техника': 'Инвестиционная деятельность',
  'Инвестиции: крупное оборудование кухни': 'Инвестиционная деятельность',
  'Инвестиции: мебель/зал': 'Инвестиционная деятельность',
  'Инвестиции: оборудование кухни': 'Инвестиционная деятельность',
  'Инвестиции: ремонт/строительные работы': 'Инвестиционная деятельность',
  'Инвестиции: ремонт/улучшения (капитализация)': 'Инвестиционная деятельность',
  'Инвестиции: франшиза/паушальный взнос': 'Инвестиционная деятельность',
  'Канцелярия': 'Операционная деятельность',
  'Коммунальные услуги': 'Операционная деятельность',
  'Маркетинг: агрегаторы — комиссия': 'Операционная деятельность',
  'Маркетинг: агрегаторы — продвижение внутри': 'Операционная деятельность',
  'Маркетинг: бонусы/программа лояльности': 'Операционная деятельность',
  'Маркетинг: полиграфия/бренд': 'Операционная деятельность',
  'Маркетинг: реклама/таргет': 'Операционная деятельность',
  'Маркетинг: репутация/отзывы/сервисы': 'Операционная деятельность',
  'Маркетинг: скидки/промо (расход)': 'Операционная деятельность',
  'Маркетинг: фото/контент': 'Операционная деятельность',
  'Медкнижки/осмотры/санминимум': 'Операционная деятельность',
  'Налоги на ФОТ': 'Операционная деятельность',
  'Налоги: ЕНП/УСН/патент и прочие': 'Операционная деятельность',
  'Налоги: имущество/земля': 'Операционная деятельность',
  'Налоги: патент': 'Операционная деятельность',
  'Налоги: пени/штрафы налоговые': 'Операционная деятельность',
  'Налоги: УСН': 'Операционная деятельность',
  'Налоги: страховые взносы ИП': 'Операционная деятельность',
  'Персонал: медосмотры (если массово)': 'Операционная деятельность',
  'Персонал: обучение/стажировка': 'Операционная деятельность',
  'Персонал: питание/форма': 'Операционная деятельность',
  'Прочие доходы: бонусы/кэшбэк банка': 'Операционная деятельность',
  'Прочие доходы: компенсации/субсидии': 'Операционная деятельность',
  'Расходы: клининг (договор)': 'Операционная деятельность',
  'Расходы: лицензии/разрешения': 'Операционная деятельность',
  'Расходы: обслуживание вентиляции/вытяжки': 'Операционная деятельность',
  'Расходы: обслуживание холодильного оборудования': 'Операционная деятельность',
  'Расходы: охрана труда': 'Операционная деятельность',
  'Расходы: охрана/видеонаблюдение': 'Операционная деятельность',
  'Расходы: пожарная безопасность': 'Операционная деятельность',
  'Расходы: ремонт текущий': 'Операционная деятельность',
  'Расходы: вода в кулер': 'Операционная деятельность',
  'Себестоимость: продукты': 'Операционная деятельность',
  'Себестоимость: списания/потери/брак (минус)': 'Операционная деятельность',
  'Себестоимость: товары (продажа их в том же виде)': 'Операционная деятельность',
  'Себестоимость: упаковка и одноразка': 'Операционная деятельность',
  'Скидки/промо от агрегаторов (минус к выручке)': 'Операционная деятельность',
  'Собственник: внесение средств': 'Собственник',
  'Собственник: возврат займа собственнику': 'Собственник',
  'Собственник: вывод средств (миша)': 'Собственник',
  'Собственник: займы собственника бизнесу': 'Собственник',
  'Собственник: вывод средств (настя)': 'Собственник',
  'Собственник: вывод средств (общие)': 'Собственник',
  'Финансы: комиссии за переводы': 'Операционная деятельность',
  'Финансы: лизинг': 'Финансовая деятельность',
  'Финансы: проценты по кредитам': 'Финансовая деятельность',
  'Финансы: тело кредита': 'Финансовая деятельность',
  'ФОТ: админ/касса': 'Операционная деятельность',
  'ФОТ: курьеры (оклад)': 'Операционная деятельность',
  'ФОТ: курьеры (компенсация ГСМ)': 'Операционная деятельность',
  'ФОТ: курьеры (такси, прочее)': 'Операционная деятельность',
  'ФОТ: кухня': 'Операционная деятельность',
  'ФОТ: премии/мотивация': 'Операционная деятельность',
  'Хозрасходы зала/уборка': 'Операционная деятельность',
  'Штрафы/пени (операционные)': 'Операционная деятельность',
  'Эквайринг: аренда/обслуживание терминала': 'Операционная деятельность',
  'Юристы/консалтинг': 'Операционная деятельность',
  'АйТи IT: сайт/домен/хостинг': 'Операционная деятельность',
  'АйТи IT: учетные системы и подписки': 'Операционная деятельность',
  'АйТи IT: CRM (FrontPad)': 'Операционная деятельность',
  'АйТи IT/связь: интернет (провайдер)': 'Операционная деятельность',
  'АйТи IT/связь: мобильная связь/телефония': 'Операционная деятельность',
  'POS/касса: обслуживание ККТ': 'Операционная деятельность',
  'POS/касса: ОФД': 'Операционная деятельность',
  'POS/касса: фискальный накопитель': 'Операционная деятельность',
};

export const CashFlowReport: React.FC<Props> = ({ transactions }) => {
  const [customCategories, setCustomCategories] = useState<{id: string, name: string, activity: string}[]>(() => {
    const saved = localStorage.getItem('ddsCustomCategories');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', activity: 'Операционная деятельность' });
  const [addingToActivity, setAddingToActivity] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ddsCustomCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const { months, monthLabels, startBalances, endBalances, netFlows, categoryData, activities } = useMemo(() => {
    const monthSet = new Set<string>();
    transactions.forEach(t => monthSet.add(t.date.substring(0, 7)));
    let months = Array.from(monthSet).sort();
    
    if (months.length === 0) {
      months = [new Date().toISOString().substring(0, 7)];
    }

    const monthLabels = months.map(m => {
      const d = new Date(`${m}-01`);
      return d.toLocaleString('ru-RU', { month: 'short', year: '2-digit' });
    });

    const categories = Array.from(new Set([
      ...transactions.map(t => t.category),
      ...customCategories.map(c => c.name)
    ])).sort();
    
    const activities: Record<string, string[]> = {
      'Операционная деятельность': [],
      'Инвестиционная деятельность': [],
      'Финансовая деятельность': [],
      'Собственник': []
    };

    categories.forEach(cat => {
      const customCat = customCategories.find(c => c.name === cat);
      const activity = customCat ? customCat.activity : (ACTIVITY_MAPPING[cat] || 'Операционная деятельность');
      if (!activities[activity]) {
        activities[activity] = [];
      }
      activities[activity].push(cat);
    });

    const startBalances: Record<string, number> = {};
    const endBalances: Record<string, number> = {};
    const netFlows: Record<string, number> = {};
    const categoryData: Record<string, Record<string, number>> = {};

    categories.forEach(c => categoryData[c] = {});

    let runningBalance = 0;

    months.forEach(month => {
      startBalances[month] = runningBalance;
      
      let monthNet = 0;
      
      categories.forEach(cat => {
        const catTxs = transactions.filter(t => t.date.startsWith(month) && t.category === cat);
        const catSum = catTxs.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
        categoryData[cat][month] = catSum;
        monthNet += catSum;
      });

      netFlows[month] = monthNet;
      runningBalance += monthNet;
      endBalances[month] = runningBalance;
    });

    return { months, monthLabels, startBalances, endBalances, netFlows, categoryData, activities };
  }, [transactions, customCategories]);

  const handleAdd = (activity: string) => {
    setAddingToActivity(activity);
    setEditForm({ name: '', activity });
  };

  const handleEdit = (catName: string, activity: string) => {
    const customCat = customCategories.find(c => c.name === catName);
    if (customCat) {
      setEditingId(customCat.id);
      setEditForm({ name: customCat.name, activity: customCat.activity });
    } else {
      // If editing a built-in category, we create a custom override
      const newId = Date.now().toString();
      setEditingId(newId);
      setEditForm({ name: catName, activity });
    }
  };

  const handleSave = () => {
    if (!editForm.name.trim()) return;
    
    if (addingToActivity) {
      setCustomCategories([...customCategories, { id: Date.now().toString(), name: editForm.name, activity: editForm.activity }]);
      setAddingToActivity(null);
    } else if (editingId) {
      const exists = customCategories.find(c => c.id === editingId);
      if (exists) {
        setCustomCategories(prev => prev.map(c => c.id === editingId ? { ...c, name: editForm.name, activity: editForm.activity } : c));
      } else {
        // It was a built-in category being edited
        setCustomCategories([...customCategories, { id: editingId, name: editForm.name, activity: editForm.activity }]);
      }
      setEditingId(null);
    }
  };

  const handleDelete = (catName: string) => {
    setCustomCategories(prev => prev.filter(c => c.name !== catName));
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const renderActivitySection = (title: string, cats: string[], bgColor: string, textColor: string) => {
    return (
      <React.Fragment key={title}>
        <tr className={`${bgColor} font-semibold ${textColor}`}>
          <td className={`p-3 border border-slate-200 text-left sticky left-0 ${bgColor} z-10 flex justify-between items-center`}>
            <span>{title}</span>
            <button onClick={() => handleAdd(title)} className="text-xs bg-white/50 hover:bg-white px-2 py-1 rounded border border-current opacity-70 hover:opacity-100">+ Добавить</button>
          </td>
          {months.map(m => (
            <td key={m} className={`p-3 border border-slate-200 ${bgColor}`}></td>
          ))}
        </tr>
        
        {addingToActivity === title && (
          <tr className="bg-white">
            <td className="p-2 border border-slate-200 text-left sticky left-0 bg-white z-10 pl-6 flex gap-2">
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm" placeholder="Название статьи" autoFocus />
              <button onClick={handleSave} className="text-green-600 font-bold">✓</button>
              <button onClick={() => setAddingToActivity(null)} className="text-slate-500 font-bold">✕</button>
            </td>
            {months.map(m => <td key={m} className="p-3 border border-slate-200"></td>)}
          </tr>
        )}

        {cats.map(cat => {
          const customCat = customCategories.find(c => c.name === cat);
          const isEditing = editingId && (customCat?.id === editingId || (!customCat && editForm.name === cat));
          
          if (isEditing) {
            return (
              <tr key={cat} className="bg-white">
                <td className="p-2 border border-slate-200 text-left sticky left-0 bg-white z-10 pl-6 flex gap-2">
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm" />
                  <button onClick={handleSave} className="text-green-600 font-bold">✓</button>
                  <button onClick={() => setEditingId(null)} className="text-slate-500 font-bold">✕</button>
                </td>
                {months.map(m => <td key={m} className="p-3 border border-slate-200"></td>)}
              </tr>
            );
          }

          return (
            <tr key={cat} className="hover:bg-slate-50 group">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-white group-hover:bg-slate-50 z-10 truncate max-w-[300px] pl-6 flex justify-between items-center" title={cat}>
                <span className="truncate">{cat}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 bg-white/80 px-1 rounded">
                  <button onClick={() => handleEdit(cat, title)} className="text-indigo-600 hover:text-indigo-800">✎</button>
                  {customCat && <button onClick={() => handleDelete(cat)} className="text-red-600 hover:text-red-800">✕</button>}
                </div>
              </td>
              {months.map(m => (
                <td key={m} className={`p-3 border border-slate-200 ${categoryData[cat][m] < 0 ? 'text-red-600' : categoryData[cat][m] > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                  {categoryData[cat][m] === 0 ? '0,00' : formatMoney(categoryData[cat][m])}
                </td>
              ))}
            </tr>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Отчет о движении денежных средств (ДДС)</h2>
        <p className="text-sm text-slate-500 mt-1">Анализ денежных потоков по месяцам и видам деятельности</p>
      </div>
      
      <div className="overflow-x-auto flex-1 p-0">
        <table className="w-full text-sm text-right border-collapse">
          <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10">
            <tr>
              <th className="p-3 border border-slate-200 text-left min-w-[250px] sticky left-0 bg-slate-100 z-20">Статья / Месяц</th>
              {monthLabels.map((m, i) => (
                <th key={i} className="p-3 border border-slate-200 min-w-[120px]">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Остаток на начало */}
            <tr className="bg-emerald-50 font-semibold">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-emerald-50 z-10">Остаток денег на начало месяца</td>
              {months.map(m => (
                <td key={m} className="p-3 border border-slate-200">{formatMoney(startBalances[m])}</td>
              ))}
            </tr>

            {renderActivitySection('Операционная деятельность', activities['Операционная деятельность'], 'bg-blue-50', 'text-blue-900')}
            {renderActivitySection('Инвестиционная деятельность', activities['Инвестиционная деятельность'], 'bg-purple-50', 'text-purple-900')}
            {renderActivitySection('Финансовая деятельность', activities['Финансовая деятельность'], 'bg-amber-50', 'text-amber-900')}
            {renderActivitySection('Собственник', activities['Собственник'], 'bg-slate-100', 'text-slate-800')}

            {/* Итого движения */}
            <tr className="bg-orange-50 font-semibold">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-orange-50 z-10">Итого движения денежных средств за месяц</td>
              {months.map(m => (
                <td key={m} className={`p-3 border border-slate-200 ${netFlows[m] < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatMoney(netFlows[m])}
                </td>
              ))}
            </tr>

            {/* Остаток на конец */}
            <tr className="bg-emerald-100 font-bold">
              <td className="p-3 border border-slate-200 text-left sticky left-0 bg-emerald-100 z-10">Остаток денег на конец месяца</td>
              {months.map(m => (
                <td key={m} className="p-3 border border-slate-200">{formatMoney(endBalances[m])}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
