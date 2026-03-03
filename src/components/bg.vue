<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const wrapper = ref(null)
let rafId = null

onMounted(() => {
  const el = wrapper.value
  if (!el) return

  const handleMove = (e) => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      const { innerWidth, innerHeight } = window
      const mx = (e.clientX / innerWidth - 0.5) * 2
      const my = (e.clientY / innerHeight - 0.5) * 2

      const rotX = my * -22
      const rotY = mx * 30
      const tx = mx * 60
      const ty = my * 45

      el.style.setProperty('--rx', `${rotX}deg`)
      el.style.setProperty('--ry', `${rotY}deg`)
      el.style.setProperty('--tx', `${tx}px`)
      el.style.setProperty('--ty', `${ty}px`)
    })
  }

  window.addEventListener('mousemove', handleMove, { passive: true })

  const handleLeave = () => {
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--tx', '0px')
    el.style.setProperty('--ty', '0px')
  }
  document.addEventListener('mouseleave', handleLeave)

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseleave', handleLeave)
    if (rafId) cancelAnimationFrame(rafId)
  })
})
</script>

<template>
  <div ref="wrapper" class="bg-hacker">
    <div class="crt-scanlines"></div>
    <div class="glitch-rgb"></div>
    <div class="glitch-flicker"></div>

    <svg class="matrix-bg" viewBox="0 0 480 800" preserveAspectRatio="xMidYMid slice">
      <!-- Grid terminal sutil -->
      <g class="grid" opacity="0.08">
        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f0" stroke-width="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#gridPattern)"/>
      </g>

      <!-- Matrix rain - colunas de caracteres -->
      <g class="rain" opacity="0.9">
        <text x="10%" y="0" class="stream fast">01 10 ネ ム ハ ッ ク 00 1 0 ギ ャ ッ ク</text>
        <text x="25%" y="0" class="stream med">101 010 シ ス テ ム 侵 入 1 0 0</text>
        <text x="40%" y="0" class="stream slow">EXECUTE /bin/hack --root 0110</text>
        <text x="55%" y="0" class="stream fast">BREACH DETECTED 404_ACCESS ネオン</text>
        <text x="70%" y="0" class="stream med">0xDEADBEEF ルート アクセス 10 01</text>
        <text x="85%" y="0" class="stream slow">firewall_down.exe RUNNING...</text>
      </g>

      <!-- Partículas flutuantes (estilo deep web / noise) -->
      <g class="particles">
        <circle cx="15%" cy="20%" r="1.2" fill="#0f3" class="particle slow"/>
        <circle cx="80%" cy="35%" r="1.8" fill="#0f5" class="particle med"/>
        <circle cx="30%" cy="70%" r="1" fill="#0f4" class="particle fast"/>
        <circle cx="65%" cy="85%" r="1.5" fill="#0f6" class="particle slow"/>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.bg-hacker {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: #000;
  perspective: 1300px;
  transform-style: preserve-3d;

  --rx: 0deg;
  --ry: 0deg;
  --tx: 0px;
  --ty: 0px;
}

.matrix-bg {
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  transform:
    translate3d(var(--tx), var(--ty), 0)
    rotateX(var(--rx))
    rotateY(var(--ry));
  transition: transform 0.18s ease-out;
  will-change: transform;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  fill: #0f0;
}

/* ─── MATRIX RAIN ANIMATION ─── */
.rain text {
  animation: fall linear infinite;
  white-space: pre;
}

.stream.fast  { animation-duration: 18s; }
.stream.med   { animation-duration: 28s; }
.stream.slow  { animation-duration: 45s; }

@keyframes fall {
  0%   { transform: translateY(-100%); opacity: 0.3; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(1200%); opacity: 0; }
}

/* ─── PARTICLES ─── */
.particle {
  animation: float linear infinite;
}
.particle.slow  { animation-duration: 60s; }
.particle.med   { animation-duration: 35s; }
.particle.fast  { animation-duration: 20s; }

@keyframes float {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(20px, -30px); }
  50%  { transform: translate(-15px, 40px); }
  75%  { transform: translate(25px, -20px); }
  100% { transform: translate(0, 0); }
}

/* ─── CRT SCANLINES ─── */
.crt-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    rgba(0,0,0,0.25) 1px,
    rgba(0,0,0,0.4) 2px,
    rgba(0,0,0,0.25) 3px,
    transparent 4px
  );
  pointer-events: none;
  mix-blend-mode: multiply;
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* ─── GLITCH RGB SPLIT + FLICKER ─── */
.glitch-rgb {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 20%,
    rgba(255,0,255,0.08) 45%,
    rgba(0,255,255,0.06) 55%,
    transparent 80%
  );
  animation: rgbShift 4s infinite steps(5);
  mix-blend-mode: screen;
  pointer-events: none;
}

.glitch-flicker {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  animation: flicker 6s infinite;
  pointer-events: none;
}

@keyframes rgbShift {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
}

@keyframes flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 0; }
  20%, 24%, 55% { opacity: 0.15; }
}
</style>
