<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About Tea Taster</ion-title>
        <ion-buttons slot="end">
          <ion-button
            data-testid="logout-button"
            @click="
              $store.dispatch('logout').then(() => $router.replace('/login'))
            "
          >
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <ion-list>
        <ion-list-header>About</ion-list-header>
        <ion-item>
          <ion-label>Name</ion-label>
          <ion-note slot="end">{{ name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Description</ion-label>
          <ion-note slot="end">{{ description }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Version</ion-label>
          <ion-note slot="end">{{ version }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Author</ion-label>
          <ion-note slot="end">{{ author }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { logOutOutline } from 'ionicons/icons';

import { author, description, name, version } from '../../package.json';

export default defineComponent({
  name: 'About',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    return { logOutOutline, author, description, name, version };
  },
});
</script>

<style scoped></style>
