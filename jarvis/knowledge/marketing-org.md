# marketing-org.md — схема маркетинг-агентов и их контракты

> Единый источник правды для оркестратора (Jarvis): как устроен отдел маркетинга, какой агент играет какую роль, что он принимает на вход и что обязан вернуть на выход. Читать перед любой маркетинговой задачей с делегированием субагентам.
>
> Принцип: субагенты Claude Code плоские — они не вызывают друг друга. Делегирует и собирает результат **оркестратор (Jarvis)**. «Слои» ниже — это порядок делегирования, а не иерархия подчинения.

---

## Слой 0 — Оркестратор (Jarvis)

Не отдельный агент. Это я. Делаю:

1. Принимаю бизнес-цель от Еркина (напр. «6–7 предоплат за 2 недели через WhatsApp»).
2. Превращаю в маркетинговые задачи и заполняю **общий контекст** (см. ниже) — его получают ВСЕ субагенты.
3. Делегирую по слоям: сначала фундамент (1) → каналы (2) → креатив (3) → прогон через редактора → возврат результата.
4. Агрегирую структурированные выходы, обновляю гипотезы, повторяю цикл.

### Общий контекст (передаётся в КАЖДЫЙ вызов субагента)

```json
{
  "business_goal": "строка — цель в деньгах и срок",
  "product": "что продаём (мини-апп / бот / сайт)",
  "segment": "конкретный сегмент ЦА, не «малый бизнес»",
  "funnel_stage": "awareness | consideration | conversion | retention | advocacy",
  "positioning": "УТП одной фразой (из Positioning_Brand)",
  "constraints": { "budget_kzt": 0, "deadline": "дата", "channels_allowed": ["whatsapp","instagram","tiktok","telegram"] },
  "geo": "Казахстан (Алматы/Астана/регионы), язык рус/каз"
}
```

Если субагент возвращает «эссе» вместо контракта ниже — переспрашиваю с явным указанием формата, не принимаю.

---

## Карта: роль из ТЗ → реальный агент

| Слой | Роль (ТЗ) | Агент | Статус |
|---|---|---|---|
| 1 | Audience_Insights | `karina-research` (Ренат) | активен |
| 1 | Positioning_Brand | `karina-research` (Ренат), режим 2 | активен |
| 1 | Funnel_Designer | `karina-marketing` (Мария) | активен |
| 1 | Marketing_Analytics | `karina-analytics` (Тимур) | активен |
| 2 | Content_SEO_Social | `karina-smm` (София) + `karina-seo` (Николай) | **цикл 1** |
| 2 | Performance_Ads | `karina-ads` (Самат) | спящий (ждёт бюджет) |
| 2 | Email_CRM | — | отложен |
| 2 | Video_Marketing | — | отложен |
| 3 | Creative_Director | `karina-creative` (Лейла) | **цикл 1** |
| 3 | Copy_Creator | `karina-copywriter` (Айгерим) | активен |
| 3 | Visual_Brief_Maker | `karina-ux-dev` (Арман), частично | отложен |
| 3 | Product_Marketing | `karina-marketing` (Мария), частично | отложен |
| 3 | Marketing_Ops | — | отложен |
| ред. | Marketing_Editor | `karina-marketing-editor` | **цикл 1** |
| пре-чек | ЦА-голос | `karina-cold-lead` | активен |

**Первый цикл (решение Еркина, 2026-06-23):** активны Content_SEO_Social + Creative_Director + Marketing_Editor (+ фундамент по необходимости). Канал — органика под реальный WhatsApp+сарафан, без рекламного бюджета. Performance_Ads создан, но спит до появления бюджета. Остальные модули внедряем по мере отладки связок.

---

## Контракты субагентов

Формат един: каждый агент принимает **общий контекст** + свой `input`, возвращает строго `output` (JSON). Никакого свободного текста вне полей.

### Слой 1 — фундамент

#### Audience_Insights → karina-research (Ренат)
```json
// input
{ "task": "что исследовать", "niche": "ниша", "known": "что уже известно" }
// output
{
  "segments": [{ "name": "", "portrait": "", "geo": "", "decision_maker": "" }],
  "jtbd": [{ "job": "", "forces": { "push": "", "pull": "", "anxiety": "", "habit": "" } }],
  "pains_voc": ["боль словами клиента"],
  "triggers": ["что включает покупку"],
  "mentality_notes": "что меняем в подаче под гео",
  "hooks_for_copy": ["углы/крючки для копирайтера"]
}
```

#### Positioning_Brand → karina-research (Ренат), режим 2
```json
// input
{ "competitors": ["url/имя"], "product_strengths": ["..."] }
// output
{
  "utp": "одна фраза как услышит клиент",
  "alternatives": ["с чем нас сравнивают"],
  "differentiators": ["чем реально отличаемся"],
  "value": ["какая от этого ценность клиенту"],
  "tone_of_voice": "",
  "messaging_matrix": [{ "segment": "", "key_message": "", "proof": "" }]
}
```

