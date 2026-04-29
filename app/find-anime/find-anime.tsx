'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import FindAnime from '../assets/find-anime.png'
import './find-anime.css'

type Anime = {
  mal_id: number
  title?: string
  type?: string
  synopsis?: string
  rating?: string
  year?: number
  images?: {
    jpg?: {
      large_image_url?: string
      image_url?: string
    }
  }
}

type JikanResponse = {
  data?: Anime[]
}

const PAGE_SIZE = 8
const typeOrder = ['TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music']

const FindAnimePage = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Anime[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [sort, setSort] = useState('default')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initialSearch = new URLSearchParams(window.location.search).get('search')

    if (initialSearch) {
      window.setTimeout(() => {
        setSearch(initialSearch)
        searchAnime(initialSearch)
      }, 0)
    }
  }, [])

  const sortedResults = useMemo(() => {
    const nextResults = [...results]

    if (sort === 'az') {
      nextResults.sort((a, b) => compareText(a.title, b.title))
    }

    if (sort === 'za') {
      nextResults.sort((a, b) => compareText(b.title, a.title))
    }

    if (sort === 'newest') {
      nextResults.sort((a, b) => (b.year || 0) - (a.year || 0))
    }

    if (sort === 'oldest') {
      nextResults.sort((a, b) => (a.year || 9999) - (b.year || 9999))
    }

    if (sort === 'type') {
      nextResults.sort((a, b) => {
        const typeDifference = getTypeRank(a.type) - getTypeRank(b.type)

        if (typeDifference !== 0) {
          return typeDifference
        }

        return compareText(a.title, b.title)
      })
    }

    return nextResults
  }, [results, sort])

  const visibleResults = sortedResults.slice(0, visibleCount)

  async function searchAnime(searchString: string) {
    const trimmedSearch = searchString.trim()

    if (!trimmedSearch) {
      setResults([])
      setMessage('Please enter a search term.')
      return
    }

    setIsLoading(true)
    setMessage('')
    setVisibleCount(PAGE_SIZE)

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(trimmedSearch)}`)

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = (await res.json()) as JikanResponse

      if (!data.data || data.data.length === 0) {
        setResults([])
        setMessage(`No results found for "${trimmedSearch}".`)
        return
      }

      setResults(data.data)
    } catch (err) {
      setResults([])
      setMessage(err instanceof Error ? `Error: ${err.message}` : 'Error: Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    searchAnime(search)
  }

  return (
    <section id="find-anime-page">
      <div className="header__container">
        <figure className="header__background--img">
          <img src={FindAnime.src} alt="Anime Scout Find Anime Page" className="header__img" />
        </figure>

        <div className="header__content">
          <h1 className="header__title">Browse Our Anime Collection</h1>

          <form className="input__wrapper" onSubmit={handleSubmit}>
            <input
              id="search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by description, name, keyword"
              className="header__input"
            />

            {results.length > 0 && (
              <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="az">A to Z</option>
                <option value="za">Z to A</option>
                <option value="newest">Release Date: Newest</option>
                <option value="oldest">Release Date: Oldest</option>
                <option value="type">Type</option>
              </select>
            )}

            <button type="submit" className="btn click" disabled={isLoading}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>

        <div className="anime-list" id="anime-list">
          {isLoading && <p className="anime-message">Loading...</p>}
          {!isLoading && message && <p className="anime-message">{message}</p>}

          {!isLoading &&
            visibleResults.map((anime) => (
              <Link className="anime-card" href={`/find-anime/detail?id=${anime.mal_id}`} key={anime.mal_id}>
                <div className="anime-image">
                  <img
                    src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ''}
                    className="anime-img"
                    alt={anime.title || 'Anime'}
                  />
                </div>
                <div className="anime-details">
                  <h3 className="anime-title">{anime.title}</h3>
                  <p className="anime-year">{anime.year || 'Release date unavailable'}</p>
                </div>
              </Link>
            ))}
        </div>

        {visibleCount < sortedResults.length && (
          <button className="load-more-btn" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Load more
          </button>
        )}
      </div>
    </section>
  )
}

function compareText(first = '', second = '') {
  return first.localeCompare(second, undefined, { sensitivity: 'base' })
}

function getTypeRank(type = '') {
  const index = typeOrder.indexOf(type)

  return index === -1 ? typeOrder.length : index
}

export default FindAnimePage
