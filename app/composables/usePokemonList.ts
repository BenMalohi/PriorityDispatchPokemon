// This is not necessary to use in this small of a project, but I want to showcase my knoweledge of how an important feature like this can increase reusibility and efficiency in a more practical application.
import { ref, watch } from 'vue'
import type { Pokedex } from '~/types/pokedex'

export interface SafePokemon {
  name: string
  thumb: string
}

// Helper to normalize API data and provide safe defaults
function mapToSafePokemon(pokedex: Pokedex): SafePokemon {
  return {
    name: pokedex.name ?? 'Unknown',
    thumb:
      pokedex.sprites?.front_default ??
      pokedex.sprites?.other?.home?.front_default ??
      '/assets/poke_ball.png', // fallback image
  }
}

export const usePokemonList = (limit = 60) => {
  const pokemonList = ref<SafePokemon[]>([])
  const filteredPokemon = ref<SafePokemon[]>([])
  const isLoading = ref(true)
  const isError = ref(false)
  const errorMessage = ref('')
  const totalCount = ref(0)
  const offset = ref(0)

  const { data, error, pending, refresh } = useFetch('/api/pokemon', {
    query: { limit, offset: offset },
    key: () => `pokemon-list-${offset.value}`, // unique cache key
    cache: true,
    transform: (response) => ({
      count: response.count,
      results: response.results?.map(mapToSafePokemon) ?? [],
    }),
  })

  // Watch for when data loads and update refs
  watch(data, (newVal) => {
    if (newVal) {
      totalCount.value = newVal.count
      pokemonList.value = newVal.results
      filteredPokemon.value = newVal.results
    }
  })

  // Handle loading + error state reactively
  watch(pending, (val) => (isLoading.value = val))
  watch(error, (err) => {
    if (err) {
      isError.value = true
      errorMessage.value = err.message || 'Failed to fetch Pokémon.'
    } else {
      isError.value = false
      errorMessage.value = ''
    }
  })

  const nextPage = async () => {
    if (offset.value + limit < totalCount.value) {
      offset.value += limit
      await refresh() // re-fetch with new offset
    }
  }

  const prevPage = async () => {
    if (offset.value > 0) {
      offset.value -= limit
      await refresh()
    }
  }

  const filterPokemon = (search: string) => {
    const value = search.trim().toLowerCase()
    filteredPokemon.value = !value
      ? pokemonList.value
      : pokemonList.value.filter((p) =>
          p.name.toLowerCase().startsWith(value)
        )
  }
  return {
    pokemonList,
    filteredPokemon,
    isLoading,
    isError,
    errorMessage,
    totalCount,
    offset,
    limit,
    filterPokemon,
    nextPage,
    prevPage,
  }
}
