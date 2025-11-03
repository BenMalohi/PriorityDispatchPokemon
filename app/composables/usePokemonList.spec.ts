import { describe, it, expect, beforeEach } from "vitest";
import { usePokemonList } from "@/composables/usePokemonList";

vi.mock("vue-router", () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("usePokemonList composable", () => {
  let composable: ReturnType<typeof usePokemonList>;

  beforeEach(() => {
    composable = usePokemonList(2);
  });

  it("loads pokemon data correctly", () => {
    expect(composable.totalCount.value).toBe(100);
    expect(composable.pokemonList.value.length).toBe(2);
    expect(composable.filteredPokemon.value.length).toBe(2);
  });

  it("filters pokemon by name", () => {
    composable.filterPokemon("pika");
    expect(composable.filteredPokemon.value).toHaveLength(1);
    expect(composable.filteredPokemon.value[0].name).toBe("pikachu");

    composable.filterPokemon("");
    expect(composable.filteredPokemon.value).toHaveLength(2);
  });

  it("handles pagination correctly", async () => {
    const { offset, nextPage, prevPage } = composable;

    expect(offset.value).toBe(0);
    await nextPage();
    expect(offset.value).toBe(2);
    await prevPage();
    expect(offset.value).toBe(0);
  });
});
