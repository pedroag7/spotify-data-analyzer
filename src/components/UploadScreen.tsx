import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import type { ParseError } from '../lib/streaming'

interface UploadScreenProps {
  onFiles: (files: File[]) => void
  isLoading: boolean
  errors: ParseError[]
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
      <div className="upload-glow" aria-hidden="true" />

      <header className="hero">
        <span className="eyebrow">Spotify Data Analyzer</span>
        <h1>Descubra como você realmente ouve música.</h1>
        <p>
          Importe o histórico ampliado do Spotify e veja seus artistas, músicas e
          hábitos favoritos. Tudo é processado no seu navegador: nenhum dado sai da
          sua máquina.
        </p>
      </header>

      <div
        className={`dropzone${isDragging ? ' dropzone--active' : ''}${isLoading ? ' dropzone--loading' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
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
          {isLoading ? '⏳' : '🎧'}
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
            {errors.map((error) => (
              <li key={`${error.name}-${error.message}`}>
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
          🔒 Seus dados são lidos localmente no navegador e nunca são enviados para
          nenhum servidor.
        </p>
      </section>
    </main>
  )
}
