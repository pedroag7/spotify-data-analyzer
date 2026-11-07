import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { UploadScreen } from '../UploadScreen'
import type { ParseError } from '../../lib/streaming'

describe('UploadScreen', () => {
  it('renders hero title, copy, and product signature', () => {
    const html = renderToStaticMarkup(
      <UploadScreen onFiles={vi.fn()} isLoading={false} errors={[]} />
    )

    expect(html).toContain('Descubra como você realmente ouve música.')
    expect(html).toContain('Importe o histórico ampliado do Spotify')
    expect(html).toContain('Spotify Data Analyzer')
  })

  it('renders dropzone with proper accessibility attributes in idle state', () => {
    const html = renderToStaticMarkup(
      <UploadScreen onFiles={vi.fn()} isLoading={false} errors={[]} />
    )

    expect(html).toContain('role="button"')
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('aria-busy="false"')
    expect(html).toContain('aria-disabled="false"')
    expect(html).toContain('Arraste seus arquivos .json aqui')
    expect(html).toContain('ou clique para selecionar vários arquivos')
    expect(html).toContain('Selecionar arquivos')
  })

  it('renders dropzone with loading state and spinner', () => {
    const html = renderToStaticMarkup(
      <UploadScreen onFiles={vi.fn()} isLoading={true} errors={[]} />
    )

    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('aria-disabled="true"')
    expect(html).toContain('Lendo seus arquivos…')
    expect(html).toContain('Isso leva só um instante.')
    expect(html).toContain('animate-spin')
  })

  it('renders error list when errors are present', () => {
    const errors: ParseError[] = [
      { name: 'Streaming_History_0.json', message: 'JSON inválido ou corrompido' },
      { name: 'file2.txt', message: 'Formato não suportado' },
    ]
    const html = renderToStaticMarkup(
      <UploadScreen onFiles={vi.fn()} isLoading={false} errors={errors} />
    )

    expect(html).toContain('role="alert"')
    expect(html).toContain('2 arquivo(s) não puderam ser lidos')
    expect(html).toContain('Streaming_History_0.json')
    expect(html).toContain('JSON inválido ou corrompido')
    expect(html).toContain('file2.txt')
    expect(html).toContain('Formato não suportado')
  })

  it('does not render error alert when error array is empty', () => {
    const html = renderToStaticMarkup(
      <UploadScreen onFiles={vi.fn()} isLoading={false} errors={[]} />
    )

    expect(html).not.toContain('role="alert"')
    expect(html).not.toContain('arquivo(s) não puderam ser lidos')
  })

  it('renders how-to instructions and privacy guarantee', () => {
    const html = renderToStaticMarkup(
      <UploadScreen onFiles={vi.fn()} isLoading={false} errors={[]} />
    )

    expect(html).toContain('Como pegar seu histórico')
    expect(html).toContain('01')
    expect(html).toContain('spotify.com/account/privacy')
    expect(html).toContain('02')
    expect(html).toContain('Histórico de streaming estendido')
    expect(html).toContain('03')
    expect(html).toContain('Streaming_History_*.json')
    expect(html).toContain('Seus dados são lidos localmente no navegador')
  })
})
