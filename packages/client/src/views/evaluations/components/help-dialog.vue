
<template>
  <v-dialog
    v-model="show"
    persistent
    @click:outside="close"
  >
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="primary"
        centered
        dark
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        :show-arrows="$vuetify.breakpoint.xs"
        icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#tab-1">
          {{ $t('Views.Evaluations.evaluation.helpDialog.tab_help') }}
          <v-icon>mdi-information</v-icon>
        </v-tab>
        <v-tab href="#tab-2">
          {{ $t('Views.Evaluations.evaluation.helpDialog.tab_progress') }}
          <v-icon>mdi-progress-alert</v-icon>
        </v-tab>
        <v-tab href="#tab-3">
          {{ $t('Views.Evaluations.evaluation.helpDialog.tab_team') }}
          <v-icon>mdi-account-group</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <v-card flat>
            <v-row>
              <v-col cols="12 px-4">
                {{ $t('Views.Evaluations.evaluation.helpDialog.info') }}
              </v-col>
            </v-row>
            <v-row justify="space-around" class="px-2 text-center">
              <v-col v-for="i in 6" :key="i">
                <v-chip :color="legendColors[i - 1]">
                  <strong style="color:#fff">{{ i }}</strong>
                </v-chip>
                <br/>
                <span style="margin: 5px 0 0 5px; font-weight: bold;">{{ $t(`Views.Evaluations.evaluation.helpDialog.score_label${i}`) }}</span>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card flat>
            <v-row justify="center" align="center">
              <v-col cols="12 px-4">
                <h3>{{ $t('Views.Evaluations.evaluation.helpDialog.progress_auto_info') }}</h3>
                <v-progress-linear
                  v-model="progressAuto"
                  :color="colorProgressAuto"
                  height="25"
                >
                  <strong>{{ Math.ceil(progressAuto) }}%</strong>
                </v-progress-linear>
              </v-col>
              <v-col cols="12 px-4">
                <h3>{{ $t('Views.Evaluations.evaluation.helpDialog.progress_team_info') }}</h3>
                <v-progress-linear
                  v-model="progressTeam"
                  :color="colorProgressTeam"
                  height="25"
                >
                  <strong>{{ Math.ceil(progressTeam) }}%</strong>
                </v-progress-linear>
              </v-col>
              <v-col cols="12 px-4">
                <h3>{{ $t('Views.Evaluations.evaluation.helpDialog.progress_info') }}</h3>
                <v-progress-linear
                  v-model="progress"
                  :color="colorProgress"
                  height="25"
                >
                  <strong>{{ Math.ceil(progress) }}%</strong>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-3">
          <v-card flat>
            <v-row>
              <v-col cols="12 px-4">
                {{ $t('Views.Evaluations.evaluation.helpDialog.members_info') }}
              </v-col>
            </v-row>
            <v-row justify="space-around" class="px-2 text-center">
              <v-col>
                <v-chip
                  class="ma-2"
                  color="default"
                  v-for="eva in team" :key="eva._id"
                >
                {{ eva.employee.firstName }} {{ eva.employee.lastName }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <v-row justify="center" class="text-center">
        <v-col cols="12">
          <v-btn
            @click="close"
            class="mt-4"
            color="primary"
            large
          >{{ $t('Views.Evaluations.evaluation.helpDialog.input_continue') }}</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    helpDialog: Boolean,
    progressAuto: Number,
    progressTeam: Number,
    progress: Number,
    team: Array
  },
  data () {
    return {
      tab: null,
      show: false,
      legendColors: ['#BB3E3E', '#B8663D', '#C2B147', '#B6C144', '#44C156', '#1B5E20']
    }
  },
  watch: {
    helpDialog: {
      handler () {
        this.show = this.helpDialog
      },
      immediate: true
    }
  },
  computed: {
    colorProgress () {
      return this.getColorProgress(this.progress)
    },
    colorProgressTeam () {
      return this.getColorProgress(this.progressTeam)
    },
    colorProgressAuto () {
      return this.getColorProgress(this.progressAuto)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    getColorProgress (progress) {
      if (progress >= 0 && progress < 20) return '#BB3E3E'
      if (progress >= 20 && progress < 40) return '#B8663D'
      if (progress >= 40 && progress < 60) return '#C2B147'
      if (progress >= 60 && progress < 80) return '#B6C144'
      if (progress >= 80 && progress < 99) return '#44C156'
      return '#1B5E20'
    }
  }
})
</script>
