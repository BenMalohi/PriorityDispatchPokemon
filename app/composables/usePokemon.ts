import { ref } from "vue";
import type { Pokemon } from "~/types/pokemon";

export const usePokemon = async (name: string) => {
  const pokemon = ref<Pokemon | null>(null);
  const isLoading = ref<boolean>(true);
  const isError = ref<boolean>(false);
  const errorMessage = ref<string>("");

  const fetchPokemon = async () => {
    try {
      isLoading.value = true;
      isError.value = false;
      errorMessage.value = "";

      const { data, error } = await useFetch<Pokemon>(`/api/pokemon/${name}`);

      if (error.value)
        throw new Error(error.value.message || "Failed to fetch Pokémon.");
      if (!data.value) throw new Error("No data returned from API.");

      pokemon.value = data.value;
    } catch (err) {
      const e = err as Error;
      isError.value = true;
      errorMessage.value = e.message;
      console.error("Fetch error:", e);
    } finally {
      isLoading.value = false;
    }
  };

  await fetchPokemon();

  return { pokemon, isLoading, isError, errorMessage, fetchPokemon };
};
