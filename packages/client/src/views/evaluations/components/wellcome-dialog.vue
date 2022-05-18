<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
  >
    <v-card class="wellcome-dialog">
      <v-container fluid>
        <v-row row wrap>
          <v-col cols="12"
            class="text-center grey--text text--darken-1"
            style="margin: 30px auto!important;"
          >
            <section class="enterprise-logo">
              <img src="/img/20200301_occ_solution_logo.png" v-if="!evaluation.enterprise.logo"/>
              <img v-else :src="evaluation.enterprise.logo" alt="Enterprise Logo"/>
            </section>
            <br>
            <h2 class="mt-4 mx-3" :class="{ 'display-3': !$vuetify.breakpoint.xs, 'headline': $vuetify.breakpoint.xs }" style="color: #42A5F5;">{{ $t('Views.Evaluations.evaluation.wellcomeDialog.wellcome_title') }}</h2>
            <h3 class="mt-4 mx-3" :class="{ 'display-2': !$vuetify.breakpoint.xs, 'title': $vuetify.breakpoint.xs }" style="color: #42A5F5;">{{ evaluation.displayName || evaluation.name }}</h3>
            <p class="mt-4 mx-5 px-5" v-html="$t('Views.Evaluations.evaluation.wellcomeDialog.wellcome_instructions', { deadline: this.deadLine })"></p>
            <v-row justify="center">
              <v-col cols="12">
                <v-btn
                  @click="close"
                  class="mt-4"
                  color="primary"
                  large
                >{{ $t('Views.Evaluations.evaluation.wellcomeDialog.input_start_poll') }}</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    startDialog: Boolean,
    evaluation: Object
  },
  data () {
    return {
      deadLine: '',
      show: false
    }
  },
  watch: {
    startDialog: {
      handler () {
        this.show = this.startDialog
        if (this.startDialog) {
          this.setDeadLine()
        }
      },
      immediate: true
    }
  },
  methods: {
    setDeadLine () {
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      const [fecha, time] = this.evaluation.validUntil.split('T')
      const [ano, mes, dia] = fecha.split('-')
      let [hora, min, seg] = time.split('.')[0].split(':')
      const ampm = hora >= 12 ? ' pm' : ' am'
      hora = (hora % 12) || 12
      this.deadLine = `${dia} ${months[mes - 1]} de ${ano}, ${hora}:${min}:${seg} ${ampm}`
    },
    close () {
      this.show = false
      this.$emit('close')
    }
  }
})
</script>
