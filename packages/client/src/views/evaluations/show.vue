<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row justify="space-between" class="px-8">
          <h4 class="display-1 left">{{ evaluation.name }}</h4>
          <v-chip
            class="mb-3 white--text right"
            color="primary"
            v-if="evaluation.displayName"
          >{{ evaluation.displayName }}</v-chip>
        </v-row>
      </v-col>
    </v-row>
    <v-card>
      <v-toolbar color="primary" flat class="white--text">
        <v-btn icon to="/evaluations" color="primary" large>
          <v-icon color="white">fa-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title>
          <h2 class="title">
            {{ $t('Views.Evaluations.show.evaluation') }}
          </h2>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              depressed
              v-on="on"
            >
            <v-icon class="mr-2">fa-cog</v-icon>
              {{ $t('Views.Evaluations.show.options') }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-if="evaluation.status === 'completed'"
              @click="$router.push(`/evaluations/reports/${evaluation._id}`)"
            >
              <v-icon class="mr-2" small>fa-file-pdf</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.download_reports') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="$router.push(`/evaluations/${evaluation.slug}/edit`)"
              v-if="evaluation.status !== 'completed'"
            >
              <v-icon class="mr-2" small>fa-pen</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.edit') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="openConfirmationModal('reminders')"
              v-if="evaluation.status === 'in_progress'"
            >
              <v-icon class="mr-2" small>fa-share</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.sending_reminders') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="openConfirmationModal('close')"
              v-if="evaluation.status === 'in_progress'"
            >
              <v-icon class="mr-2" small>fa-times-circle</v-icon>
              <v-list-item-title>{{ $t('Views.Evaluations.show.close_evaluation') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-row class="px-8 py-4 my-5">
        <v-col xs="12" sm="4" align="center">
          <v-progress-circular
            :rotate="-90"
            :size="150"
            :value="((evaluation.answers * 100) / totalEvaluations).toFixed(2)"
            :width="15"
            color="primary"
          >
            <p>
              <span class="display-2">
                {{ totalEvaluations }}
              </span> <br>
              <span class="title text-uppercase">
                {{ $t('Views.Evaluations.show.total') }}
              </span>
            </p>
          </v-progress-circular>
        </v-col>
        <v-col xs="12" sm="4" align="center">
          <v-row>
            <v-col cols="6" align="center">
              <h1 class="text-uppercase">{{ $t('Views.Evaluations.show.pending_evaluations') }}</h1>
              <h1 class="display-3" style="color: darkred">{{ totalEvaluations - evaluation.answers }}</h1>
              <h1>{{ (((totalEvaluations - evaluation.answers) * 100) / totalEvaluations).toFixed(2) }}% {{ $t('Views.Evaluations.show.of_polls') }}</h1>
            </v-col>
            <v-col cols="6" align="center">
              <h1 class="text-uppercase">{{ $t('Views.Evaluations.show.finished_evaluations') }}</h1>
              <h1 color="primary" class="display-3" style="color: #51c7af">{{ evaluation.answers }}</h1>
              <h1>{{ ((evaluation.answers * 100) / totalEvaluations).toFixed(2) }}% {{ $t('Views.Evaluations.show.of_polls') }}</h1>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs="12" sm="4" align="center">
          <v-list dense>
            <v-list-item one-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase" v-if="evaluation.status">
                  <v-chip outlined label :color="getColor(evaluation.status)">
                    {{ $t(`Views.Evaluations.show.status_${evaluation.status}`) }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">{{$t('Views.Evaluations.show.date_delivery')}}</v-list-item-title>
                <v-list-item-subtitle>{{ evaluation.deliveredAt | date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">{{$t('Views.Evaluations.show.poll_valid_until')}}</v-list-item-title>
                <v-list-item-subtitle>{{ evaluation.validUntil | date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-uppercase">{{$t('Views.Evaluations.show.scheduled_reminders')}}</v-list-item-title>
                <template v-if="evaluation.reminders.length">
                  <v-list-item-subtitle v-for="(reminder, k) in evaluation.reminders" :key="k">{{ reminder.dateTime | date }}</v-list-item-subtitle>
                </template>
                <v-list-item-subtitle v-else>{{$t('Views.Evaluations.show.no_reminders')}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="text-center">
        <v-col cols="12">
          <v-btn
            icon
            rounded
            color="info"
            @click="showModalChip = true"
          >
            <v-icon>mdi-information</v-icon>
          </v-btn>
          {{ $t('Views.Evaluations.stepRevition.team') }} ({{ evaluation.evaluated.length }} {{ $t('Views.Evaluations.stepRevition.team_members') }})
        </v-col>
        <v-col cols="12">
          <v-chip
            class="ma-2"
            :color="eva.status === 'completed' ? 'success' : (eva.status === 'in_progress' ? 'info' : 'default')"
            v-for="eva in evaluation.evaluated" :key="eva.id"
          >
          {{ eva.employee.firstName }} {{ eva.employee.lastName }} ({{ identifyTypes[eva.employee.identifyTypeId] }}{{ eva.employee.identifyDocument }})
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
    <x-confirmation-modal
      :show.sync="showModal"
      :reversible="typeModal !== 'close'"
      :title="typeModal !== 'close' ? $t('Views.Evaluations.show.send_reminders') : $t('Views.Evaluations.show.close_evaluation')"
      :action="typeModal !== 'close' ? sendReminders : closeEvaluation"
      :btn-save="$t('Views.Evaluations.show.input_confirm')"
      @close="showModal = false"
    >
      <template v-slot:question>{{ typeModal !== 'close' ? $t('Views.Evaluations.show.send_reminders_q') : $t('Views.Evaluations.show.close_evaluation_q') }}</template>
    </x-confirmation-modal>
    <v-dialog v-model="showModalChip">
      <v-card>
        <v-toolbar light flat class="text-center">
          <v-toolbar-title>{{ $t('Views.Evaluations.show.modal_title') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon light @click="showModalChip = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <p>{{ $t('Views.Evaluations.show.modal_info') }}</p>
          <v-chip class="ma-2" color="default">{{ $t('Views.Evaluations.show.modal_chip_default') }}</v-chip>
          <v-chip class="ma-2" color="info">{{ $t('Views.Evaluations.show.modal_chip_info') }}</v-chip>
          <v-chip class="ma-2" color="success">{{ $t('Views.Evaluations.show.modal_chip_success') }}</v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showModalChip = false">
            <v-icon>close</v-icon>&nbsp;{{ $t('Views.Evaluations.show.modal_input_close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import Vue from 'vue'
import { mapState } from 'vuex'

import evaluationsService from '../../services/evaluations'
import identifyTypesService from '../../services/identify-types'

export default Vue.extend({
  data () {
    return {
      evaluation: {
        reminders: [],
        evaluated: []
      },
      totalEvaluations: 0,
      typeModal: '',
      showModal: false,
      showModalChip: false,
      identifyTypes: {}
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  created () {
    this.$store.dispatch('loading/show')
    identifyTypesService.list()
      .then(res => {
        res.items.forEach(et => {
          this.identifyTypes[et.id] = this.getInitials(et.translate.label) + ' - '
        })
        this.$store.dispatch('loading/hide')
        return this.getEvaluation()
      })
  },
  methods: {
    getInitials (text) {
      return text.trim().split(' ').map(t => t.slice(0, 1)).join('').toUpperCase()
    },
    getColor (status) {
      switch (status) {
        case 'pending':
          return 'gray'
        case 'completed':
          return 'green'
        case 'in_progress':
          return 'blue'
      }
    },
    openConfirmationModal (type) {
      this.showModal = true
      this.typeModal = type
    },
    sendReminders () {
      return evaluationsService.sendReminders(this.evaluation.slug)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Evaluations.show.reminders_sent_succesfully'))
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    },
    closeEvaluation () {
      return evaluationsService.closeEvaluation(this.evaluation.slug)
        .then(() => {
          this.$store.dispatch('alert/success', this.$t('Views.Evaluations.show.evaluation_closed_succesfully'))
          return this.getEvaluation()
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        })
    },
    getEvaluation () {
      this.$store.dispatch('loading/show')
      return evaluationsService.getOneToShow(this.$route.params.slug)
        .then((res) => {
          this.baseEvaluation = res
          this.evaluation = JSON.parse(JSON.stringify(res))
          this.totalEvaluations = this.evaluation.answers = 0
          for (const evaluated of this.evaluation.evaluated) {
            this.totalEvaluations += 1
            if (evaluated.status === 'completed') {
              this.evaluation.answers++
            }
          }
          this.$store.dispatch('loading/hide')
        }).catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          this.$store.dispatch('loading/hide')
        })
    }
  }
})
</script>
