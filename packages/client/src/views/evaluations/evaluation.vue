
<template>
  <v-container fluid class="py-0 px-2">
    <v-card v-if="!completed">
      <!-- Header -->
      <v-row justify="center">
        <v-col cols="12" sm="12" md="8">
          <section class="enterprise-logo">
            <img
              :src="evaluation.enterprise.logo
                ? evaluation.enterprise.logo
                : '/img/20200301_occ_solution_logo.png'
              "
              alt="Enterprise Logo"
            />
          </section>
        </v-col>
        <v-col cols="12" sm="8" class="text-center">
          <v-card flat>
            <h1 class="display-1">{{ evaluation.displayName || evaluation.name }}</h1>
            <p class="mt-7 mb-2 text-center font-weight-bold">
              {{ $t('Views.Evaluations.evaluation.information_1') }}
            </p>
            <p class="text-center">
              <br/>
              {{ $t('Views.Evaluations.evaluation.information_2') }}
              <v-spacer/>
              <br/>
              {{ $t('Views.Evaluations.evaluation.information_3') }}
            </p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Poll -->
      <!--
      <template v-for="(evaluation, i) in questionEvaluation">
      </template>
      -->
    </v-card>

    <!-- Action Buttons -->
    <v-row wrap row class="mt-5" justify="center" v-if="$vuetify.breakpoint.xs">
      <v-col cols="12" class="text-center mt-4">
        <v-btn width="100%" class="mt-4" color="primary">
          {{ $t('Views.Evaluations.evaluation.input_back') }}
        </v-btn>
        <v-btn
          width="100%"
          class="mt-4"
          color="primary"
        >
          {{ $t('Views.Evaluations.evaluation.input_next') }}
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" class="text-center mt-4">
        <v-btn large
          color="primary"
          class="mt-4"
          :disabled="progress !== 100"
          @click="showConfirmation = true"
        >
          {{ $t('Views.Evaluations.evaluation.input_save') }}</v-btn>
      </v-col>
    </v-row>

    <!-- FAB Button -->
    <v-fab-transition style="bottom: 10px;">
      <v-btn dark fixed bottom right fab x-large
        :color="colorProgress"
      >
        <span>{{ (progress.toFixed(0)) }}%</span>
      </v-btn>
    </v-fab-transition>

    <!-- Modals -->
    <x-wellcome-dialog
      :evaluation="evaluation"
      :start-dialog="startDialog"
      @close="() => this.startDialog = false"
    ></x-wellcome-dialog>
    <x-middle-dialog
      :middle-dialog="middleDialog"
      @close="() => this.middleDialog = false"
    ></x-middle-dialog>
    <x-help-dialog
      :help-dialog="helpDialog"
      :progress="progress"
      @close="() => this.helpDialog = false"
    ></x-help-dialog>
    <x-info-dialog :dialog="outIntervalDialog" :icon="dialogIcon" :text="dialogText"></x-info-dialog>
    <x-confirmation-modal
      :show.sync="showConfirmation"
      :title="$t('Views.Evaluations.evaluation.confirmation_modal_title')"
      color="success"
      @close="showConfirmation = false"
    >
      <template v-slot:question>{{ $t('Views.Evaluations.evaluation.confirmation_modal_des') }}</template>
    </x-confirmation-modal>
    <x-loading></x-loading>
  </v-container>
</template>

<style scoped>
  .v-slider__tick--filled {
    background-color: none;
  }
</style>

<script src="./evaluation.js"></script>
