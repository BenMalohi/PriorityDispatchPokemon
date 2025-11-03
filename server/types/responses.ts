export interface PokemonListResponse {
  count: number;
  results: { name: string; url: string }[];
}

export interface PokemonData {
  [key: string]: any;
}

export interface ErrorResponse {
  error: boolean;
  message: string;
  data: PokemonData[];
}
