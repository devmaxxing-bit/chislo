# Угадай число

Игра на React + Axios с API на Django REST Framework. Компьютер загадывает число от 1 до 100; после каждой попытки игрок получает подсказку. Игра заканчивается победой при правильном ответе или поражением после 10 попыток.

## Запуск

Установите зависимости Python из корневой папки проекта и выполните миграции:

```powershell
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

В отдельном терминале запустите React-приложение:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Откройте адрес Vite, показанный в терминале. Во время разработки Vite перенаправляет запросы `/game-results/` на Django-сервер `http://127.0.0.1:8000`.

## API

- `GET /game-results/` — список результатов, сначала последние.
- `POST /game-results/` — сохранить результат игры.

Пример JSON для `POST`:

```json
{
  "player_name": "Анна",
  "attempts": 4,
  "result": "win"
}
```

Поле `result` принимает значения `win` или `lose`; количество попыток — от 1 до 10.

## Тесты

```powershell
python manage.py test chislo
```
