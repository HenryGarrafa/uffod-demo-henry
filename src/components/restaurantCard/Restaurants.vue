<template>
  <div>
    <RestaurantCard
      v-for="restaurant in restaurants"
      :key="restaurant.id"
      :restaurantCard="restaurant"
      :favoriteList="favoriteList || []"
      @added-to-favorites="onAdded"
      @removed-from-favorites="onRemoved"
    />
  </div>
</template>

<script>
import RestaurantCard from './RestaurantCard.vue'
import { getFavoriteRestaurants, isAuthenticated } from '@/services/authService.js'

export default {
  name: 'Restaurants',
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
  },
  components: {
    RestaurantCard,
  },
  data() {
    return {
      favoriteList: [],
      selectedFavoriteListId: '',
    }
  },
  async created() {
    if (isAuthenticated()) {
      this.selectedFavoriteListId = localStorage.getItem('selectedFavoriteListId')
      this.favoriteList = await getFavoriteRestaurants(this.selectedFavoriteListId)
    }
  },
  methods: {
    async onAdded() {
      this.favoriteList = await getFavoriteRestaurants(this.selectedFavoriteListId)
    },
    async onRemoved() {
      this.favoriteList = await getFavoriteRestaurants(this.selectedFavoriteListId)
    },
  },
}
</script>
<style scoped>
div {
  display: grid;
  align-self: center;
  width: 95%;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 10px;
}
</style>
