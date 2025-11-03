import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Hoist mocks to avoid ESM binding issues
const { mockedGetRouterParam } = vi.hoisted(() => ({
  mockedGetRouterParam: vi.fn(),
}));
const { mockAxiosGet } = vi.hoisted(() => ({ mockAxiosGet: vi.fn() }));

// Mock 'h3' and replace getRouterParam with hoisted mock
vi.mock("h3", async () => {
  const actual: any = await vi.importActual("h3");
  return { ...actual, getRouterParam: mockedGetRouterParam };
});

// Mock axios.create to return an object with a get function
vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: mockAxiosGet,
    }),
  },
}));

// Import the handler **after** mocks are set up
import handler from "./[name].get";

describe("[name].get API handler", () => {
  let consoleErrorMock: any;

  beforeEach(() => {
    mockedGetRouterParam.mockReset();
    mockAxiosGet.mockReset();

    // Silence console.error during tests
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  it("returns Pokémon data correctly", async () => {
    const pokemonName = "pikachu";
    mockedGetRouterParam.mockReturnValue(pokemonName);

    mockAxiosGet.mockResolvedValueOnce({
      data: { name: "pikachu", sprites: { front_default: "url" } },
    });

    const event = {} as any;
    const response = await handler(event);

    expect(response.name).toBe("pikachu");
    expect(response.sprites.front_default).toBe("url");
  });

  it("throws 400 error when name param is missing", async () => {
    mockedGetRouterParam.mockReturnValue(undefined);

    const event = {} as any;

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 400,
      message: "Missing Pokémon name parameter.",
    });
  });

  it("throws 404 error when API returns no data", async () => {
    const pokemonName = "missingno";
    mockedGetRouterParam.mockReturnValue(pokemonName);

    mockAxiosGet.mockResolvedValueOnce({ data: null });

    const event = {} as any;

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 404,
      message: `Pokémon "${pokemonName}" not found.`,
    });
  });

  it("throws 500 error when API fails", async () => {
    const pokemonName = "pikachu";
    mockedGetRouterParam.mockReturnValue(pokemonName);

    mockAxiosGet.mockRejectedValueOnce(new Error("API failed"));

    const event = {} as any;

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 500,
      message: `Failed to fetch Pokémon "${pokemonName}": API failed`,
    });
  });
});
