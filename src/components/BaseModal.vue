<template>
  <div class="modal-overlay">
    <div class="confirm-modal">
      <h3 class="confirm-title">{{ title }}</h3>
      <p class="confirm-text">{{ text }}</p>
      
      <div class="confirm-actions">
        <button @click="$emit('cancel')" class="btn-cancel">{{ cancelText }}</button>
        <button @click="$emit('confirm')" class="btn-danger">{{ confirmText }}</button>
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
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0,0,0,0.85); z-index: 100; 
  display: flex; justify-content: center; align-items: center; 
}

.confirm-modal {
  background: #2d2d2d;
  max-width: 350px;
  width: 90%;
  text-align: center;
  padding: 30px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  animation: popIn 0.2s ease-out;
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.confirm-title { color: #f39c12; margin-bottom: 10px; font-size: 1.5rem; }
.confirm-text { color: #ddd; margin-bottom: 25px; font-size: 1.1rem; }
.confirm-actions { display: flex; gap: 15px; justify-content: center; }

.btn-cancel { 
  background: #555; color: white; border: none; padding: 12px 20px; 
  border-radius: 12px; font-weight: bold; cursor: pointer; flex: 1; 
  transition: 0.2s;
}
.btn-cancel:hover { background: #666; }

.btn-danger { 
  background: #e74c3c; color: white; border: none; padding: 12px 20px; 
  border-radius: 12px; font-weight: bold; cursor: pointer; flex: 1; 
  transition: 0.2s;
}
.btn-danger:hover { background: #c0392b; }
</style>