import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import type { ParseError } from '../lib/streaming'

interface UploadScreenProps {
  onFiles: (files: File[]) => void
  isLoading: boolean
  errors: ParseError[]
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

function DiscIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="0.8" />
      <path d="M12 2.5a9.5 9.5 0 0 1 6.7 2.8" />
    </svg>
  )
}

function LoadingIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9.5" opacity="0.3" />
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg {...svgProps}>
      <rect x="5" y="11" width="14" height="9.5" rx="1" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
export function UploadScreen({ onFiles, isLoading, errors }: UploadScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleSelection(files: FileList | null) {
    if (!files || files.length === 0) return
    onFiles([...files])
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleSelection(event.target.files)
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    handleSelection(event.dataTransfer.files)
  }

  return (
    <main className="upload">
      <header className="hero">
        <h1>Descubra como você realmente ouve música.</h1>
        <p>
          Importe o histórico ampliado do Spotify e veja seus artistas, músicas e
          hábitos favoritos. Tudo é processado no seu navegador: nenhum dado sai da
          sua máquina.
        </p>
        <p className="hero-credit">Spotify Data Analyzer</p>
      </header>

      <div
        className={`dropzone${isDragging ? ' dropzone--active' : ''}${isLoading ? ' dropzone--loading' : ''}`}
        onDragOver={(event) => {
          if (isLoading) return
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          if (isLoading) return
          handleDrop(event)
        }}
        onClick={() => {
          if (!isLoading) inputRef.current?.click()
        }}
        role="button"
        tabIndex={0}
        aria-busy={isLoading}
        aria-disabled={isLoading}
        onKeyDown={(event) => {
          if (!isLoading && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          multiple
          onChange={handleChange}
          hidden
        />
        <span className="dropzone-icon" aria-hidden="true">
          {isLoading ? <LoadingIcon /> : <DiscIcon />}
        </span>
        <strong>{isLoading ? 'Lendo seus arquivos…' : 'Arraste seus arquivos .json aqui'}</strong>
        <span className="dropzone-sub">
          {isLoading ? 'Isso leva só um instante.' : 'ou clique para selecionar vários arquivos'}
        </span>
      </div>

      {errors.length > 0 ? (
        <div className="error-box" role="alert">
          <strong>{errors.length} arquivo(s) não puderam ser lidos</strong>
          <ul>
            {errors.map((error, index) => (
              <li key={`${error.name}-${error.message}-${index}`}>
                <span>{error.name}</span> — {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="how-to">
        <h2>Como pegar seu histórico</h2>
        <ol>
          <li>
            Acesse <span className="pill">spotify.com/account/privacy</span> e entre na
            sua conta.
          </li>
          <li>
            Em <strong>Baixar seus dados</strong>, marque{' '}
            <strong>Histórico de streaming estendido</strong> e solicite a exportação.
          </li>
          <li>
            O Spotify envia um e-mail em alguns dias com um .zip. Extraia os arquivos
            e importe aqui todos os <span className="pill">Streaming_History_*.json</span>.
          </li>
        </ol>
        <p className="privacy-note">
          <LockIcon />
          <span>Seus dados são lidos localmente no navegador e nunca são enviados para
          nenhum servidor.</span>
        </p>
      </section>
    </main>
  )
}
