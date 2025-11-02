import { ref, watch, computed } from 'vue'
import type { Pokedex } from '~/types/pokedex'
import { useRoute, useRouter } from 'vue-router'

export interface SafePokemon {
  name: string
  thumb: string
}

function mapToSafePokemon(pokedex: Pokedex): SafePokemon {
  return {
    name: pokedex.name ?? 'Unknown',
    thumb:
      pokedex.sprites?.front_default ??
      pokedex.sprites?.other?.home?.front_default ??
      '/assets/poke_ball.png',
  }
}

export const usePokemonList = (limit = 60) => {
  const route = useRoute?.() ?? { query: {} }
  const router = useRouter?.() ?? { replace: () => {} }


  const pokemonList = ref<SafePokemon[]>([])
  const filteredPokemon = ref<SafePokemon[]>([])
  const isLoading = ref(true)
  const isError = ref(false)
  const errorMessage = ref('')
  const totalCount = ref(0)
  const offset = ref(Number(route.query.offset) || 0)

  // reactive query
  const query = computed(() => ({ limit, offset: offset.value }))

  const { data, error, pending, refresh } = useFetch('/api/pokemon', {
    query,
    key: () => `pokemon-list-${offset.value}`,
    cache: true,
    immediate: true, // fetch automatically on load
    transform: (response) => ({
      count: response.count,
      results: response.results?.map(mapToSafePokemon) ?? [],
    }),
  })
  // fetch initial data
  refresh()

  // Watch for when data loads
  watch(data, (newVal) => {
    if (newVal) {
      totalCount.value = newVal.count
      pokemonList.value = newVal.results
      filteredPokemon.value = newVal.results
    }
  })

  // Loading + error handling
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

  // update URL when offset changes
  watch(offset, (newOffset) => {
    router.replace({ query: { ...route.query, offset: newOffset } })
  })

  const nextPage = () => {
    if (offset.value + limit < totalCount.value) {
      offset.value += limit
    }
  }

  const prevPage = () => {
    if (offset.value > 0) {
      offset.value -= limit
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
    refresh,
  }
}
