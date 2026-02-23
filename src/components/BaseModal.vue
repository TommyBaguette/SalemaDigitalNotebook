<template>
  <div class="modal-overlay">
    <div class="confirm-modal">
      <h3 class="confirm-title">{{ title }}</h3>
      <p class="confirm-text">{{ text }}</p>
      
      <div class="confirm-actions">
        <button @click="$emit('cancel')" class="btn-cancel">{{ cancelText }}</button>
        <button @click="$emit('confirm')" class="btn-action">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, required: true },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>

.modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  background: rgba(0, 0, 0, 0.85); 
  backdrop-filter: blur(8px);
  z-index: 100; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}

.confirm-modal {
  background: #0a1622;
  border: 1px solid rgba(76, 201, 240, 0.3);
  max-width: 350px;
  width: 90%;
  text-align: center;
  padding: 30px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(76, 201, 240, 0.05);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.confirm-title { 
  color: #4CC9F0; 
  margin-bottom: 15px; 
  font-size: 1.4rem; 
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 1px;
}

.confirm-text { 
  color: #ffffff; 
  margin-bottom: 25px; 
  font-size: 1.1rem; 
  line-height: 1.4;
}

.confirm-actions { 
  display: flex; 
  gap: 15px; 
  justify-content: center; 
}

.btn-cancel { 
  background: rgba(255, 255, 255, 0.05); 
  color: #ccc; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  padding: 12px 10px; 
  border-radius: 12px; 
  font-weight: bold; 
  cursor: pointer; 
  flex: 1; 
  transition: all 0.2s ease;
}

.btn-cancel:active { 
  background: rgba(255, 255, 255, 0.1); 
  transform: scale(0.95); 
}

.btn-action { 
  background: #4CC9F0; 
  color: #0a1622; 
  border: none; 
  padding: 12px 10px; 
  border-radius: 12px; 
  font-weight: 900; 
  cursor: pointer; 
  flex: 1; 
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
  transition: all 0.2s ease;
}

.btn-action:active { 
  transform: scale(0.95); 
  box-shadow: 0 2px 8px rgba(76, 201, 240, 0.2); 
}
</style>