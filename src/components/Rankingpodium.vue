<script setup>
import { computed, reactive } from 'vue';
import { photoUrl, formatScore } from '../utils/playerPhoto';

// `players` já vem ordenado (1º, 2º, 3º) e com o campo `score` calculado.
const props = defineProps({
  players: { type: Array, required: true }
});

const failed = reactive({});

// Ordem visual clássica: 2º | 1º | 3º
const slots = computed(() => {
  const cfg = [
    { idx: 1, pos: 2, cls: 'silver' },
    { idx: 0, pos: 1, cls: 'gold' },
    { idx: 2, pos: 3, cls: 'bronze' },
  ];
  return cfg
    .filter(c => props.players[c.idx])
    .map(c => ({ ...c, player: props.players[c.idx] }));
});
</script>

<template>
  <div class="podium" role="list" aria-label="Pódio do mês">
    <div
      v-for="s in slots"
      :key="s.player.nickname"
      class="podium-slot"
      :class="s.cls"
      role="listitem"
    >
      <div class="avatar-wrap">
        <span v-if="s.pos === 1" class="crown" aria-hidden="true">👑</span>
        <div class="avatar">
          <img
            v-if="!failed[s.player.nickname]"
            :src="photoUrl(s.player.nickname)"
            :alt="s.player.nickname"
            loading="lazy"
            decoding="async"
            width="80"
            height="80"
            @error="failed[s.player.nickname] = true"
          />
          <span v-else class="initial">{{ s.player.nickname.charAt(0).toUpperCase() }}</span>
        </div>
      </div>

      <span class="p-name" :title="s.player.nickname">{{ s.player.nickname }}</span>
      <span class="p-score">{{ formatScore(s.player.score) }}</span>

      <div class="block">
        <span class="medal">{{ s.medal }}</span>
        <span class="pos">{{ s.pos }}º</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  margin: 40px 0 24px;
  padding: 0 4px;
}

.podium-slot {
  flex: 1 1 0;
  max-width: 120px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: rise 0.5s ease both;
  --tone: #C0C8D0;
  --avatar: 60px;
  --block-h: 62px;
}
.podium-slot.gold   { --tone: var(--accent-gold, #FFD166); --avatar: 78px; --block-h: 92px; animation-delay: 0.15s; }
.podium-slot.silver { --tone: #C0C8D0; animation-delay: 0.05s; }
.podium-slot.bronze { --tone: #CD7F32; --block-h: 48px; animation-delay: 0.25s; }

.avatar-wrap { position: relative; margin-bottom: 8px; }

.crown {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.4rem;
  filter: drop-shadow(0 0 6px rgba(255, 209, 102, 0.6));
}

.avatar {
  width: var(--avatar);
  height: var(--avatar);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--tone);
  box-shadow: 0 0 16px color-mix(in srgb, var(--tone) 45%, transparent);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.initial {
  font-size: calc(var(--avatar) * 0.42);
  font-weight: 900;
  color: var(--tone);
}

.p-name {
  max-width: 100%;
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--text-main, #E0F7FA);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.p-score {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--primary-teal, #4CC9F0);
  margin-bottom: 8px;
}

.block {
  width: 100%;
  height: var(--block-h);
  border-radius: 10px 10px 0 0;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--tone) 35%, transparent),
    color-mix(in srgb, var(--tone) 8%, transparent));
  border: 1px solid color-mix(in srgb, var(--tone) 55%, transparent);
  border-bottom: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.medal { font-size: 1.4rem; line-height: 1; }
.pos { font-weight: 900; color: var(--tone); font-size: 0.9rem; }

@keyframes rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .podium-slot { animation: none; }
}
</style>