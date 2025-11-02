import axios from 'axios'
import { defineEventHandler, getRouterParam, createError } from 'h3'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/pokemon',
  headers: { 'Content-Type': 'application/json' },
})

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Missing Pokémon name parameter.',
    })
  }

  try {
    // Fetch Pokémon data
    const { data } = await api.get(`/${encodeURIComponent(name)}`)

    if (!data) {
      throw createError({
        statusCode: 404,
        message: `Pokémon "${name}" not found.`,
      })
    }

    return data
  } catch (error) {
    // If error is already an H3 error, rethrow it
    if (error?.statusCode) throw error

    console.error('Pokémon API fetch error:', error.message)

    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to fetch Pokémon "${name}": ${error.message || 'Unknown error'}`,
    })
  }
})
