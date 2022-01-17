<template>
    <div class="valva-transition">
    <slot :relay="relay"></slot>
</div>
</template>
<script>
import { vShow, vHide } from '../modules/transitions.js'
export default {
  name: 'ValvaShow',
  data(){
      return {
          vtype: 'ease'
      }
  },
 mounted () {
      if(['fade', 'slide'].includes(this.type)){
          this.vtype = this.type
      }
    if (!this.show) {
      vHide(this.$el, this.vtype, 0)
    }
  },
  watch: {
    show: function (newVal) {
      if (newVal === true) {
        vShow(this.$el, this.vtype, this.duration, this.callback, this.timing)
      } else {
        vHide(this.$el, this.vtype, this.duration, this.callback, this.timing)
      }
    }
  },
  props: {
      show: Boolean,
       relay: null,
    type: {
      type: String,
      default: 'ease'
    },
    callback: {
      type: [Function, null],
      default: null
    },
    duration: {
      type: Number,
      default: 300
    },
    timing: {
         type: String,
      default: 'ease-in-out'
    }
  }
}
</script>