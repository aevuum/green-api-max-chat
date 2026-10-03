# MAX Chat · GREEN-API

Веб-интерфейс для отправки и получения текстовых сообщений в мессенджере **MAX** через сервис [GREEN-API](https://green-api.com/max). Внешний вид основан на [web.max.ru](https://web.max.ru/).

**Демо:** https://aevuum.github.io/green-api-max-chat/

## Возможности

- вход по `idInstance` и `apiTokenInstance` из личного кабинета GREEN-API (с проверкой состояния инстанса);
- создание чата по номеру телефона получателя;
- отправка текстовых сообщений — метод [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/);
- получение ответов — [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/) (`ReceiveNotification` + `DeleteNotification`);
- статусы доставки (отправлено / доставлено / прочитано), счётчик непрочитанных;
- сообщения, отправленные с телефона, тоже появляются в чате;
- чаты и сессия сохраняются в `localStorage`;
- адаптивная вёрстка (на мобильных — список чатов и переписка на отдельных экранах).

## Как это работает

1. Пользователь вводит данные инстанса. Приложение вызывает `getStateInstance` и пускает дальше только при статусе `authorized`.
2. При создании чата номер телефона нормализуется и проверяется методом `checkAccount`. В MAX `chatId` — это идентификатор пользователя, а не номер телефона, поэтому он берётся из ответа `checkAccount`.
3. Сообщение сразу отображается в чате со статусом «отправляется», после ответа `sendMessage` получает `idMessage` от сервера.
4. Пока открыт мессенджер, работает цикл long polling: `receiveNotification?receiveTimeout=5` → обработка уведомления → `deleteNotification`. Обрабатываются `incomingMessageReceived`, `outgoingMessageReceived` и `outgoingMessageStatus` (типы `textMessage` и `extendedTextMessage`).

> Для получения уведомлений через HTTP API в настройках инстанса должно быть пустое поле `webhookUrl` и включены уведомления о входящих сообщениях (для статусов — и об исходящих).

## Стек

- React 19, TypeScript (strict), Vite
- Zustand — состояние сессии и чатов
- CSS Modules
- Vitest + Testing Library
- oxlint, Prettier
- GitHub Actions: CI и деплой на GitHub Pages

## Архитектура

Проект организован по [Feature-Sliced Design](https://feature-sliced.design/):

```
src/
├── app/        # точка входа, глобальные стили
├── pages/      # login, messenger
├── widgets/    # sidebar, chat-window
├── features/   # auth, logout, create-chat, send-message, receive-messages
├── entities/   # session, chat (модель, стор, UI сообщений и чатов)
└── shared/     # api-клиент GREEN-API, ui-kit, утилиты, конфиг
```

- `shared/api` — `HttpClient` (абстракция над fetch) и `GreenApiClient`, который получает HTTP-клиент через конструктор — это упрощает тестирование и замену транспорта.
- `entities/chat` — бизнес-логика чатов в чистых функциях (`chatsModel.ts`), стор только вызывает их.
- `features/receive-messages` — `NotificationPoller` отвечает за цикл получения уведомлений, а `parseNotification` превращает вебхуки в доменные события через таблицу парсеров по `typeWebhook`. Новый тип уведомления добавляется одним парсером, без изменения остального кода.

## Локальный запуск

Требуется Node.js 20+.

```bash
git clone https://github.com/aevuum/green-api-max-chat.git
cd green-api-max-chat
npm install
npm run dev
```

Приложение откроется на http://localhost:5173.

### Скрипты

| Команда             | Описание                       |
| ------------------- | ------------------------------ |
| `npm run dev`       | dev-сервер                     |
| `npm run build`     | проверка типов и сборка в dist |
| `npm run preview`   | просмотр собранной версии      |
| `npm test`          | unit-тесты                     |
| `npm run lint`      | линтер                         |
| `npm run typecheck` | проверка типов                 |
| `npm run format`    | форматирование кода            |

## Где взять данные для входа

1. Зарегистрируйтесь в [личном кабинете GREEN-API](https://console.green-api.com/) и создайте инстанс MAX.
2. Авторизуйте аккаунт MAX по SMS-коду.
3. Скопируйте `apiUrl`, `idInstance` и `apiTokenInstance` со страницы инстанса.

Данные хранятся только в `localStorage` браузера и отправляются напрямую в GREEN-API.
