<template>
  <q-page padding>
    <div class="q-gutter-sm">
      <div class="text-weight-medium">
        Vorname<span class="text-red" v-if="!anonymous">*</span>
      </div>
      <q-input
        v-model="feedbackFormular.firstname"
        placeholder="Vorname"
        dense
        outlined
        :disable="anonymous"
        :class="anonymous ? 'bg-grey-2' : 'bg-white'"
      ></q-input>

      <div class="text-weight-medium q-mt-md">
        Nachname<span class="text-red" v-if="!anonymous">*</span>
      </div>
      <q-input
        v-model="feedbackFormular.lastname"
        placeholder="Nachname"
        dense
        outlined
        :class="anonymous ? 'bg-grey-2' : 'bg-white'"
        :disable="anonymous"
      />

      <div class="text-weight-medium q-mt-md">
        E-Mail Adresse<span class="text-red" v-if="!anonymous">*</span>
      </div>
      <q-input
        v-model="feedbackFormular.email"
        placeholder="E-Mail Adresse"
        dense
        outlined
        :class="anonymous ? 'bg-grey-2' : 'bg-white'"
        :disable="anonymous"
      />

      <div class="text-weight-medium q-mt-md">Nachricht<span class="text-red">*</span></div>
      <q-input
        v-model="feedbackFormular.message"
        placeholder="Nachricht"
        dense
        outlined
        type="textarea"
        class="bg-white"
      />

      <q-checkbox
        v-model="anonymous"
        style="margin-left: 0px"
      >anonym</q-checkbox>
      <div>
        <q-btn
          class="full-width"
          color="primary"
          no-caps
          unelevated
          :loading="loading"
          :disable="loading"
          @click="sendFeedback"
        >Feedback absenden</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { createFeedback, FeedbackRequest } from 'src/api/feedbackApi';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { Ref, ref } from 'vue';

const notify = useNotify();

const feedbackFormular: Ref<FeedbackRequest> = ref({
  firstname: '',
  lastname: '',
  email: '',
  message: '',
});
const anonymous = ref(false);
const loading = ref(false);

async function sendFeedback() {
  try {
    loading.value = true;
    await createFeedback(feedbackFormular.value);
    notify.show('Feedback abgesendet', NotifyType.Success);
  } catch (error) {
    console.log(error);
    notify.show('Feedback konnte nicht abgesendet werden. Bitte versuche es erneut.', NotifyType.Error);
  } finally {
    loading.value = false;
  }
}
</script>
