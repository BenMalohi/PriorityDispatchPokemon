export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    home?: {
      front_default?: string | null;
      back_default?: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
}