#### Funnel_Designer → karina-marketing (Мария)
```json
// input
{ "offer": "оффер", "channel": "канал", "avg_check_kzt": 0 }
// output
{
  "funnel": [{ "stage": "", "touchpoint": "", "metric": "", "target_value": 0 }],
  "funnel_math": { "touches": 0, "replies": 0, "calls": 0, "payments": 0, "assumptions": "где факт, где оценка" },
  "money": { "goal_kzt": 0, "deadline": "", "cac_rough_kzt": 0, "payback_deals": 0 },
  "hypotheses": [{ "stage": "", "hypothesis": "", "cheapest_test": "" }]
}
```

#### Marketing_Analytics → karina-analytics (Тимур)
```json
// input
{ "funnel": "ссылка на воронку", "results_raw": "сырые данные если есть" }
// output
{
  "tracking": { "events": ["..."], "utm_scheme": "", "dashboards": ["..."] },
  "key_metrics": [{ "metric": "", "value": 0, "verdict": "норма|низко|высоко" }],
  "interpretation": "почему так",
  "recommendations": ["конкретное действие"]
}
```

### Слой 2 — каналы

#### Content_SEO_Social → karina-smm (София) + karina-seo (Николай)  [ЦИКЛ 1]
Оркестратор вызывает Софию для контент-плана/соцсетей, Николая — для SEO-структуры/ключей, затем сшивает в один output.
```json
// input
{ "topic_pillars": ["рубрики"], "platforms": ["instagram","tiktok","telegram"], "seo_needed": true }
// output
{
  "content_plan": [{ "platform": "", "format": "пост|reels|stories", "rubric": "образ.|развл.|прод.|за кулисами", "hook": "", "cta": "", "lang": "ru|kz" }],
  "posting_grid": "сетка на неделю",
  "seo": { "clusters": [{ "page": "", "keywords": ["..."], "intent": "инфо|коммерч" }], "meta": [{ "page": "", "title": "", "description": "", "h1": "" }] },
  "briefs_for_creative": ["что отдать Creative_Director"]
}
```

#### Performance_Ads → karina-ads (Самат)  [СПЯЩИЙ]
Активируется только при `constraints.budget_kzt > 0`. Контракт описан в файле агента.

### Слой 3 — кросс-функции

#### Creative_Director → karina-creative (Лейла)  [ЦИКЛ 1]
```json
// input
{ "big_task": "под что креатив", "messaging_matrix": "из Positioning_Brand", "hooks": "из Audience_Insights" }
// output
{
  "big_idea": "одна большая идея кампании",
  "concepts": [{ "name": "", "angle": "", "story": "сторителлинг 2-3 фразы", "format_fit": ["reels","пост","лендинг"] }],
  "creative_lines": ["зонтичные линии под серию объявлений/постов"],
  "brand_check": "соответствие tone of voice — да/нет + что поправить"
}
```

#### Copy_Creator → karina-copywriter (Айгерим)
```json
// input
{ "concept": "из Creative_Director", "format": "баннер|лендинг|email|скрипт|пост", "awareness_level": "по Шварцу" }
// output
{
  "headlines": ["..."],
  "subheadlines": ["..."],
  "body": "текст под формат",
  "cta": ["..."],
  "lang_variants": { "ru": "", "kz": "" }
}
```

---

## Marketing_Editor — редактор-ревьюер (karina-marketing-editor)  [ЦИКЛ 1]

Прогоняет ЛЮБОЙ выход субагентов через чек-лист ДО возврата результата оркестратору. Не переписывает — выносит вердикт и список правок.

**Чек-лист (каждый пункт — да/нет + комментарий):**
1. Конкретика: нет общих фраз («повысим узнаваемость»), есть цифры/примеры/сроки.
2. Соответствие ЦА: говорит языком сегмента из контекста, не абстрактно.
3. Соответствие позиционированию: не противоречит УТП и messaging_matrix.
4. Формат канала: соблюдены best-practice канала (длина заголовка, структура UTM, лимиты площадки, рус/каз).
5. Контракт соблюдён: выход — валидный JSON по схеме агента, без свободного эссе.
6. Внутренняя непротиворечивость: нет конфликтов между полями.

```json
// output редактора
{
  "verdict": "approved | needs_fix",
  "checklist": [{ "item": 1, "pass": true, "note": "" }],
  "fixes": ["конкретная правка, если needs_fix"],
  "ready_for_client": false
}
```

`needs_fix` → оркестратор возвращает задачу автору с `fixes`, повторный прогон. `approved` → результат идёт дальше (к cold-lead для продающих текстов или к клиенту).

---

## Отличие Marketing_Editor от cold-lead

- **Marketing_Editor** — внутренний редактор: проверяет КАЧЕСТВО и ФОРМАТ (конкретика, контракт, соответствие брифу). Технический фильтр.
- **cold-lead** — голос ЦА: проверяет, КУПИТ ли реальный казахстанский предприниматель. Эмоциональный фильтр на продающих текстах.

Порядок на продающем тексте: автор → Marketing_Editor (формат/качество) → cold-lead (купит/не купит) → клиент.
