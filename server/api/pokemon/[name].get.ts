import axios, { AxiosResponse } from "axios";
import { defineEventHandler, getRouterParam, createError, H3Event } from "h3";
import type { PokemonData } from "../../types/responses";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/pokemon",
  headers: { "Content-Type": "application/json" },
});

export default defineEventHandler(
  async (event: H3Event): Promise<PokemonData> => {
    const name = getRouterParam(event, "name");

    if (!name) {
      throw createError({
        statusCode: 400,
        message: "Missing Pokémon name parameter.",
      });
    }

    try {
      // Fetch Pokémon data
      const { data }: AxiosResponse<PokemonData> = await api.get(
        `/${encodeURIComponent(name)}`
      );

      if (!data) {
        throw createError({
          statusCode: 404,
          message: `Pokémon "${name}" not found.`,
        });
      }

      return data;
    } catch (error: any) {
      // If error is already an H3 error, rethrow it
      if (error?.statusCode) throw error;

      throw createError({
        statusCode: error.response?.status || 500,
        message: `Failed to fetch Pokémon "${name}": ${
          error.message || "Unknown error"
        }`,
      });
    }
  }
);
