<template>
  <div class="detail-container">
    <!-- Top Navigation -->
    <nav class="top-nav">
      <NuxtLink @click="goBack" class="home-link">← Back to Home</NuxtLink>
    </nav>

    <!-- Hero Section (unchanged) -->
    <section class="hero">
      <h1>{{ pokeName }}</h1>
      <div class="type-badges">
        <span v-for="t in pokemon?.types || []" :key="t.type.name" class="type-badge">
          {{ t.type.name.toUpperCase() }}
        </span>
      </div>
    </section>

    <!-- Loading / Error -->
    <section v-if="isLoading || isError" class="status-section">
      <div v-if="isLoading">
        <h2>Loading Pokémon...</h2>
        <p>Please wait a moment.</p>
      </div>
      <div v-else-if="isError">
        <h2>Failed to Load Pokémon</h2>
        <p>{{ errorMessage }}</p>
        <button @click="fetchPokemon" class="retry-btn">Retry</button>
      </div>
    </section>

    <!-- Pokémon Details -->
    <section v-else-if="pokemon" class="detail-grid">
      <!-- Pokémon Image -->
      <div class="img-card">
        <img
          v-if="currentSprite"
          class="poke-img"
          :class="{ loaded: imageLoaded }"
          :src="currentSprite"
          :alt="`${pokeName} thumbnail`"
          loading="lazy"
          @load="imageLoaded = true"
          @error="onImageError"
        />
        <p v-else>No image available</p>
      </div>

      <!-- Info + Stats -->
      <div class="info-card">
        <ul class="info-list">
          <li><strong>Name:</strong> {{ pokeName }}</li>
          <li><strong>Height:</strong> {{ pokemon.height ?? 'Unknown' }}</li>
          <li><strong>Weight:</strong> {{ pokemon.weight ?? 'Unknown' }}</li>
          <li><strong>Abilities:</strong> {{ getAbilities(pokemon.abilities) }}</li>
        </ul>

        <!-- Stats -->
        <div class="stats" v-if="pokemon.stats?.length">
          <h3>Stats</h3>
          <div class="stats-grid">
            <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-item">
              <span class="stat-name">{{ stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1) }}</span>
              <div class="bar">
                <div class="fill" :style="{ width: stat.base_stat + '%' }"></div>
              </div>
              <span class="stat-value">{{ stat.base_stat }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemon } from '~/composables/usePokemon'

const route = useRoute()
const router = useRouter()
const nameParam = route.params.name as string
const { pokemon, isLoading, isError, errorMessage, fetchPokemon } = await usePokemon(nameParam)
const imageLoaded = ref(false)
const pokeName = computed(() => nameParam.charAt(0).toUpperCase() + nameParam.slice(1))

function goBack() {
  if (window.history.length > 1) {
    router.back() // go back in history
  } else {
    router.push({ path: '/', query: { offset: route.query.offset || 0 } })
  }
}

function getAbilities(abilities = []) {
  return abilities
    .map(a => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1))
    .join(', ') || 'Unknown'
}

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/assets/poke_ball.png'
}

// ---------------- Sprite Toggle ----------------
const showingBack = ref(false)
const currentSprite = computed(() => {
  if (!pokemon.value) return null
  return showingBack.value && pokemon.value.sprites?.back_default
    ? pokemon.value.sprites.back_default
    : pokemon.value.sprites?.other?.home?.front_default || pokemon.value.sprites.front_default
})

function toggleSprite() {
  showingBack.value = !showingBack.value
}
</script>

<style scoped>
.detail-container {
  color: #1e293b;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #f9fafb;
  border-radius: 15px;
}

/* Top Navigation */
.top-nav {
  width: 100%;
  margin-bottom: 20px;
}
.home-link {
  text-decoration: none;
  font-weight: 600;
  color: #3b82f6;
  cursor: pointer;
}
.home-link:hover {
  color: #2563eb;
}

/* Hero */
.hero {
  max-width: 100%;
  margin: 0 auto 30px auto;
  border-radius: 12px;
  padding: 30px 20px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  text-align: center;
  color: white;
}
.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.type-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
.type-badge {
  padding: 5px 14px;
  border-radius: 9999px;
  background-color: rgba(255,255,255,0.2);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Loading / Error */
.status-section {
  text-align: center;
  padding: 60px 0;
}
/* Detail Grid */
.detail-grid {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; /* allows stacking on smaller screens */
  border: solid 2px #3b82f6;
  border-radius: 20px;
}


.img-card {
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 300px; 
  max-width: 380px;
  transition: transform 0.2s;
  position: relative; /* for the shadow */
}

/* Pokémon image shadow */
.poke-img {
  width: 280px;
  height: 280px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s ease-in;
}

.poke-img.loaded {
  opacity: 1;
}
/* Shadow underneath */
.img-card::after {
  content: '';
  position: absolute;
  bottom: 20px; /* slightly under the image */
  width: 340px; /* width of the shadow */
  height: 30px; /* thickness of shadow */
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 80%);
  border-radius: 50%;
  z-index: 0;
  filter: blur(6px); /* soft shadow edges */
}

/* Info Card */
.info-card {
  background-color: #bdd6e9ff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  flex: 1 1 400px; /* flexible width */
  max-width: 550px;
  display: flex;
  flex-direction: column;
}
.info-list {
  list-style: none;
  padding: 0;
  font-size: 18px;
  line-height: 38px;
}
.info-list li strong {
  color: #3b82f6;
}

/* Stats Bars */
.stats {
  margin-top: 10px;
}
.stats h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
}
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.stat-name {
  width: 100px;
  font-weight: 600;
  font-size: 1rem;
  color: #3b82f6;
}
.bar {
  background: #e5e7eb;
  height: 14px;
  border-radius: 8px;
  flex: 1;
  overflow: hidden;
}
.fill {
  background: #3b82f6;
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
}
.stat-value {
  width: 35px;
  font-size: 0.9rem;
  text-align: right;
}

@media (max-width: 900px) {
  .detail-grid {
    flex-direction: column;
    align-items: center;
  }
  .img-card,
  .info-card {
    max-width: 100%;
    flex: 1 1 100%;
  }
  .info-card{
    min-width:80%;
  }
}
</style>