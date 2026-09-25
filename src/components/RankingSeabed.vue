<script setup>
import { computed, reactive } from 'vue';
import { photoUrl, formatScore } from '../utils/playerPhoto';

// `players` vem do pior para o menos mau: [0] = último, [1] = penúltimo, [2] = antepenúltimo.
// Cada jogador traz `score` e `rank` (posição no ranking geral).
const props = defineProps({
  players: { type: Array, required: true }
});

const failed = reactive({});

// Espelho do pódio: penúltimo | ÚLTIMO (bloco mais comprido = mais fundo) | antepenúltimo
const slots = computed(() => {
  const cfg = [
    { idx: 1, worst: false, h: 62 },
    { idx: 0, worst: true,  h: 92 },
    { idx: 2, worst: false, h: 48 },
  ];
  return cfg
    .filter(c => props.players[c.idx])
    .map(c => ({
      ...c,
      player: props.players[c.idx],
      label: c.worst ? 'Areia' : 'Camarão',
    }));
});
</script>

<template>
  <section class="abyss" aria-label="Fundo do mar: os três últimos classificados">
    <header class="head">
      <h4>Fundo do Mar</h4>
    </header>

    <div class="depth" role="list">
      <div
        v-for="s in slots"
        :key="s.player.nickname"
        class="slot"
        :class="{ worst: s.worst }"
        :style="{ '--block-h': s.h + 'px' }"
        role="listitem"
      >
        <div class="block">
          <span class="rank">{{ s.player.rank }}º</span>
          <span class="label">{{ s.label }}</span>
        </div>

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

        <span class="p-name" :title="s.player.nickname">{{ s.player.nickname }}</span>
        <span class="p-score">{{ formatScore(s.player.score) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.abyss {
  margin-top: 28px;
  padding: 16px 8px 18px;
  border-radius: 16px;
  border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.1));
  /* só uma sugestão de profundidade: escurece de cima para baixo */
  background: linear-gradient(180deg, rgba(76, 201, 240, 0.05) 0%, rgba(2, 16, 25, 0.4) 100%);
  text-align: center;
}

.head { margin-bottom: 14px; }
.head h4 {
  margin: 0;
  color: var(--primary-teal, #4CC9F0);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 800;
  font-size: 0.95rem;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.3);
}
.head p { margin: 3px 0 0; color: var(--text-muted, #8FA6B5); font-size: 0.75rem; }

.depth {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  padding: 0 4px;
  border-top: 1px solid rgba(76, 201, 240, 0.22); /* linha de onde os blocos "pendem" */
}

.slot {
  flex: 1 1 0;
  min-width: 0;
  max-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: sink 0.5s ease both;
  --tone: #8FA6B5;
  --avatar: 60px;
}
.slot.worst { --tone: var(--danger-coral, #EF476F); --avatar: 78px; animation-delay: 0.15s; }

/* bloco pendurado: espelho dos blocos do pódio */
.block {
  width: 100%;
  height: var(--block-h);
  border-radius: 0 0 10px 10px;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--tone) 8%, transparent),
    color-mix(in srgb, var(--tone) 32%, transparent));
  border: 1px solid color-mix(in srgb, var(--tone) 50%, transparent);
  border-top: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-bottom: 12px;
}
.rank  { font-weight: 900; font-size: 0.95rem; color: var(--tone); line-height: 1; }
.label { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted, #8FA6B5); }

.avatar {
  width: var(--avatar);
  height: var(--avatar);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--tone);
  box-shadow: 0 0 16px color-mix(in srgb, var(--tone) 40%, transparent);
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.initial { font-size: calc(var(--avatar) * 0.42); font-weight: 900; color: var(--tone); }

.p-name {
  max-width: 100%;
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--text-main, #E0F7FA);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.p-score { font-size: 0.8rem; font-weight: bold; color: var(--text-muted, #8FA6B5); }

@keyframes sink {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .slot { animation: none; }
}
</style>
