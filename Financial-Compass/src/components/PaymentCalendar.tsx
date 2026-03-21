import React, { useState, useEffect, useMemo } from 'react';

interface CalendarEvent {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
}

export const PaymentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old data if necessary
      return parsed.map((e: any) => {
        if (e.dayIndex !== undefined && !e.date) {
          const d = new Date();
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String((e.dayIndex % 28) + 1).padStart(2, '0')}`;
          return { id: e.id, date: dateStr, amount: e.amount, description: e.description, type: e.type };
        }
        return e;
      });
    }
    
    // Default events for current month
    const y = new Date().getFullYear();
    const m = String(new Date().getMonth() + 1).padStart(2, '0');
    return [
      { id: '1', date: `${y}-${m}-10`, amount: 500000, description: 'Налоги', type: 'expense' },
      { id: '2', date: `${y}-${m}-15`, amount: 1250000, description: 'Оплата от клиента', type: 'income' }
    ];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CalendarEvent>>({});
  const [addingToDate, setAddingToDate] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleAdd = (date: string) => {
    setAddingToDate(date);
    setEditForm({
      date,
      amount: 0,
      description: '',
      type: 'expense'
    });
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setEditForm(event);
  };

  const handleSave = () => {
    if (!editForm.description?.trim() || !editForm.amount) return;
    
    if (addingToDate !== null) {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        date: addingToDate,
        amount: editForm.amount,
        description: editForm.description,
        type: editForm.type as 'income' | 'expense'
      };
      setEvents([...events, newEvent]);
      setAddingToDate(null);
    } else if (editingId) {
      setEvents(prev => prev.map(e => e.id === editingId ? { ...e, ...editForm } as CalendarEvent : e));
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setAddingToDate(null);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount) + ' ₸';
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const currentMonthName = currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    let firstDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Sunday
    
    const daysInMonth = lastDayOfMonth.getDate();
    const days = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, date: dateStr });
    }
    
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      days.push(null);
    }
    
    return days;
  }, [currentDate]);

  const renderEventForm = () => (
    <div className="bg-white p-3 rounded-lg border border-indigo-300 shadow-xl text-xs flex flex-col gap-2 absolute z-30 w-48 -ml-2 mt-6">
      <select 
        value={editForm.type || 'expense'} 
        onChange={e => setEditForm({...editForm, type: e.target.value as 'income' | 'expense'})}
        className="border border-slate-300 rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="expense">Расход</option>
        <option value="income">Приход</option>
      </select>
      <input 
        type="number" 
        value={editForm.amount || ''} 
        onChange={e => setEditForm({...editForm, amount: parseFloat(e.target.value) || 0})}
        className="border border-slate-300 rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
        placeholder="Сумма"
        autoFocus
      />
      <input 
        type="text" 
        value={editForm.description || ''} 
        onChange={e => setEditForm({...editForm, description: e.target.value})}
        className="border border-slate-300 rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
        placeholder="Описание"
      />
      <div className="flex justify-between mt-1 gap-2">
        <button onClick={handleSave} className="flex-1 text-white font-medium bg-green-600 hover:bg-green-700 px-2 py-1.5 rounded transition">Сохранить</button>
        <button onClick={handleCancel} className="flex-1 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded transition">Отмена</button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Платежный Календарь</h2>
          <p className="text-sm text-slate-500 mt-1">График предстоящих платежей и поступлений на месяц</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition">
            &lt;
          </button>
          <span className="font-bold text-slate-700 capitalize w-32 text-center">{currentMonthName}</span>
          <button onClick={nextMonth} className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition">
            &gt;
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
            <div key={day} className={`text-center text-sm font-bold py-2 ${i > 4 ? 'text-red-500' : 'text-slate-500'}`}>
              {day}
            </div>
          ))}
          
          {calendarDays.map((dayObj, i) => {
            if (!dayObj) {
              return <div key={`empty-${i}`} className="bg-slate-50/50 rounded-lg border border-slate-100 min-h-[100px]"></div>;
            }

            const { day, date } = dayObj;
            const dayEvents = events.filter(e => e.date === date);
            const isWeekend = i % 7 >= 5;
            const isToday = date === new Date().toISOString().substring(0, 10);

            return (
              <div key={date} className={`border rounded-lg flex flex-col min-h-[100px] relative ${isToday ? 'border-indigo-400 shadow-sm ring-1 ring-indigo-400' : 'border-slate-200'} ${isWeekend ? 'bg-red-50/10' : 'bg-white'}`}>
                <div className={`p-1.5 text-center text-xs font-medium border-b flex justify-between items-center ${isToday ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : isWeekend ? 'bg-red-50/30 border-slate-100 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : ''}`}>{day}</span>
                  <button onClick={() => handleAdd(date)} className="text-slate-400 hover:text-indigo-600 text-lg leading-none px-1" title="Добавить платеж">+</button>
                </div>
                <div className="p-1 flex-1 flex flex-col gap-1 overflow-y-visible relative">
                  {addingToDate === date && renderEventForm()}
                  
                  {dayEvents.map(event => (
                    <div key={event.id} className="relative group">
                      {editingId === event.id ? renderEventForm() : (
                        <div className={`text-[10px] p-1.5 rounded border leading-tight ${event.type === 'income' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                          <div className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                            {event.type === 'income' ? '+' : '-'}{formatMoney(event.amount)}
                          </div>
                          <div className="whitespace-nowrap overflow-hidden text-ellipsis opacity-80" title={event.description}>{event.description}</div>
                          
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-0.5 bg-white shadow-md rounded border border-slate-200 p-0.5 z-20">
                            <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-800 p-0.5">✎</button>
                            <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800 p-0.5">✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
