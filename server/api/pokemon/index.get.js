import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/pokemon',
  headers: { 'Content-Type': 'application/json' },
})

export default defineEventHandler(async (event) => {
  try {
    // Get query params (e.g., ?limit=60)
    const query = getQuery(event)
    const limit = Number(query.limit) || 60

    // Fetch list of Pokémon names
    const listResponse = await api.get('', { params: { limit } })
    const names = listResponse.data.results.map((p) => p.name)

    // Fetch full details for each Pokémon in parallel
    const promises = names.map(async (name) => {
      const res = await api.get(`/${name}`)
      return res.data
    })

    const fullData = await Promise.all(promises)
    return fullData
  } catch (error) {
    console.error('Error fetching Pokémon list:', error)
    return {
      error: true,
      message: error.message || 'Failed to fetch Pokémon list',
      data: [],
    }
  }
})
