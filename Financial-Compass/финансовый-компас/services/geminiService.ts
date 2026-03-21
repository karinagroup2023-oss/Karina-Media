import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType, PaymentStatus, Currency } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes a financial document (Receipt OR Bank Statement) and extracts transaction data.
 * Returns an array of transactions (length 1 for receipt, length > 1 for statements).
 */
export const analyzeFinancialDocument = async (base64Image: string, availableCategories: string[]): Promise<Partial<Transaction>[] | null> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';

    const categoriesStr = availableCategories.join(', ');

    const prompt = `
      Ты - опытный бухгалтер. Проанализируй это изображение. Это может быть:
      1. Фото одного чека.
      2. Скриншот банковской выписки (Excel/PDF) с несколькими операциями.

      Твоя задача: найти ВСЕ финансовые операции на изображении и вернуть их списком JSON.
      
      Для каждой операции заполни:
      1. amount: сумма (число).
      2. currency: валюта ('KZT', 'RUB', 'USD', 'EUR'). По умолчанию 'KZT'.
      3. date: дата (YYYY-MM-DD).
      4. description: описание или контрагент.
      5. category: выбери из списка [${categoriesStr}] или 'Прочее'.
      6. type: 'INCOME' (поступление) или 'EXPENSE' (списание).
      
      Верни ТОЛЬКО массив JSON объектов. Без markdown.
      Пример: [{"amount": 100, ...}, {"amount": 5000, ...}]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    const text = response.text;
    if (!text) return null;

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    // Ensure we always work with an array
    const dataArray = Array.isArray(data) ? data : [data];

    return dataArray.map((item: any) => ({
      amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount),
      currency: (['KZT', 'RUB', 'USD', 'EUR'].includes(item.currency) ? item.currency : 'KZT') as Currency,
      date: item.date,
      description: item.description,
      category: item.category,
      type: item.type === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE,
      status: PaymentStatus.PAID // Assumed paid if on statement/receipt
    }));

  } catch (error) {
    console.error("Error analyzing document with Gemini:", error);
    return null;
  }
};

/**
 * Generates CFO insights.
 */
export const generateFinancialAdvice = async (transactions: Transaction[], baseCurrency: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview'; 

    const summary = transactions.slice(0, 50).map(t => 
      `${t.date}: ${t.type} ${t.amount} ${t.currency} (${t.category})`
    ).join('\n');

    const prompt = `
      Ты - финансовый директор (CFO) для малого бизнеса. Валюта отчетности: ${baseCurrency}.
      Проанализируй данные. Дай совет (макс 3 предл).
      Риски, кассовые разрывы, маржа.
      
      Данные:
      ${summary}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Нет данных для анализа.";

  } catch (error) {
    console.error("Error generating advice:", error);
    return "Не удалось получить финансовый совет.";
  }
};