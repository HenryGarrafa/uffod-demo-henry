<template>
  <div class="user-card">
    <div class="user-info">
      <button
        class="user-icon-container"
        title="Follow user"
        :style="{
          color: isFollowed ? 'green' : 'gray',
          backgroundColor: isFollowed ? '#97e6e3' : '#ededed',
        }"
        @click="toggleFollow"
      >
        <FontAwesomeIcon
          :icon="isFollowed ? ['fas', 'user-minus'] : ['fas', 'user-plus']"
          class="user-icon"
        />
      </button>
      <h3>
        <router-link class="username-container" :to="`/user/${userCard.id}`">
          <div v-if="userCard.name && userCard.name.trim() !== ''">
            {{ userCard.name }}
          </div>
          <p v-else>No user name</p>
        </router-link>
      </h3>

      <div class="user-description">
        <h4><strong>Rating:</strong> {{ userCard.rating }}</h4>
      </div>

      <div class="user-symbols">
        <FontAwesomeIcon
          :icon="['fas', 'users']"
          :style="{ color: isFollowing ? 'rgba(0,0,0, 1)' : 'rgba(0,0,0,0.2)' }"
          class="following-icon"
          title="Is following you"
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
import { isAuthenticated, followUser, unfollowUser } from '@/services/authService'

library.add(fas, far)

export default {
  name: 'UserCard',
  components: { FontAwesomeIcon },
  props: {
    userCard: {
      type: Object,
      required: true,
    },
    followList: {
      type: Array,
      required: true,
    },
    followerList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      userId: this.userCard.id,
      userName: this.userCard.name || 'No user name',
      userVisits: [],
    }
  },
  computed: {
    isFollowed() {
      return this.followList.some((follow) => follow.id === this.userId)
    },
    isFollowing() {
      return this.followerList.some((follower) => follower.id === this.userId)
    },
  },
  methods: {
    async toggleFollow() {
      if (isAuthenticated()) {
        if (this.isFollowed) {
          const success = await unfollowUser(this.userId)
          if (success) {
            this.$emit('follow', this.userId)
          }
        } else {
          const success = await followUser(this.userId)
          if (success) {
            this.$emit('follow', this.userId)
          }
        }
      } else {
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style scoped>
.user-icon-container {
  margin-top: 10px;
  margin-bottom: 10px;
  align-self: center;
  background-color: #ededed;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: transform 0.2s ease-in-out;
  border: none;
}

.user-icon-container:hover {
  cursor: pointer;
  transform: scale(1.2);
  background-color: #609fed;
}

.user-icon {
  color: #000000;
  font-size: 20px;
  margin-left: 4px;
}

.following-icon {
  color: #000000;
  font-size: 13px;
}

.user-symbols {
  height: 20px;
}

.user-card {
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

.user-card img:hover,
.user-card h3:hover {
  cursor: pointer;
}

.user-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.user-info {
  padding: 0 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-description {
  border-top: rgba(170, 170, 170, 0.4) solid 1px;
  border-bottom: rgba(170, 170, 170, 0.4) solid 1px;
  display: block;
  margin: 10px 15px;
  padding: 10px;
}

.user-info h3 {
  justify-self: flex-start;
  font-weight: bold;
  margin: 0;
  font-size: 28px;
}

.user-info h3 a {
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
}

.user-info h3 a:hover {
  color: #7aaa95;
}

.user-info h4 {
  margin: 0;
  font-size: 13px;
  padding: 3px;
  font-weight: normal;
}

.user-info p {
  margin-left: 5px;
  margin-top: 1px;
  font-size: 13px;
}

@media screen and (max-width: 800px) {
  .user-card {
    max-width: none;
    width: 95%;
    justify-self: center;
  }
}
</style>
