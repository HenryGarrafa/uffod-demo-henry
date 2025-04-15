<template>
  <div>
    <UserCard
      v-for="user in users"
      :key="user.id"
      :userCard="user"
      :followList="followList || []"
      :followerList="followerList || []"
      @follow="onFollow()"
    />
  </div>
</template>

<script>
import UserCard from '@/components/users/UserCard.vue'
import { getUserInfo } from '@/services/authService'

export default {
  name: 'Users',
  components: {
    UserCard,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      followList: [],
      followerList: [],
    }
  },
  async created() {
    await this.fetchFollowList()
  },
  methods: {
    async fetchFollowList() {
      const data = await getUserInfo()
      this.followList = data.following
      this.followerList = data.followers
    },
    async onFollow() {
      await this.fetchFollowList()
    },
  },
}
</script>

<style scoped>
div {
  display: grid;
  align-self: center;
  width: 95%;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}
</style>
