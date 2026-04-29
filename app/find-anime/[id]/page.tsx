import Link from 'next/link'
import Nav from '../../navigation/nav'
import Footer from '../../footer/footer'
import './anime-detail.css'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

type AnimeDetail = {
  title?: string
  title_english?: string
  type?: string
  episodes?: number
  status?: string
  duration?: string
  rating?: string
  score?: number
  year?: number
  synopsis?: string
  url?: string
  images?: {
    jpg?: {
      large_image_url?: string
      image_url?: string
    }
  }
  aired?: {
    string?: string
  }
  genres?: {
    mal_id: number
    name: string
  }[]
}

type JikanDetailResponse = {
  data?: AnimeDetail
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params
  const anime = await getAnime(id)

  return (
    <>
      <Nav />
      <main id="anime-detail-page">
        {!anime ? (
          <p className="anime-detail__message">Anime details could not be loaded.</p>
        ) : (
          <section className="anime-detail__container">
            <figure className="anime-detail__poster">
              <img
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ''}
                alt={anime.title || 'Anime poster'}
                className="anime-detail__img"
              />
            </figure>

            <div className="anime-detail__content">
              <Link href="/find-anime" className="anime-detail__link">
                Back to Find Anime
              </Link>

              <h1 className="anime-detail__title">{anime.title_english || anime.title}</h1>

              <div className="anime-detail__meta">
                <DetailItem label="Release" value={anime.aired?.string || anime.year || 'N/A'} />
                <DetailItem label="Type" value={anime.type || 'N/A'} />
                <DetailItem label="Episodes" value={anime.episodes || 'N/A'} />
                <DetailItem label="Status" value={anime.status || 'N/A'} />
                <DetailItem label="Score" value={anime.score || 'N/A'} />
                <DetailItem label="Rating" value={anime.rating || 'N/A'} />
                <DetailItem label="Duration" value={anime.duration || 'N/A'} />
                <DetailItem label="Genres" value={anime.genres?.map((genre) => genre.name).join(', ') || 'N/A'} />
              </div>

              <p className="anime-detail__description">{anime.synopsis || 'No description available.'}</p>

              {anime.url && (
                <a href={anime.url} target="_blank" rel="noreferrer" className="anime-detail__link">
                  View on MyAnimeList
                </a>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="anime-detail__meta-item">
      <span className="anime-detail__label">{label}</span>
      <span>{value}</span>
    </div>
  )
}

async function getAnime(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return null
    }

    const data = (await res.json()) as JikanDetailResponse

    return data.data || null
  } catch {
    return null
  }
}
