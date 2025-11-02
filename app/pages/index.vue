<template>
  <div class="landing-container">
    <section class="hero">
      <h1>Welcome to the Pokémon Directory</h1>
      <p>Explore, search, and discover your favorite Pokémon!</p>

      <div class="search">
        <input
          v-model="inputSearch"
          placeholder="Search for Pokémon..."
          @input="filterPokemon(inputSearch)"
          :disabled="isLoading || isError"
        />
      </div>
    </section>
    <div class="pagination-top" v-if="totalCount > limit">
        <span>
          Showing {{ offset + 1 }}–{{ Math.min(offset + limit, totalCount) }}
          of {{ totalCount }}
        </span>
      </div>
    <section v-if="isLoading || isError" class="status-section">
      <div v-if="isLoading">
        <h2>Loading Pokémon...</h2>
        <p>Please wait a moment.</p>
      </div>
      <div v-else-if="isError">
        <h2>Failed to Load Pokémon</h2>
        <p>{{ errorMessage }}</p>
        <button @click="fetchPokemonList" class="retry-btn">Retry</button>
      </div>
    </section>

    <section v-else class="poke-grid-section">
      <div v-if="filteredPokemon.length > 0" class="poke-grid">
        <div v-for="p in filteredPokemon" :key="p.name" class="grid-item">
          <PokeCard :pokemon="p" />
        </div>
      </div>

      <div v-else class="no-results">
        <h2>No Pokémon Found</h2>
        <p>Try searching for a different name</p>
      </div>
    </section>
      <div class="pagination" v-if="totalCount > limit">
        <div
          :disabled="offset <= 0"
          @click="prevPage"
          class="page-btn"
        >
          ← Previous
        </div>
        <span>
          Showing {{ offset + 1 }}–{{ Math.min(offset + limit, totalCount) }}
          of {{ totalCount }}
        </span>
        <div
          :disabled="offset + limit >= totalCount"
          @click="nextPage"
          class="page-btn"
        >
          Next →
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePokemonList } from '~/composables/usePokemonList'

const inputSearch = ref('')

const {
  filteredPokemon,
  isLoading,
  isError,
  errorMessage,
  filterPokemon,
  totalCount,
  offset,
  limit,
  nextPage,
  prevPage,
  refresh,
} = usePokemonList(60)
</script>

<style scoped>
.landing-container {
  color: #1e293b;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 12px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 24px;
}

.search {
  display: flex;
  justify-content: center;
}

.search input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 50px;
  border: none;
  outline: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

.search input:focus {
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.status-section {
  text-align: center;
  padding: 60px 0;
}

.retry-btn {
  margin-top: 12px;
  padding: 10px 20px;
  background: #f97316;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #ea580c;
}

.poke-grid-section {
  margin-bottom: 30px;
  background-color: white;
}

.poke-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;

}

.no-results {
  text-align: center;
  padding: 40px 0;
  font-size: 1.2rem;
  color: #475569;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
  font-weight: 500;
  color: #475569;
}

.pagination-top {
  display: flex;
  justify-content: right;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #475569;
}

.page-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.page-btn:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background-color: #2563eb;
}
</style>
