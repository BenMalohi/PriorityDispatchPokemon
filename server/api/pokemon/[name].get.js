import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/pokemon',
  headers: { 'Content-Type': 'application/json' },
})

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Pokémon name parameter.',
    })
  }

  try {
    // Fetch Pokémon data
    const { data } = await api.get(`/${encodeURIComponent(name)}`)

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: `Pokémon "${name}" not found.`,
      })
    }

    return data
  } catch (error) {
    console.error('Pokémon API fetch error:', error.message)

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Failed to fetch Pokémon "${name}": ${error.message || 'Unknown error'}`,
    })
  }
})
