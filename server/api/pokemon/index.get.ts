import axios, { AxiosResponse } from "axios";
import { defineEventHandler, getQuery } from "h3"; // need to explicitly import for mock tests to work
import type {
  PokemonData,
  PokemonListResponse,
  ErrorResponse,
} from "../../types/responses";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/pokemon",
  headers: { "Content-Type": "application/json" },
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = Number(query.limit) || 60;
    const offset = Number(query.offset) || 0;

    // Fetch paginated list of Pokémon names
    const listResponse: AxiosResponse<PokemonListResponse> = await api.get("", {
      params: { limit, offset },
    });
    const names = listResponse.data.results.map((p) => p.name);

    // Fetch detailed data for each Pokémon
    const promises: Promise<PokemonData>[] = names.map(async (name) => {
      const res: AxiosResponse<PokemonData> = await api.get(`/${name}`);
      return res.data;
    });
    const fullData: PokemonData[] = await Promise.all(promises);

    // Return full data + total count
    return {
      count: listResponse.data.count, // total available Pokémon
      results: fullData,
    };
  } catch (error: any) {
    const response: ErrorResponse = {
      error: true,
      message: error.message || "Failed to fetch Pokémon list",
      data: [],
    };
    return response;
  }
});
