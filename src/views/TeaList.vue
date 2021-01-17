<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Teas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Teas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row
          class="ion-align-items-stretch"
          v-for="(row, index) in teaRows"
          :key="index"
        >
          <ion-col
            v-for="tea of row"
            size="12"
            size-md="6"
            size-xl="3"
            :key="tea.id"
          >
            <ion-card button @click="$router.push(`/tabs/teas/tea/${tea.id}`)">
              <ion-img :src="tea.image"></ion-img>
              <ion-card-header>
                <ion-card-title>{{ tea.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>{{ tea.description }}</ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { mapState } from 'vuex';
import { defineComponent } from 'vue';

import { Tea } from '@/models';

export default defineComponent({
  name: 'TeaList',
  computed: {
    ...mapState('teas', {
      teaData: 'list',
    }),
    teaRows(): Array<Array<Tea>> {
      const teaMatrix: Array<Array<Tea>> = [];
      let row: Array<Tea> = [];
      this.teaData.forEach((t: Tea) => {
        row.push(t);
        if (row.length === 4) {
          teaMatrix.push(row);
          row = [];
        }
      });

      if (row.length) {
        teaMatrix.push(row);
      }
      return teaMatrix;
    },
  },
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonImg,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
  },
});
</script>

<style scoped>
ion-card {
  height: 100%;
}

ion-col {
  margin-bottom: 1em;
}
</style>
