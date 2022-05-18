<template>
    <v-container flat>
      <v-card flat>
        <ValidationObserver v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(changeStep)">
            <v-row>
              <v-col>
                {{ $t('Views.Evaluations.stepQuestion.title') }}
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row
              v-for="(item,index) in questionnaires"
              v-bind:key="index"
            >
              <v-col cols="12" sm="7" class="pt-3 pl-4">
                <v-radio-group
                  v-model="evaluation.questionnaire"
                  :value="evaluation.questionnaire"
                  :mandatory="false"
                  class="my-0"
                >
                  <v-radio
                    class="pt-3"
                    :label="item.name"
                    :value="item.slug"
                    :readonly="evaluation.status != 'pending'"
                    :disabled="evaluation.status != 'pending'"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="5" class="pt-6 text-right">
                <v-btn
                  class="white--text mr-4"
                  color="primary"
                  style="margin-right=100%;"
                  dark
                  small
                  @click="getPdf(item)"
                >
                  {{$t('Views.Evaluations.stepQuestion.inputDownload')}}
                  <v-icon dark right small>mdi-file-pdf</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-alert type="info">
              {{ $t('Views.Evaluations.stepQuestion.custom_questionnaire_info') }}
            </v-alert>
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  block
                  large
                  @click="changeStep(true)"
                >{{ $t(prevAction) }}</v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  v-if="questionnaires.length"
                  large
                  block
                  color="primary"
                  type="submit"
                >{{ $t(nextAction) }}
                </v-btn>
                <v-btn
                  v-else
                  large
                  block
                  disabled
                  color="primary"
                  type="submit"
                >{{ $t(nextAction) }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-card>
      <img
        src="../../../../public/img/20200301_occ_solution_logo_only.png"
        style="visibility:hidden;"
        id="occEnergyCompassLogo"
        width="0"
        height="0"
        alt=""
      />
      <x-loading></x-loading>
    </v-container>
</template>

<script>

import { mapState } from 'vuex'
import is from 'is_js'

import questionnairesService from '../../../services/questionnaires'

import pdfmake from 'pdfmake/build/pdfmake'
import pdffonts from 'pdfmake/build/vfs_fonts.js'
pdfmake.vfs = pdffonts.pdfMake.vfs

export default {
  props: {
    evaluation: Object,
    step: String,
    nextAction: String,
    prevAction: String
  },
  data () {
    return {
      questionnaires: [],
      porLogoSrc: null,
      porLogoBase64: null
    }
  },
  watch: {
    porLogoSrc (newVal) {
      if (newVal) {
        this.toDataURL(this.porLogoSrc, (dataURL) => {
          this.porLogoBase64 = dataURL
        })
      }
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.session.user
    })
  },
  methods: {
    changeStep (isBack = false) {
      this.evaluation.questionnaireName = (this.questionnaires.find(q => q.slug === this.evaluation.questionnaire) || {}).name
      this.$emit('changeStep', this.engagement, isBack ? +this.step - 1 : +this.step + 1)
    },
    toDataURL (url, callback) {
      const xhr = new XMLHttpRequest()
      xhr.open('get', url)
      xhr.responseType = 'blob'

      xhr.onload = function () {
        const fr = new FileReader()

        fr.onload = function () {
          callback(this.result)
        }

        fr.readAsDataURL(xhr.response)
      }

      xhr.send()
    },
    writeRotatedText (text) {
      const canvas = document.createElement('canvas')
      canvas.width = 50
      canvas.height = 845

      const ctx = canvas.getContext('2d')

      // Genera color de fondo
      ctx.fillStyle = '#2196F3'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      // Posiciona el elemento al costado derecho de la página
      ctx.translate(50, 845)
      ctx.rotate(-0.5 * Math.PI)

      // Formatea el texto
      ctx.font = '20pt Roboto'
      ctx.fillStyle = 'white'
      ctx.fillText(text.toUpperCase(), 290, -15)
      ctx.restore()

      return canvas.toDataURL()
    },
    getPdf (questionnaire) {
      this.$store.dispatch('loading/show')
      const details = []
      for (const dimensionKey in questionnaire.evaluations) {
        const dimension = questionnaire.evaluations[dimensionKey]
        details.push({
          text: dimension.name[this.user.lang].toUpperCase(),
          bold: true,
          fontSize: 15,
          pageBreak: dimensionKey !== 'persons' ? 'before' : '',
          margin: dimensionKey !== 'persons' ? [0, 5, 0, 0] : []
        })
        for (let attrNum = 1; attrNum <= 3; attrNum++) {
          const attribute = dimension[`attr_${attrNum}`]
          for (const key of ['autoEvaluation', 'generalEvaluation']) {
            details.push({
              text: `${attribute.name[this.user.lang]} - ${this.$t(`Views.Evaluations.stepQuestion.${key}`)}`,
              bold: true,
              fontSize: 12
            })
            const questions = []
            for (let behaviorNum = 1; behaviorNum <= 5; behaviorNum++) {
              const behavior = attribute[`behavior_0${behaviorNum}`]
              questions.push(behavior[key][this.user.lang])
            }
            details.push({ ul: questions, margin: [15, 0, 0, 15] })
            if (key === 'generalEvaluation') break
          }
        }
      }

      const configuration = {
        pageSize: 'A4',
        info: {
          title: this.$t('Views.Evaluations.stepQuestion.questionnaire_title'),
          author: 'OCC',
          subject: this.$t('Views.Evaluations.stepQuestion.questionnaire_title')
        },
        defaultStyle: {
          fontSize: 11,
          font: 'Roboto',
          lineHeight: 1.2
        },
        header: () => {
          return [{
            image: this.porLogoBase64,
            height: 45,
            width: 117,
            margin: [15, 0, 25, 15]
          }]
        },
        footer: () => {
          return [
            {
              columns: [
                { width: '*', text: '' },
                {
                  width: 'auto',
                  text: this.$t('Views.Evaluations.stepQuestion.copyright'),
                  color: 'grey',
                  fontSize: 10
                },
                { width: '*', text: '' }
              ]
            }
          ]
        },
        background: () => {
          const result = {
            image: this.writeRotatedText(questionnaire.name),
            aligment: 'center',
            absolutePosition: { x: 545, y: 0 }
          }

          return result
        },
        content: [
          // Título
          {
            text: this.$t('Views.Evaluations.stepQuestion.questionnaire_e'),
            fontSize: 20,
            margin: [0, 20, 0, 10]
          },
          // Explicación
          {
            text: this.$t('Views.Evaluations.stepQuestion.pdf_explained', { name: questionnaire.name }),
            alignment: 'justify',
            margin: [0, 0, 20, 10]
          },
          // Cuestionario
          ...details
        ]
      }

      if (is.edge() || is.ie()) {
        const pdfDocGenerator = pdfmake.createPdf(configuration)
        pdfDocGenerator.getBlob((blob) => {
          window.navigator.msSaveBlob(blob, 'questionnaire.pdf')
          this.$store.dispatch('loading/hide')
        })
      } else {
        new Promise((resolve) => {
          resolve(pdfmake.createPdf(configuration).download('questionnaire'))
        }).then(() => this.$store.dispatch('loading/hide'))
      }
    },
    getQuestionnaires () {
      this.$store.dispatch('loading/show')
      return questionnairesService.listFiltered()
        .then((res) => {
          this.questionnaires = res.items
          if (!this.$route.params.slug && this.questionnaires.length) {
            this.evaluation.questionnaire = this.questionnaires[0].slug
          } else {
            if (this.evaluation.questionnaire.slug) {
              this.evaluation.questionnaire = this.evaluation.questionnaire.slug
            }
          }
          this.$store.dispatch('loading/hide')
        })
    }
  },
  created () {
    this.getQuestionnaires()
  },
  mounted () {
    this.porLogoSrc = document.getElementById('occEnergyCompassLogo').src
  }
}
</script>
