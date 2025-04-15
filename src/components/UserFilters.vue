<template>
  <div class="filters">
    <div class="filter-left">
      <div class="tags">
        <div class="tags">
          <label><strong>Genres:</strong></label>
          <multiselect
            v-model="selectedTags"
            :options="tagOptions"
            :multiple="true"
            :taggable="true"
            :close-on-select="false"
            @tag="addTag"
            @close="emitFilters"
            placeholder="Add filters"
            label="name"
            track-by="name"
            class="multiselect"
          ></multiselect>
        </div>
      </div>

      <div class="filter">
        <label>
          Sort Page By:
          <select v-model="sortBy" @change="emitFilters">
            <option value="none">None</option>
            <option value="name">Alphabetical ▲</option>
            <option value="name-desc">Alphabetical ▼</option>
            <option value="rating">Rating ▼</option>
            <option value="rating-desc">Rating ▲</option>
          </select>
        </label>
      </div>
    </div>

    <div class="filter-right">
      <div class="filter">
        <label>
          Items Per Page:
          <select v-model="perPage" @change="emitFilters">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="50">100</option>
          </select>
        </label>
      </div>
    </div>
  </div>

  <div class="search-container">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for users..."
      @input="emitFilters"
      class="search-bar"
    />
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'UserFilters',
  components: {
    Multiselect,
  },
  emits: ['update-filters'],
  data() {
    return {
      searchQuery: '',
      selectedPrice: '',
      selectedTags: [],
      perPage: 20,
      sortBy: 'none',
      tagOptions: [{ name: 'Followers' }, { name: 'Following' }],
    }
  },
  methods: {
    emitFilters() {
      this.$emit('update-filters', {
        q: this.searchQuery,
        tags: this.selectedTags.map((tag) => tag.name),
        perPage: this.perPage,
        sortBy: this.sortBy || 'none',
      })
    },
    addTag(newTag) {
      const tag = newTag
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
      const existingOption = this.tagOptions.find((option) => option.name === tag)
      if (!existingOption) {
        this.tagOptions.push({ name: tag })
      }
    },
  },
}
</script>

<style>
.filters {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.filter-left {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 70%;
  align-items: start;
  align-content: flex-start;
  justify-content: flex-start;
  margin-left: 3%;
}

.filter-right {
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 15px;
  width: fit-content;
  margin-right: 3%;
  select {
    min-width: 50px;
  }
}

.search-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.filter {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: left;
  font-size: 14px;
  font-weight: bold;
  gap: 10px;
  align-content: center;
  label {
    margin-bottom: 5px;
  }
}

.tags {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: left;
  font-size: 14px;
  align-content: center;
}
.search-bar {
  position: relative;
  width: 83%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
  margin-top: 5px;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 115px;
}

.filters select,
.filters input {
  width: fit-content;
  height: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 8px;
  align-self: center;
}

.filters select {
  width: 112px;
}

.multiselect {
  position: relative;
  margin-top: 5px;
  box-sizing: content-box;
  display: block;
  width: 300px;
  color: #128782;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  ul {
    padding-inline-start: 0;
    margin: 0 0 5px;
  }
}

.multiselect__tags {
  display: block;
  padding: 8px 8px 8px 8px;
  border-radius: 8px;
  background: #ffffff;
}

.multiselect__tag {
  position: relative;
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background-color: #a11253;
  color: white;
  margin-right: 6px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: normal;
}

.multiselect__tag-icon {
  cursor: pointer;
  font-size: 16px;
  color: white;
  position: absolute;
  right: 4px;
  top: 0;
  bottom: 0;
  font-weight: bold;
}

.multiselect__input {
  display: flex;
  min-height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 8px;
  background: #f1f1f1;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
  margin-top: 8px;
}

.multiselect__select {
  box-shadow: 0 0 5px #7a7a7a;
  border-radius: 5px;
  max-height: 200px;
  overflow: auto;
  display: none;
  background-color: white;
  width: 100%;
  top: 100%;
}

.multiselect__select:before {
  content: '';
  border-color: transparent transparent transparent #333;
  border-style: solid;
  border-width: 6px;
}

.multiselect__tags-wrap {
  display: inline;
}

.multiselect__tag:hover {
  background-color: #0f6e65;
}

.multiselect__content {
  position: relative;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  width: 100%;
  margin-top: 3px;
  margin-bottom: 3px;
  li {
    width: 95%;
  }
}

.multiselect__option {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #efefef;
  margin: 3px;
  transition: 0.3s ease-in-out;
}

.multiselect__option:hover {
  background-color: #0f6e65;
  color: white;
}

.multiselect__option--selected {
  background-color: #a11253;
  color: white;
  font-style: italic;
}

.multiselect__single {
  height: 0.8rem;
  font-size: 01rem;
  color: #444;
}

.multiselect__content-wrapper {
  margin-bottom: 5px;
  overflow-y: auto;
}

.multiselect__tag {
  position: relative;
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 1;
}
</style>
