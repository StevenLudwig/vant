<template>
  <transition :name="currentTransition">
    <div v-show="value" class="van-popup" :class="{ [`van-popup--${position}`]: position }">
      <slot />
    </div>
  </transition>
</template>

<script>
import { create } from '../utils';
import Popup from '../mixins/popup';

export default create({
  name: 'van-popup',

  mixins: [Popup],

  props: {
    transition: String,
    overlay: {
      type: Boolean,
      default: true
    },
    lockOnScroll: {
      type: Boolean,
      default: false
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: ''
    }
  },

  data() {
    const transition = this.transition || (this.position === '' ? 'van-fade' : `popup-slide-${this.position}`);
    return {
      currentValue: false,
      currentTransition: transition
    };
  },

  mounted() {
    if (this.value) {
      this.open();
    }
  }
});
</script>
