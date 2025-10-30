import { GenerationI, GenerationIi, GenerationIii, GenerationIv, GenerationV, Home, GenerationVii, GenerationViii } from './pokedex'

export interface Versions {
    'generation-i': GenerationI;
    'generation-ii': GenerationIi;
    'generation-iii': GenerationIii;
    'generation-iv': GenerationIv;
    'generation-v': GenerationV;
    'generation-vi': { [key: string]: Home };
    'generation-vii': GenerationVii;
    'generation-viii': GenerationViii;
}
