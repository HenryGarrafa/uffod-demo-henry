<template>
  <div class="restaurant-card">
    <router-link :to="'/restaurant/' + restaurantCard.id">
      <img
        :src="currentImage"
        alt="Restaurant image"
        @mouseenter="startImageRotation"
        @mouseleave="resetImage"
      />
    </router-link>
    <div class="restaurant-info">
      <h3>
        <router-link :to="'/restaurant/' + restaurantCard.id">
          {{ restaurantCard.name }}
        </router-link>
      </h3>
      <div class="restaurant-description">
        <h4>
          <strong>Genres:</strong>
          {{ restaurantCard.genres ? restaurantCard.genres.join(', ') : 'Unknown' }}
        </h4>
        <h4><strong>Price range:</strong> {{ formatPrice(restaurantCard.price_range) }}</h4>
        <h4>
          <strong>Location:</strong>
          {{ restaurantCard.address.replace(/,?\s*[A-Z]\d[A-Z] \d[A-Z]\d,?\s*\w+$/, '') }}
        </h4>
      </div>
      <div class="restaurant-symbols">
        <span class="stars" title="Restaurant Rating">
          {{ restaurantCard.rating.toFixed(1) }}
          <FontAwesomeIcon :icon="['fas', 'star']" class="star-icon" />
        </span>
        <button class="forks" title="Add a visit" @click="openModal">
          {{ this.totalVisits }}
          <FontAwesomeIcon :icon="['fas', 'utensils']" class="fork-icon" />
        </button>
        <button class="favorite-button" title="Add to Favorites" @click="toggleFavorite">
          <FontAwesomeIcon
            :icon="isFavorite ? ['fas', 'heart'] : ['far', 'heart']"
            class="heart-icon"
          />
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <RestaurantVisitForm
          :restaurantId="restaurantCard.id"
          :closeModal="closeModal"
          @review-added="updateVisitCount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import {
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
  getRestaurantById,
  getVisitsByRestaurantId,
  isAuthenticated,
} from '@/services/authService.js'
import RestaurantVisitForm from '@/components/reviews/RestaurantVisitForm.vue'

library.add(fas, far)

export default {
  name: 'RestaurantCard',
  components: {
    RestaurantVisitForm,
    FontAwesomeIcon,
  },
  props: {
    restaurantCard: {
      type: Object,
      required: true,
    },
    favoriteList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      restaurant: this.restaurantCard.name ? null : this.restaurantCard,
      currentImageIndex: 0,
      imageInterval: null,
      selectedFavoriteListId: null,
      totalVisits: 0,
      showModal: false,
    }
  },
  async created() {
    if (isAuthenticated()) {
      this.selectedFavoriteListId = localStorage.getItem('selectedFavoriteListId')
      this.totalVisits = await this.getTotalVisitsByRestaurantId()
    }

    if (!this.restaurant) {
      await this.fetchRestaurantDetails()
    }
  },
  computed: {
    currentImage() {
      return this.restaurantCard.pictures?.[this.currentImageIndex]
    },
    isFavorite() {
      return this.favoriteList.some((fav) => fav.id === this.restaurantCard.id)
    },
  },
  methods: {
    async fetchRestaurantDetails() {
      try {
        this.restaurant = await getRestaurantById(this.restaurantCard.id)
      } catch (error) {
        console.error(`Error fetching restaurant ${this.restaurantCard.id}:`, error)
      }
    },
    formatPrice(price) {
      return price === 1
        ? 'Very low'
        : price === 2
          ? 'Low'
          : price === 3
            ? 'Medium'
            : price === 4
              ? 'High'
              : price === 5
                ? 'Very high'
                : 'Unknown'
    },
    startImageRotation() {
      if (this.restaurantCard.pictures.length > 1) {
        this.imageInterval = setInterval(() => {
          this.currentImageIndex =
            (this.currentImageIndex + 1) % this.restaurantCard.pictures.length
        }, 2000)
      }
    },
    resetImage() {
      clearInterval(this.imageInterval)
      this.currentImageIndex = 0
    },
    async toggleFavorite() {
      if (isAuthenticated()) {
        if (!this.selectedFavoriteListId) {
          alert('Please select a favorite list first.')
          return
        }

        if (this.isFavorite) {
          const success = await removeFavoriteRestaurant(
            this.selectedFavoriteListId,
            this.restaurantCard.id,
          )
          if (success) {
            this.$emit('removed-from-favorites', this.restaurantCard.id)
          }
        } else {
          const success = await addFavoriteRestaurant(
            this.selectedFavoriteListId,
            this.restaurantCard.id,
          )
          if (success) {
            this.$emit('added-to-favorites', this.restaurantCard.id)
          }
        }
      } else {
        this.$router.push('/login')
      }
    },
    async updateVisitCount() {
      this.totalVisits = await this.getTotalVisitsByRestaurantId()
    },
    async getTotalVisitsByRestaurantId() {
      const data = await getVisitsByRestaurantId(this.restaurantCard.id)
      return data.total
    },
    openModal() {
      if (isAuthenticated()) {
        this.showModal = true
      } else {
        this.$router.push('/login')
      }
    },
    closeModal() {
      this.showModal = false
    },
  },
  beforeUnmount() {
    clearInterval(this.imageInterval)
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 20%;
  width: 400px;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 10000;
}

.restaurant-card {
  max-width: 365px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  padding: 0;
  border-radius: 8px;
  background-color: #fff;
  gap: 0;
}

.restaurant-card img:hover,
.restaurant-card h3:hover {
  cursor: pointer;
}

.restaurant-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.restaurant-info {
  padding: 0 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.restaurant-description {
  border-top: rgba(170, 170, 170, 0.4) solid 1px;
  border-bottom: rgba(170, 170, 170, 0.4) solid 1px;
  display: block;
  margin: 10px 15px;
  padding: 10px;
}

.restaurant-info h3 {
  justify-self: flex-start;
  font-weight: bold;
  margin: 0;
  font-size: 28px;
}

.restaurant-info h3 a {
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
}

.restaurant-info h3 a:hover {
  color: #7aaa95;
}

.restaurant-info h4 {
  margin: 0;
  font-size: 13px;
  padding: 3px;
  font-weight: normal;
}

.restaurant-info p {
  margin-left: 5px;
  margin-top: 1px;
  font-size: 13px;
}
.restaurant-symbols {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.favorite-button,
.forks {
  background: none;
  border: none;
  cursor: pointer;
}

.favorite-button {
  color: #ff4d4d;
}

.forks,
.stars {
  font-size: 17px;
}

.heart-icon,
.fork-icon {
  transition: transform 0.2s ease-in-out;
  font-size: 20px;
}

.fork-icon {
  color: #128782;
}

.star-icon {
  color: #d6b800;
}

.favorite-button:hover .heart-icon,
.forks:hover .fork-icon {
  transform: scale(1.2);
}

@media screen and (max-width: 800px) {
  .restaurant-card {
    max-width: none;
    width: 95%;
    justify-self: center;
  }
}
</style>
