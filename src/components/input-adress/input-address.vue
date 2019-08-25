<template>
  <div
    :class="['location-address', { disabled: isDisabled }]"
    v-overlay-container="{ togglePropName: 'areSuggestionsVisible' }"
    v-navigable-container="{
      cursorPropName: 'cursorIndex',
      enabledPropName: 'areSuggestionsVisible'
    }"
  >
    <label>
      <input
        tabindex="0"
        type="text"
        class="input"
        autocomplete="false"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        @input="onInputInput"
        @focus="onInputFocus"
        @blur="onInputBlur"
        @keydown="onInputKeyDown"
        v-model="query"
        :disabled="isDisabled"
        :placeholder="placeholder"
      />
    </label>
    <transition name="fade">
      <ul class="dropdown" v-if="areSuggestionsVisible">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id"
          @click="onSuggestionClick(suggestion.id)"
          :class="['item', { cursor: index === cursorIndex }]"
        >
          <button class="option">{{ suggestion.address }}</button>
        </li>
      </ul>
    </transition>
  </div>
</template>
<style scoped lang="scss" src="./input-address.scss"></style>
<script>
import { debounce } from "lodash-es";

import "../../directives/overlayContainer";
import "../../directives/navigableContainer";

const defaultValue = {
  id: "",
  address: "",
  lat: 0,
  lng: 0
};

export default {
  props: {
    placeholder: {
      type: String,
      default: "Address..."
    },
    value: {
      type: Object,
      default() {
        return { ...defaultValue };
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    search: {
      type: Function,
      required: true
    },
    resolve: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      query: this.value.address,
      areSuggestionsVisible: false,
      suggestions: [],
      cursorIndex: -1
    };
  },

  created() {
    this.query = this.value.address;
  },

  methods: {
    debouncedSuggest: debounce(function(query) {
      this.suggest(query);
    }, 500),

    onInputFocus() {
      if (this.suggestions.length > 0 && !this.areSuggestionsVisible) {
        this.areSuggestionsVisible = true;
        this.cursorIndex = 0;
      }
    },

    onInputBlur() {
      this.areSuggestionsVisible = false;
    },

    onInputInput(event) {
      this.debouncedSuggest(event.target.value);
    },

    onSuggestionClick(addressId) {
      this.areSuggestionsVisible = false;

      this.select(addressId);
    },

    onInputKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();

        if (this.areSuggestionsVisible) {
          this.select(this.suggestions[this.cursorIndex].id);

          this.areSuggestionsVisible = false;

          return;
        }

        if (this.query !== this.value.address) {
          this.select();
        }
      }
    },

    async suggest(query) {
      let suggestions = [];

      if (query.length > 2) {
        suggestions = await this.search(query);
      }

      this.suggestions = suggestions;
      this.areSuggestionsVisible = suggestions.length > 0;

      if (suggestions.length > 0) {
        this.cursorIndex = 0;
      }
    },

    async select(addressId = "") {
      if (addressId === this.value.id) {
        return;
      }

      if (addressId === "") {
        this.$emit("input", defaultValue);

        return;
      }

      const resolved = await this.resolve(addressId);
      const value = resolved === null ? defaultValue : resolved;

      if (value.id !== this.value.id) {
        this.$emit("input", value);
      }

      if (value.address.length > 0) {
        this.query = value.address;
      }
    }
  }
};
</script>
