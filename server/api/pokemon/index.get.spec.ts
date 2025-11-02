import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Hoist mocks to avoid ESM binding issues
const { mockedGetQuery } = vi.hoisted(() => ({ mockedGetQuery: vi.fn() }))
const { mockAxiosGet } = vi.hoisted(() => ({ mockAxiosGet: vi.fn() }))

// Mock 'h3' and replace getQuery with hoisted mock
vi.mock('h3', async () => {
  const actual: any = await vi.importActual('h3')
  return { ...actual, getQuery: mockedGetQuery }
})

// Mock axios.create to return an object with a get function
vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: mockAxiosGet
    })
  }
}))

// Import the handler **after** mocks are set up
import handler from './index.get'

describe('index.get API handler', () => {
  let consoleErrorMock: any

  beforeEach(() => {
    mockedGetQuery.mockReset()
    mockAxiosGet.mockReset()

    // Silence console.error during tests
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorMock.mockRestore()
  })

  it('returns full data correctly', async () => {
    mockedGetQuery.mockReturnValue({ limit: '2', offset: '0' })

    mockAxiosGet
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            count: 2,
            results: [{ name: 'pikachu' }, { name: 'bulbasaur' }]
          }
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { name: 'pikachu', sprites: { front_default: 'url' } } })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { name: 'bulbasaur', sprites: { front_default: 'url2' } } })
      )

    const event = {} as any
    const response = await handler(event)

    expect(response.count).toBe(2)
    expect(response.results).toHaveLength(2)
    expect(response.results[0].name).toBe('pikachu')
    expect(response.results[1].name).toBe('bulbasaur')
  })

  it('applies limit and offset correctly', async () => {
    mockedGetQuery.mockReturnValue({ limit: '1', offset: '1' })

    mockAxiosGet
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            count: 5,
            results: [{ name: 'charmander' }]
          }
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ data: { name: 'charmander', sprites: { front_default: 'url3' } } })
      )

    const event = {} as any
    const response = await handler(event)

    expect(response.count).toBe(5)
    expect(response.results).toHaveLength(1)
    expect(response.results[0].name).toBe('charmander')
  })

  it('returns error response when API fails', async () => {
    mockedGetQuery.mockReturnValue({ limit: '2', offset: '0' })

    mockAxiosGet.mockRejectedValue(new Error('API failed'))

    const event = {} as any
    const response = await handler(event)

    expect(response.error).toBe(true)
    expect(response.data).toEqual([])
    expect(response.message).toBe('API failed')
  })
})
