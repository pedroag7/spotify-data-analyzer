import { lazy, Suspense, useMemo, useState } from 'react'
import { UploadScreen } from './components/UploadScreen'
import {
  analyze,
  parseStreamingFiles,
  type ParseError,
  type StreamEntry,
} from './lib/streaming'

const Dashboard = lazy(() =>
  import('./components/Dashboard').then((module) => ({ default: module.Dashboard })),
)

function App() {
  const [entries, setEntries] = useState<StreamEntry[] | null>(null)
  const [errors, setErrors] = useState<ParseError[]>([])
  const [year, setYear] = useState<number | undefined>(undefined)
  const [fileCount, setFileCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const analysis = useMemo(
    () => (entries && entries.length > 0 ? analyze(entries, year) : null),
    [entries, year],
  )

  async function handleFiles(files: File[]) {
    if (files.length === 0) {
      setErrors([{ name: 'importação', message: 'Selecione ao menos um arquivo .json.' }])
      return
    }

    setIsLoading(true)
    try {
      const contents = await Promise.all(
        files.map(async (file) => ({ name: file.name, text: await file.text() })),
      )
      const result = parseStreamingFiles(contents)

      if (result.entries.length === 0) {
        setErrors(
          result.errors.length > 0
            ? result.errors
            : [
                {
                  name: 'importação',
                  message: 'Nenhum registro de audição foi encontrado nos arquivos.',
                },
              ],
        )
        return
      }

      setEntries(result.entries)
      setErrors(result.errors)
      setFileCount(files.length)
      setYear(undefined)
    } catch (error) {
      setErrors([
        {
          name: 'importação',
          message: error instanceof Error ? error.message : 'Falha ao ler os arquivos.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setEntries(null)
    setErrors([])
    setFileCount(0)
    setYear(undefined)
  }

  if (!entries || !analysis) {
    return (
      <UploadScreen onFiles={handleFiles} isLoading={isLoading} errors={errors} />
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] py-12 text-center font-display text-2xl font-semibold uppercase tracking-wider text-muted-foreground">
          Preparando seu dashboard…
        </div>
      }
    >
      <Dashboard
        analysis={analysis}
        year={year}
        onYearChange={setYear}
        onReset={reset}
        fileCount={fileCount}
        errors={errors}
      />
    </Suspense>
  )
}

export default App
