<template>
  <v-container fluid>
    <v-row align="center" justify="start" fill-height>
      <v-col xs="12" class="ml-2">
        <h4 class="display-1 mb-3">{{ $t('Views.Evaluations.edit.title') }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" >
        <v-card class="mt-4">
          <v-stepper v-model="step">
            <v-stepper-header>
              <template v-for="n in stepperHeaders.length">
                <v-stepper-step
                  :key="`${n}-step`"
                  :complete="step > n"
                  :step="n"
                >
                  {{ $t(stepperHeaders[n -1]) }}
                </v-stepper-step>

              </template>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content
                key="1-content"
                step="1"
              >
                <x-step-overview
                  :evaluation="evaluation"
                  :total-receptors="countOldEvaluated"
                  :auto-switch-name="autoSwitchName"
                  step="1"
                  nextAction="Views.Evaluations.edit.stepper_btn_next"
                  prevAction="Views.Evaluations.edit.stepper_btn_cancel"
                  @changeStep="verifyStepChanged"
                />
              </v-stepper-content>
              <v-stepper-content
                key="2-content"
                step="2"
              >
                <x-step-date
                  :evaluation="evaluation"
                  :auto-switch-date="autoSwitchDate"
                  step="2"
                  nextAction="Views.Evaluations.edit.stepper_btn_next"
                  prevAction="Views.Evaluations.edit.stepper_btn_back"
                  @changeStep="verifyStepChanged"
                  :time-zones="timeZones"
                ></x-step-date>
              </v-stepper-content>

              <v-stepper-content
                key="3-content"
                step="3"
              >
                <x-step-question
                  :evaluation="evaluation"
                  step="3"
                  nextAction="Views.Evaluations.edit.stepper_btn_next"
                  prevAction="Views.Evaluations.edit.stepper_btn_back"
                  @changeStep="verifyStepChanged"
                ></x-step-question>
              </v-stepper-content>
              <v-stepper-content
                key="4-content"
                step="4"
              >
                <x-step-evaluated-selection
                  :evaluation="evaluation"
                  :identify-types="identifyTypes"
                  step="4"
                  nextAction="Views.Evaluations.edit.stepper_btn_next"
                  prevAction="Views.Evaluations.edit.stepper_btn_back"
                  @changeStep="verifyStepChanged"
                  :employees="employees"
                ></x-step-evaluated-selection>
              </v-stepper-content>
              <v-stepper-content
                key="5-content"
                step="5"
              >
                <x-step-revition
                  :evaluation="evaluation"
                  :price="productService"
                  step="5"
                  nextAction="Views.Evaluations.edit.stepper_btn_update"
                  prevAction="Views.Evaluations.edit.stepper_btn_back"
                  :balance="balance"
                  :count-old-evaluated="countOldEvaluated"
                  :identify-types="identifyTypes"
                  @changeStep="verifyStepChanged"
                  @delete-invitation-file="deleteInvitationFile"
                  @delete-reminder-file="deleteReminderFile"
                ></x-step-revition>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
    <x-confirm-spend-dialog
      :confirmText="$t('Views.Evaluations.edit.confirm_edit_title')"
      :costText="$t('Views.Evaluations.edit.diff_cost')"
      :showModalConfirm="showModalConfirm"
      :balance="balance"
      :price="price"
      :noActiveEmployee="false"
      :noBalanceResponse="noBalanceResponse"
      :disableButtonModal="disableButtonModal"
      @update="reCheckBalance"
      @result="verifySpend">
    </x-confirm-spend-dialog>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import Resolver from '../../utils/resolver'

import evaluationsService from '../../services/evaluations'
import employeesService from '../../services/employees'
import timeZoneService from '../../services/time-zones'
import identifyTypesService from '../../services/identify-types'

import XStepOverview from './steps/overview.vue'
import XStepDate from './steps/date.vue'
import XStepQuestion from './steps/question.vue'
import XStepEvaluatedSelection from './steps/evaluated-selection.vue'
import XStepRevition from './steps/revition.vue'

export default Vue.extend({
  components: {
    XStepOverview,
    XStepDate,
    XStepQuestion,
    XStepEvaluatedSelection,
    XStepRevition
  },
  data () {
    return {
      stepperHeaders: [
        'Views.Evaluations.edit.stepper_overview',
        'Views.Evaluations.edit.stepper_date',
        'Views.Evaluations.edit.stepper_questions',
        'Views.Evaluations.edit.stepper_team',
        'Views.Evaluations.edit.stepper_revition'
      ],
      evaluation: {
        name: '',
        displayName: '',
        slug: '',
        status: '',
        operations: '',
        timeZone: '',
        tokenId: '',
        questionnaire: '',
        questionnaireName: '',
        deliveredAt: {
          value: '',
          hour: ''
        },
        validUntil: {
          value: '',
          hour: ''
        },
        evaluated: [],
        reminderMail: {},
        reminders: [],
        pollInvitation: {},
        thankMessage: '',
        customEmailRelease: {},
        customEmailDeadline: '',
        invitationFileFlag: true,
        reminderFileFlag: true
      },
      step: 1,
      enterpriseId: null,
      balance: 0,
      showModalConfirm: false,
      productService: 0,
      price: 0,
      noBalanceResponse: false,
      disableButtonModal: false,
      countOldEvaluated: 0,
      employees: [],
      identifyTypes: {},
      timeZones: [],
      autoSwitchName: false,
      autoSwitchDate: false
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  created () {
    this.$store.dispatch('loading/show')
    Resolver.all({
      employees: employeesService.listActive(),
      timeZones: timeZoneService.list(),
      identifyTypes: identifyTypesService.list(),
      balance: evaluationsService.checkBalance(),
      evaluation: evaluationsService.getOneToEdit(this.$route.params.slug)
    })
      .then(res => {
        res.identifyTypes.items.forEach(et => {
          this.identifyTypes[et.id] = this.getInitials(et.translate.label) + ' - '
        })
        this.getEmployees(res.employees.items)
        this.getTimeZones(res.timeZones.items)
        this.balance = res.balance.balance
        this.productService = res.balance.productService
        this.price = res.balance.productService
        this.getEvaluation(res.evaluation)
        this.mapEvaluated()
        this.$store.dispatch('loading/hide')
      })
      .catch(err => {
        this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
        this.$store.dispatch('loading/hide')
      })
  },
  methods: {
    getInitials (text) {
      return text.trim().split(' ').map(t => t.slice(0, 1)).join('').toUpperCase()
    },
    getEmployees (items) {
      this.employees = items.map((employee) => {
        return {
          text: `${employee.firstName} ${employee.lastName} (${this.identifyTypes[employee.identifyTypeId]}${employee.identifyDocument})`,
          value: employee.id,
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          identifyDocument: employee.identifyDocument,
          identifyTypeId: employee.identifyTypeId,
          employee: { id: employee.employee.id }
        }
      })
    },
    mapEvaluated () {
      this.evaluation.evaluated = this.employees.filter(emp => {
        return this.evaluation.evaluated.find(evaluated => evaluated.employee.id === emp.id)
      })
    },
    getTimeZones (items) {
      this.timeZones = items.map((item) => ({
        value: item.text,
        text: item.text,
        offset: item.offset
      }))
    },
    toConfirm () {
      if (this.evaluation.evaluated.length > this.countOldEvaluated) {
        this.showModalConfirm = true
        this.disableButtonModal = true
        this.price = this.productService * (this.evaluation.evaluated.length - this.countOldEvaluated)
      } else {
        this.edit()
      }
    },
    verifySpend (data) {
      if (data === 1) {
        return this.edit()
      }
      this.showModalConfirm = false
    },
    noBalanceMsg () {
      if (this.user.customer.type === 'personal') {
        return this.$t('errors.no_balance')
      } else {
        return this.$t('errors.no_balance_msg')
      }
    },
    canCreate () {
      if (this.balance - this.price < 0) {
        return this.user.customer.type === 'commercial'
      }
      return true
    },
    verifyStepChanged (data, step) {
      switch (step) {
        case 0: return this.$router.push('/evaluations')
        case 6: return this.toConfirm()
        default: this.step = step
      }
    },
    reCheckBalance () {
      evaluationsService.checkBalance()
        .then(res => {
          this.balance = res.balance
        })
    },
    getEvaluation (res) {
      this.evaluation.edit = true
      this.evaluation.name = res.name
      this.evaluation.displayName = res.displayName
      this.autoSwitchName = Boolean(this.evaluation.displayName)
      this.evaluation.status = res.status
      this.evaluation.timeZone = res.timeZone
      this.evaluation.questionnaire = res.questionnaire.slug
      this.evaluation.deliveredAt = this.getFormattedDate(res.deliveredAt)
      this.evaluation.validUntil = this.getFormattedDate(res.validUntil)
      this.evaluation.evaluated = res.evaluated
      this.countOldEvaluated = res.evaluated.length
      this.evaluation.customEmailRelease = res.customEmailRelease
      this.evaluation.customEmailReminder = res.customEmailReminder
      this.getFormattedReminders(res.reminders)

      this.evaluation.pollInvitation = {
        subject: this.evaluation.customEmailRelease.subject,
        body: this.evaluation.customEmailRelease.body,
        attachment: this.evaluation.customEmailRelease.attachment
      }
      this.evaluation.reminderMail = {
        subject: this.evaluation.customEmailReminder.subject,
        body: this.evaluation.customEmailReminder.body,
        attachment: this.evaluation.customEmailReminder.attachment
      }
      this.evaluation.thankMessage = res.customEmailDeadline ? res.customEmailDeadline.body : ''
    },
    getFormattedReminders (reminders) {
      for (const reminder of reminders) {
        this.evaluation.reminders.push(this.getFormattedDate(reminder.dateTime))
      }
      this.autoSwitchDate = Boolean(this.evaluation.reminders.length)
    },
    getFormattedDate (ref) {
      if (!ref) {
        return {
          value: '',
          hour: '23:00'
        }
      }
      const date = ref.split('T')
      const time = date[1].split(':')
      return {
        value: date[0],
        hour: time[0] + ':00'
      }
    },
    edit () {
      this.$store.dispatch('loading/show')
      this.disableButtonModal = false
      const pollInvitationFile = this.evaluation.pollInvitation.file
      const reminderMailFile = this.evaluation.reminderMail.file
      const data = JSON.parse(JSON.stringify(this.evaluation))
      // data.pollInvitation.file = this.evaluation.pollInvitation.file.name
      // data.reminderMail.file = this.evaluation.reminderMail.file.name

      data.evaluated = data.evaluated.map(emp => emp.id)
      return evaluationsService.edit(this.$route.params.slug, data)
        .then((res) => {
          if (!res._id) {
            if (res.status === 401 && this.evaluation.evaluated.length > this.countOldEvaluated) {
              this.$store.dispatch('alert/error', this.$t('errors.no_balance'))
              this.noBalanceResponse = true
              this.$store.dispatch('loading/hide')
              return
            } else {
              this.$store.dispatch('loading/hide')
              return
            }
          }

          return pollInvitationFile ? evaluationsService.sendInvitationFiles(res._id, { pollInvitationFile })
            .then(() => res)
            .catch(() => {
              this.$store.dispatch('alert/error', this.$t('errors.uploadInvitationError'))
              setTimeout(this.redirectSummary, 3000)
            }) : Promise.resolve(res)
        })
        .then((res) => {
          return reminderMailFile ? evaluationsService.sendReminderFiles(res._id, { reminderMailFile })
            .then(() => res)
            .catch(() => {
              this.$store.dispatch('alert/error', this.$t('errors.uploadReminderError'))
              setTimeout(this.redirectSummary, 3000)
            }) : Promise.resolve(res)
        })
        .then((res) => {
          if (res) {
            this.$store.dispatch('alert/success', this.$t('Views.Evaluations.edit.updated_evaluation'))
            setTimeout(this.redirectSummary, 3000)
          }
          return false
        })
        .catch((err) => {
          this.$store.dispatch('alert/error', this.$t(`errors.${err.code}`))
          this.$store.dispatch('loading/hide')
        })
    },
    redirectSummary () {
      this.$store.dispatch('loading/hide')
      this.$router.push('/evaluations')
    },
    deleteInvitationFile () {
      delete this.evaluation.customEmailRelease.attachment
      this.evaluation.invitationFileFlag = false
    },
    deleteReminderFile () {
      delete this.evaluation.reminderMail.attachment
      this.evaluation.reminderFileFlag = false
    }
  }
})
</script>
