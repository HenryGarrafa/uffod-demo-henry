<template>
  <div class="review-card">
    <router-link :to="'/restaurant/' + restaurant.id">
      <img
        :src="currentImage"
        alt="Restaurant image"
        @mouseenter="startImageRotation"
        @mouseleave="resetImage"
      />
    </router-link>
    <div class="review-info">
      <h3>
        <router-link :to="'/restaurant/' + restaurant.id">
          {{ restaurant.name }}
        </router-link>
      </h3>
      <div class="review-description">
        <h4>My comment:</h4>
        <p>{{ review.comment }}</p>
        <h4>
          My review: {{ review.rating.toFixed(1) }}
          <FontAwesomeIcon :icon="['fas', 'star']" class="star-icon" />
        </h4>
        <h4>
          Visit Date:
          <span class="review-date">{{ formatDate(review.date) }}</span>
        </h4>
      </div>

      <div class="review-symbols">
        <span class="stars" title="Restaurant rating">
          {{ restaurant.rating.toFixed(1) }}
          <FontAwesomeIcon :icon="['fas', 'star']" class="star-icon" />
        </span>
        <button class="forks" title="Add a visit" @click="showModal = true">
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
          :restaurantId="restaurant.id"
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
  getVisitsByRestaurantId,
  isAuthenticated,
} from '@/services/authService.js'
import RestaurantVisitForm from '@/components/reviews/RestaurantVisitForm.vue'

library.add(fas, far)

export default {
  name: 'ReviewCard',
  components: {
    FontAwesomeIcon,
    RestaurantVisitForm,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
    restaurant: {
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
      currentImageIndex: 0,
      imageInterval: null,
      selectedFavoriteListId: localStorage.getItem('selectedFavoriteListId'),
      totalVisits: 0,
      showModal: false,
    }
  },
  async created() {
    if (isAuthenticated()) {
      this.totalVisits = await this.getTotalVisitsByRestaurantId()
    }
  },
  computed: {
    currentImage() {
      return this.restaurant.pictures?.[this.currentImageIndex]
    },
    isFavorite() {
      return this.favoriteList.some((fav) => fav.id === this.restaurant.id)
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    startImageRotation() {
      if (this.restaurant.pictures.length > 1) {
        this.imageInterval = setInterval(() => {
          this.currentImageIndex = (this.currentImageIndex + 1) % this.restaurant.pictures.length
        }, 2000)
      }
    },
    resetImage() {
      clearInterval(this.imageInterval)
      this.currentImageIndex = 0
    },
    async toggleFavorite() {
      if (!this.selectedFavoriteListId) {
        alert('Please select a favorite list first.')
        return
      }

      if (this.isFavorite) {
        const success = await removeFavoriteRestaurant(
          this.selectedFavoriteListId,
          this.restaurant.id,
        )
        if (success) {
          this.$emit('removed-from-favorites', this.restaurant.id)
        }
      } else {
        const success = await addFavoriteRestaurant(this.selectedFavoriteListId, this.restaurant.id)
        if (success) {
          this.$emit('added-to-favorites', this.restaurant.id)
        }
      }
    },
    async updateVisitCount() {
      this.totalVisits = await this.getTotalVisitsByRestaurantId()
    },
    async getTotalVisitsByRestaurantId() {
      const data = await getVisitsByRestaurantId(this.restaurant.id)
      return data.total
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
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
}

.review-card {
  max-width: 365px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  padding: 0;
  border-radius: 8px;
  background-color: #fff;
  display: block;
}

.review-card img:hover,
.review-card h3:hover {
  cursor: pointer;
}

.review-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.review-info {
  padding: 0 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.review-info h3 {
  justify-self: flex-start;
  font-weight: bold;
  margin: 0 0 10px 0;
  font-size: 28px;
}

.review-info h3 a {
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
}

.review-info h3 a:hover {
  color: #7aaa95;
}

.review-info h4 {
  margin: 0;
  font-size: 13px;
  padding: 3px;
}

.review-info p {
  margin-left: 5px;
  margin-top: 1px;
  font-size: 13px;
}

.review-symbols {
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

.review-description {
  border-top: rgba(170, 170, 170, 0.4) solid 1px;
  border-bottom: rgba(170, 170, 170, 0.4) solid 1px;
  display: block;
  margin: 10px 15px;
  padding: 10px;
}

.review-date {
  font-size: 12px;
  color: #888;
}

@media screen and (max-width: 800px) {
  .review-card {
    max-width: none;
    width: 95%;
    justify-self: center;
  }
}
</style>
