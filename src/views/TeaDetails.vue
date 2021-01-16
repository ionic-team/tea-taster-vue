<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tea Details</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/teas" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content ion-padding">
      <div v-if="tea">
        <div class="ion-justify-content-center" style="display: flex">
          <ion-img :src="tea.image"></ion-img>
        </div>
        <h1 data-testid="name">{{ tea.name }}</h1>
        <p data-testid="description">{{ tea.description }}</p>
        <app-rating
          data-testid="rating"
          v-model="rating"
          @click="ratingClicked"
        ></app-rating>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import { mapActions, mapGetters } from 'vuex';
import { defineComponent } from 'vue';

import AppRating from '@/components/AppRating.vue';
import { Tea } from '@/models';

export default defineComponent({
  name: 'TeaDetails',
  components: {
    AppRating,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonImg,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  computed: {
    ...mapGetters('teas', ['find']),
    tea(): Tea {
      return this.find(this.id);
    },
  },
  data() {
    return {
      rating: 0,
    };
  },
  methods: {
    ...mapActions('teas', ['rate']),
    ratingClicked() {
      this.rate({
        tea: this.tea,
        rating: this.rating,
      });
    },
  },
  created() {
    this.rating = this.tea?.rating;
  },
  watch: {
    tea(newValue) {
      this.rating = newValue?.rating;
    },
  },
  setup() {
    const { params } = useRoute();
    const id = parseInt(params.id as string, 10);
    return { id };
  },
});
</script>

<style scoped>
ion-img {
  max-width: 75%;
  max-height: 512px;
}
</style>
