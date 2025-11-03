import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref } from "vue";
import { usePokemon } from "@/composables/usePokemon";

describe("usePokemon composable", () => {
  let composable: Awaited<ReturnType<typeof usePokemon>>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.error and silence it
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  it("loads pokemon data correctly", async () => {
    // Stub useFetch to return data immediately
    vi.stubGlobal("useFetch", () => ({
      data: ref({ name: "pikachu", sprites: { front_default: "url" } }),
      error: ref(null),
      pending: ref(false),
      refresh: vi.fn(),
    }));

    composable = await usePokemon("pikachu");

    expect(composable.isLoading.value).toBe(false);
    expect(composable.isError.value).toBe(false);
    expect(composable.errorMessage.value).toBe("");
    expect(composable.pokemon.value?.name).toBe("pikachu");
    expect(composable.pokemon.value?.sprites.front_default).toBe("url");
  });

  it("handles API error correctly", async () => {
    vi.stubGlobal("useFetch", () => ({
      data: ref(null),
      error: ref({ message: "API failed" }),
      pending: ref(false),
      refresh: vi.fn(),
    }));

    composable = await usePokemon("pikachu");

    expect(composable.isLoading.value).toBe(false);
    expect(composable.isError.value).toBe(true);
    expect(composable.errorMessage.value).toBe("API failed");
    expect(composable.pokemon.value).toBeNull();
  });

  it("handles no data returned from API", async () => {
    vi.stubGlobal("useFetch", () => ({
      data: ref(null),
      error: ref(null),
      pending: ref(false),
      refresh: vi.fn(),
    }));

    composable = await usePokemon("pikachu");

    expect(composable.isLoading.value).toBe(false);
    expect(composable.isError.value).toBe(true);
    expect(composable.errorMessage.value).toBe("No data returned from API.");
    expect(composable.pokemon.value).toBeNull();
  });

  it("allows refetching via fetchPokemon", async () => {
    // First stub returns initial data
    vi.stubGlobal("useFetch", () => ({
      data: ref({ name: "pikachu", sprites: { front_default: "url" } }),
      error: ref(null),
      pending: ref(false),
      refresh: vi.fn(),
    }));

    composable = await usePokemon("pikachu");
    const { fetchPokemon, pokemon, isError, isLoading } = composable;

    // Now stub useFetch for refetch
    vi.stubGlobal("useFetch", () => ({
      data: ref({ name: "bulbasaur", sprites: {} }),
      error: ref(null),
      pending: ref(false),
      refresh: vi.fn(),
    }));

    await fetchPokemon();

    expect(isLoading.value).toBe(false);
    expect(isError.value).toBe(false);
    expect(pokemon.value?.name).toBe("bulbasaur");
  });
});
