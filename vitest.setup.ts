import { ref, nextTick } from 'vue'

vi.stubGlobal('useFetch', () => {
  const data = ref(null)
  nextTick(() => {
    data.value = {
      count: 100,
      results: [
        { name: 'pikachu', sprites: { front_default: 'url' } },
        { name: 'bulbasaur', sprites: {} },
      ],
    }
  })
  return {
    data,
    error: ref(null),
    pending: ref(false),
    refresh: vi.fn(),
  }
})
