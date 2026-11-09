import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import type { ParseError } from '../lib/streaming'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

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

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function DiscIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgProps} className={className} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="0.8" />
      <path d="M12 2.5a9.5 9.5 0 0 1 6.7 2.8" />
    </svg>
  )
}

function LoadingIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgProps} className={className} {...props}>
      <circle cx="12" cy="12" r="9.5" opacity="0.3" />
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" />
    </svg>
  )
}

function LockIcon({ className, ...props }: IconProps) {
  return (
    <svg {...svgProps} className={className} {...props}>
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
    <main className="relative z-1 max-w-[1120px] mx-auto px-6 pt-14 pb-18 grid grid-cols-1 gap-8 min-[900px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[900px]:gap-x-12 min-[900px]:items-start animate-enter">
      <header className="pb-6 border-b-2 border-foreground min-[900px]:col-span-full">
        <h1 className="m-0 max-w-[20ch] font-display font-extrabold text-[clamp(2.25rem,6.5vw,4.5rem)] leading-[1.05] tracking-tight uppercase text-foreground text-balance">
          Descubra como você realmente ouve música.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[0.9375rem] leading-[1.55] text-muted-foreground">
          Importe o histórico ampliado do Spotify e veja seus artistas, músicas e
          hábitos favoritos. Tudo é processado no seu navegador: nenhum dado sai da
          sua máquina.
        </p>
        <p className="mt-4 text-xs font-bold tracking-[0.12em] uppercase text-muted-foreground">
          Spotify Data Analyzer
        </p>
      </header>

      <Card
        className={cn(
          'flex flex-col items-center justify-center gap-2 min-h-[220px] p-9 px-6 text-center cursor-pointer',
          'bg-card text-foreground border border-foreground rounded-[2px]',
          'outline-1 outline-border outline-offset-4',
          'transition-[background-color,border-color,color,transform] duration-200 [transition-timing-function:var(--ease-out)]',
          'active:scale-[0.985] motion-reduce:active:scale-100',
          'focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-4',
          'hover:bg-muted/50',
          'min-[900px]:col-start-1 min-[900px]:row-start-2',
          isDragging && 'bg-primary border-foreground text-card hover:bg-primary scale-[1.01]',
          isLoading && 'cursor-progress bg-muted/50'
        )}
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
        <span
          className={cn(
            'inline-flex w-14 h-14 transition-transform duration-200 [transition-timing-function:var(--ease-out)]',
            isDragging ? 'text-card scale-110' : 'text-primary'
          )}
          aria-hidden="true"
        >
          {isLoading ? (
            <span className="inline-flex w-full h-full items-center justify-center animate-spin origin-center motion-reduce:duration-[3s]">
              <LoadingIcon className="w-full h-full" />
            </span>
          ) : (
            <DiscIcon className="w-full h-full" />
          )}
        </span>
        <strong className="font-display font-bold text-[1.75rem] leading-[1.1] uppercase tracking-normal">
          {isLoading ? 'Lendo seus arquivos…' : 'Arraste seus arquivos .json aqui'}
        </strong>
        <span
          className={cn(
            'text-sm',
            isDragging ? 'text-card' : 'text-muted-foreground'
          )}
        >
          {isLoading ? 'Isso leva só um instante.' : 'ou clique para selecionar vários arquivos'}
        </span>
        <Button
          type="button"
          variant={isDragging ? 'secondary' : 'outline'}
          size="sm"
          className={cn(
            'mt-2 pointer-events-none font-medium',
            isDragging
              ? 'border-card text-foreground bg-card'
              : 'border-foreground/30 hover:border-foreground'
          )}
          tabIndex={-1}
          aria-hidden="true"
        >
          {isLoading ? 'Lendo…' : 'Selecionar arquivos'}
        </Button>
      </Card>

      {errors.length > 0 ? (
        <Card
          role="alert"
          className="p-3.5 px-4 text-destructive bg-card border-destructive rounded-[2px] text-sm min-[900px]:col-start-1 min-[900px]:row-start-3"
        >
          <strong className="block mb-2 font-bold">
            {errors.length} arquivo(s) não puderam ser lidos
          </strong>
          <ul className="m-0 pl-4.5 text-foreground flex flex-col gap-1 break-words list-disc">
            {errors.map((error, index) => (
              <li key={`${error.name}-${error.message}-${index}`}>
                <span className="font-semibold">{error.name}</span> — {error.message}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <section className="flex flex-col gap-4 min-[900px]:col-start-2 min-[900px]:row-start-2 min-[900px]:row-span-2">
        <h2 className="m-0 pb-2 border-b border-foreground font-display font-bold text-2xl tracking-[0.01em] uppercase text-foreground">
          Como pegar seu histórico
        </h2>
        <ol className="m-0 p-0 list-none flex flex-col">
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-3 border-b border-border text-[0.9375rem] leading-[1.55] text-foreground break-words">
            <span
              className="font-display font-bold text-2xl leading-none text-foreground justify-self-start pt-1 border-t-3 border-primary tabular-nums"
              aria-hidden="true"
            >
              01
            </span>
            <div>
              Acesse{' '}
              <code className="inline-block px-1.5 font-mono text-[0.8125rem] text-foreground bg-muted/60 border border-border rounded-[2px]">
                spotify.com/account/privacy
              </code>{' '}
              e entre na sua conta.
            </div>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-3 border-b border-border text-[0.9375rem] leading-[1.55] text-foreground break-words">
            <span
              className="font-display font-bold text-2xl leading-none text-foreground justify-self-start pt-1 border-t-3 border-primary tabular-nums"
              aria-hidden="true"
            >
              02
            </span>
            <div>
              Em <strong>Baixar seus dados</strong>, marque{' '}
              <strong>Histórico de streaming estendido</strong> e solicite a exportação.
            </div>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-3 border-b border-border text-[0.9375rem] leading-[1.55] text-foreground break-words">
            <span
              className="font-display font-bold text-2xl leading-none text-foreground justify-self-start pt-1 border-t-3 border-primary tabular-nums"
              aria-hidden="true"
            >
              03
            </span>
            <div>
              O Spotify envia um e-mail em alguns dias com um .zip. Extraia os arquivos
              e importe aqui todos os{' '}
              <code className="inline-block px-1.5 font-mono text-[0.8125rem] text-foreground bg-muted/60 border border-border rounded-[2px]">
                Streaming_History_*.json
              </code>
              .
            </div>
          </li>
        </ol>
        <p className="flex items-start gap-2 m-0 text-[0.8125rem] leading-normal text-muted-foreground">
          <LockIcon className="shrink-0 w-[18px] h-[18px] mt-0.5 text-foreground" />
          <span>
            Seus dados são lidos localmente no navegador e nunca são enviados para
            nenhum servidor.
          </span>
        </p>
      </section>
    </main>
  )
}
