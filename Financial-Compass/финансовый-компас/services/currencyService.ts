export const fetchExchangeRates = async (): Promise<Record<string, number>> => {
  const defaultRates: Record<string, number> = { KZT: 1, RUB: 6.0, USD: 486.2, EUR: 557.82 };
  try {
    // Используем CORS-прокси, так как прямой запрос к XML Нацбанка из браузера блокируется политикой CORS
    // Добавляем параметр t для обхода кэширования прокси
    const targetUrl = `https://nationalbank.kz/rss/rates_all.xml?t=${Date.now()}`;
    
    let response;
    try {
      // Пробуем corsproxy.io как более надежную альтернативу
      response = await fetch('https://corsproxy.io/?' + encodeURIComponent(targetUrl));
      if (!response.ok) throw new Error('First proxy failed');
    } catch (e) {
      // Запасной прокси
      response = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl));
    }

    if (!response.ok) throw new Error('Failed to fetch rates from all proxies');
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    const items = xmlDoc.getElementsByTagName("item");
    const rates: Record<string, number> = { KZT: 1 };
    
    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName("title")[0]?.textContent;
      const description = items[i].getElementsByTagName("description")[0]?.textContent;
      const quantStr = items[i].getElementsByTagName("quant")[0]?.textContent;
      
      if (title && description) {
        const quant = parseFloat(quantStr || "1");
        rates[title] = parseFloat(description) / quant;
      }
    }
    
    // Проверяем, что основные валюты успешно загрузились
    if (rates.USD && rates.RUB && rates.EUR) {
      return rates;
    }
    return defaultRates;
  } catch (error) {
    console.error('Ошибка при загрузке курсов валют НБ РК:', error);
    return defaultRates;
  }
};
