<template>
  <div class="map-container">
    <GoogleMap
      api-key="AIzaSyBXfdKTdtGNF4ulD3KiYUXDrbmK1zVharw"
      mapId="restaurantMap"
      :center="{
        lat: coordinates[1],
        lng: coordinates[0],
      }"
      :zoom="16"
      style="height: 100%; width: 100%"
      class="map"
    >
      <AdvancedMarker
        :options="{
          position: {
            lat: coordinates[1],
            lng: coordinates[0],
          },
        }"
        :pin-options="{ background: '#63a0ea', glyphColor: '#1960ac', borderColor: '#1960ac' }"
        @click="goToGoogleMaps"
      />
    </GoogleMap>
  </div>
</template>

<script>
import { GoogleMap, AdvancedMarker } from 'vue3-google-map'

export default {
  components: { AdvancedMarker, GoogleMap },
  props: {
    coordinates: {
      type: Array,
      required: true,
    },
  },
  methods: {
    goToGoogleMaps() {
      const lat = this.coordinates[1]
      const lng = this.coordinates[0]
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      window.open(url, '_blank')
    },
  },
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border: none;
}

@media (max-width: 900px) {
  .map-container {
    width: 100%;
    height: 300px;
  }
}
</style>
