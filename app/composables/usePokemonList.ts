// This is not necessary to use in this small of a project, but I want to showcase my knoweledge of how an important feature like this can increase reusibility and efficiency in a more practical application.
import { ref } from 'vue'
import type { Pokedex } from '~/types/pokedex'

// ------------------ Types ------------------
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

export const usePokemonList = async (limit = 60) => {
  const pokemonList = ref<SafePokemon[]>([])
  const filteredPokemon = ref<SafePokemon[]>([])
  const isLoading = ref(true)
  const isError = ref(false)
  const errorMessage = ref('')

  const fetchPokemonList = async () => {
    try {
      isLoading.value = true
      isError.value = false
      errorMessage.value = ''

      const { data, error } = await useFetch<Pokedex[]>('/api/pokemon', {
        query: { limit },
        transform: (list) => list?.map(mapToSafePokemon) ?? [],
      })

      if (error.value) throw new Error(error.value.message || 'Failed to fetch Pokémon.')

      pokemonList.value = data.value ?? []
      filteredPokemon.value = pokemonList.value
    } catch (err) {
      const e = err as Error
      isError.value = true
      errorMessage.value = e.message
      console.error('Fetch error:', e)
    } finally {
      isLoading.value = false
    }
  }

  const filterPokemon = (search: string) => {
    const value = search.trim().toLowerCase()
    filteredPokemon.value = !value
      ? pokemonList.value
      : pokemonList.value.filter((p) => p.name.toLowerCase().startsWith(value))
  }

  await fetchPokemonList()

  return {
    pokemonList,
    filteredPokemon,
    isLoading,
    isError,
    errorMessage,
    fetchPokemonList,
    filterPokemon,
  }
}
