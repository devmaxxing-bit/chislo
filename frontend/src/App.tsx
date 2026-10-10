import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'

type GameResult = {
  id: number
  player_name: string
  attempts: number
  result: 'win' | 'lose'
}

type GameOutcome = GameResult['result']

const MAX_ATTEMPTS = 10

function App() {
  const [playerName, setPlayerName] = useState('')
  const [guess, setGuess] = useState('')
  const [secretNumber, setSecretNumber] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [hint, setHint] = useState('Введите имя, чтобы начать игру')
  const [outcome, setOutcome] = useState<GameOutcome | null>(null)
  const [results, setResults] = useState<GameResult[]>([])
  const [isLoadingResults, setIsLoadingResults] = useState(true)
  const [isSavingResult, setIsSavingResult] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    axios
      .get<GameResult[]>('/game-results/')
      .then(({ data }) => setResults(data))
      .catch(() => setApiError('Не удалось загрузить результаты. Проверьте соединение с сервером.'))
      .finally(() => setIsLoadingResults(false))
  }, [])

  const startGame = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!playerName.trim()) return

    setPlayerName(playerName.trim())
    setSecretNumber(Math.floor(Math.random() * 100) + 1)
    setAttempts(0)
    setGuess('')
    setOutcome(null)
    setHint('Загадано число от 1 до 100. Ваша первая попытка?')
    setApiError('')
  }

  const saveResult = async (finalAttempts: number, finalOutcome: GameOutcome) => {
    setIsSavingResult(true)
    try {
      const { data } = await axios.post<GameResult>('/game-results/', {
        player_name: playerName,
        attempts: finalAttempts,
        result: finalOutcome,
      })
      setResults((currentResults) => [data, ...currentResults])
    } catch {
      setApiError('Не удалось сохранить результат. Проверьте соединение и начните новую игру.')
    } finally {
      setIsSavingResult(false)
    }
  }

  const submitGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (secretNumber === null || outcome !== null) return

    const number = Number(guess)
    if (!Number.isInteger(number) || number < 1 || number > 100) return

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setGuess('')

    if (number === secretNumber) {
      setOutcome('win')
      setHint(`Угадано! Это было число ${secretNumber}.`)
      void saveResult(nextAttempts, 'win')
    } else if (nextAttempts === MAX_ATTEMPTS) {
      setOutcome('lose')
      setHint(`Попытки закончились. Было загадано число ${secretNumber}.`)
      void saveResult(nextAttempts, 'lose')
    } else {
      setHint(number < secretNumber ? 'Загаданное число больше' : 'Загаданное число меньше')
    }
  }

  const resetGame = () => {
    setSecretNumber(null)
    setAttempts(0)
    setGuess('')
    setOutcome(null)
    setHint('Введите имя, чтобы начать игру')
  }

  const isPlaying = secretNumber !== null && outcome === null

  return (
    <main>
      <header>
        <a href="/">Число</a>
        <span>Игра на внимательность</span>
      </header>

      <section aria-labelledby="page-title">
        <div>МИНИ-ИГРА</div>
        <h1 id="page-title">Угадай число</h1>
        <p>
          Я загадал число от 1 до 100.
          <br />
          Сможешь найти его за 10 попыток?
        </p>

        <section aria-label="Игровая панель">
          <div>
            <span>{isPlaying ? 'ВАША ИГРА' : outcome ? 'ИГРА ЗАВЕРШЕНА' : 'НОВАЯ ИГРА'}</span>
            <span>Попыток: {attempts} / {MAX_ATTEMPTS}</span>
          </div>

          {secretNumber === null ? (
            <form onSubmit={startGame}>
              <label htmlFor="player-name">Как к вам обращаться?</label>
              <input
                id="player-name"
                maxLength={80}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Ваше имя"
                required
                value={playerName}
              />
              <button type="submit">Начать игру</button>
            </form>
          ) : (
            <>
              <p role="status">{hint}</p>

              {isPlaying && (
                <form onSubmit={submitGuess}>
                  <label htmlFor="guess-number">Ваш вариант</label>
                  <input
                    id="guess-number"
                    max="100"
                    min="1"
                    onChange={(event) => setGuess(event.target.value)}
                    placeholder="1 — 100"
                    required
                    type="number"
                    value={guess}
                  />
                  <button type="submit">Проверить</button>
                </form>
              )}

              <p>Использовано попыток: {attempts} из {MAX_ATTEMPTS}</p>

              {outcome && (
                <div>
                  <p>{isSavingResult ? 'Сохраняем результат…' : `Попыток использовано: ${attempts}`}</p>
                  <button onClick={resetGame} type="button">Начать заново</button>
                </div>
              )}
            </>
          )}

          {apiError && <p role="alert">{apiError}</p>}
        </section>

        <p>Каждая новая игра — новое случайное число</p>
      </section>

      <aside aria-labelledby="results-title">
        <div>
          <div>ТАБЛИЦА ИГР</div>
          <h2 id="results-title">Результаты</h2>
          <span>Всего игр: {results.length}</span>
        </div>
        <p>Последние игры участников</p>

        {isLoadingResults ? (
          <p>Загружаем результаты…</p>
        ) : results.length === 0 ? (
          <div>
            <p>Здесь появятся результаты</p>
            <p>Сыграйте первую партию!</p>
          </div>
        ) : (
          <ol>
            {results.map((result) => (
              <li key={result.id}>
                <span>{result.player_name}</span>
                <span>{result.result === 'win' ? 'Победа' : 'Поражение'}</span>
                <span>{result.attempts} попыток</span>
              </li>
            ))}
          </ol>
        )}
        <p>Список обновляется после каждой игры</p>
      </aside>

      <footer>
        <span>Проверь свою интуицию</span>
        <span>От 1 до 100</span>
      </footer>
    </main>
  )
}

export default App
