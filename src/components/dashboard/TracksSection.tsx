import type { RankedItem } from '../../lib/streaming'
import { TopList } from '../TopList'
import { cn } from '../../lib/utils'

export interface TracksSectionProps {
  topArtists: RankedItem[]
  topTracks: RankedItem[]
  topAlbums: RankedItem[]
  className?: string
}

export function TracksSection({
  topArtists,
  topTracks,
  topAlbums,
  className,
}: TracksSectionProps) {
  return (
    <section
      className={cn('liner flex flex-col gap-6 min-w-0 mt-12 sm:mt-16', className)}
      aria-labelledby="sec-faixas"
    >
      <h2
        className="liner-title m-0 pb-2 border-b-2 border-foreground font-display font-extrabold text-3xl sm:text-4xl uppercase leading-none tracking-tight text-foreground"
        id="sec-faixas"
      >
        Faixas
      </h2>
      <div className="tracks grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <TopList title="Artistas mais ouvidos" items={topArtists} />
        <TopList title="Músicas mais ouvidas" items={topTracks} />
        <TopList title="Álbuns mais ouvidos" items={topAlbums} />
      </div>
    </section>
  )
}
