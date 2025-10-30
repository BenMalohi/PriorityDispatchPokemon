<template>
  <NuxtLink
    class="link"
    :to="`/${pokemon.name}`"
    aria-label="View Pokémon details"
  >
    <div class="card">
      <div class="card-header">
        <h3>{{ capitalizedName }}</h3>
      </div>
      <div class="img-wrapper">
        <img
          class="thumb"
          :src="pokemon.thumb || fallbackImage"
          :alt="`${capitalizedName} thumbnail`"
          @error="handleImageError"
        />
      </div>
      <div class="card-footer">
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import type { Pokemon } from '~/types/pokemon'

// ---------- Props ----------
const props = defineProps({
  pokemon: {
    type: Object as PropType<Pokemon>,
    required: true,
  },
})

// ---------- Fallback Image ----------
const fallbackImage = '/images/fallback-pokemon.png'

// ---------- Computed ----------
const capitalizedName = computed(() => {
  const name = props.pokemon.name || ''
  return name.charAt(0).toUpperCase() + name.slice(1)
})

// ---------- Image Error Handler ----------
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = fallbackImage
}
</script>

<style scoped>
.link {
  text-decoration: none;
  display: block;
}

.card {
  width: 100%;
  max-width: 220px;
  background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
  border-radius: 15px;
  border: 2px solid #3b82f6;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.card-header {
  width: 100%;
  background-color: #3b82f6;
  text-align: center;
  padding: 8px 0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.img-wrapper {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  background-color: gr;
}

.thumb {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.card-footer {
  width: 100%;
  text-align: center;
  padding: 6px 0;
  background-color: #e3f2fd;
  font-weight: bold;
  font-size: 14px;
  color: #1e40af;
}
</style>
