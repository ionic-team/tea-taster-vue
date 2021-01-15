<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content></ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'About',
  components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar },
});
</script>

<style scoped></style>
