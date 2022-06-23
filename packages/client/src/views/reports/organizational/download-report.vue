
<template>
  <div>
    <v-btn large
      :disabled="thread.status !== 'completed'"
      :loading="lockPdfButton"
      color="success"
      class="mt-3"
      @click="openPdf"
    >
      <v-icon class="mr-3">mdi-file-pdf</v-icon>
      <span v-if="thread.status === 'pending'">
        {{ $t('Views.Evaluations.report.generating_report') }}
      </span>
      <span v-else-if="thread.status === 'in_action' || thread.status === 'in_progress'">
        {{`
          ${$t('Views.Evaluations.report.generating_report')}
          ${thread.data.progress}%
        `}}
      </span>
      <span v-else-if="thread.status === 'failed'">
        {{ $t('Views.Evaluations.report.failed_generation') }}
      </span>
      <span v-else>
        {{ $t('Views.Evaluations.report.download_report') }}
      </span>
    </v-btn>

    <!-- Empty img container to load Enterprise Logo if any -->
    <img
      v-if="enterpriseLogo"
      :src="enterpriseLogo"
      id="dynamicEnterpriseLogo"
      class="d-none"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import is from 'is_js'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

import initial from './mixins/00-initial'
import cover from './mixins/01-cover'
import index from './mixins/02-index'
import intro from './mixins/03-intro'
import methodology from './mixins/04-methodology'
import model from './mixins/05-model'
import responseRate from './mixins/06-response-rate'
import gralScores from './mixins/07-gral-scores'

pdfMake.vfs = pdfFonts.pdfMake.vfs
const echarts = require('echarts')

export default {
  name: 'thread-organizational-report-exec',
  mixins: [
    initial,
    cover,
    index,
    intro,
    methodology,
    model,
    responseRate,
    gralScores
  ],
  props: {
    pollId: String,
    evaluationData: Object,
    thread: Object
  },
  data () {
    return {
      downloadPdf: true,
      renderPart: {
        donutPie: false,
        chartPie: false
      },
      heatMap: [
        '#f85d19',
        '#f99c16',
        '#fcec14',
        '#b7d600',
        '#1bd800'
      ],
      occGreen: '#51c7af',
      occGrey: '#7d838d',
      occRed: '#ec604d',
      occBlue: '#1999da',
      occGreenRgba: 'rgba(81, 199, 175, 0.6)',
      occGreyRgba: 'rgba(125, 131, 141, 0.6)',
      occRedRgba: 'rgba(236, 96, 77, 0.6)',
      occBlueRgba: 'rgba(25, 153, 218, 0.6)',
      enterpriseLogoSrc: null,
      enterpriseLogo: null,
      lockPdfButton: false,
      previous: {},
      questionnaire: {},
      answersDimension: {},
      gralScore: 0,
      gralPrevScore: 0,
      completedPolls: 0,
      expectedPolls: 0,
      responseRatePie: null,
      dimensionsResultsPie: null
    }
  },
  mounted () {
    this.enterpriseLogoSrc = `data:image/png;base64,${this.evaluationData.enterprise.logo}`
  },
  watch: {
    renderPart: {
      handler () {
        const hasFalses = Object.values(this.renderPart).includes(false)
        if (!hasFalses) this.renderPdf()
      },
      deep: true
    },
    enterpriseLogoSrc (val) {
      if (val) {
        this.toDataURL(this.enterpriseLogoSrc, (dataURL) => {
          this.enterpriseLogo = dataURL
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
    async openPdf () {
      this.$store.dispatch('loading/show')
      this.lockPdfButton = true
      await this.$getInitialData()
    },
    async renderPdf () {
      this.$emit('render-pdf')
      const configuration = await this.$getConfiguration()
      if (this.downloadPdf) {
        if (is.edge() || is.ie()) {
          const pdfDocGenerator = pdfMake.createPdf(configuration)
          pdfDocGenerator.getBlob((blob) => {
            window.navigator.msSaveBlob(blob, `${this.evaluationData.name}.pdf`)
            this.closeRenderPdf()
          })
        } else {
          pdfMake.createPdf(configuration).download(`${this.evaluationData.name}.pdf`, () => {
            this.closeRenderPdf()
          })
        }
      } else {
        this.closeRenderPdf()
      }
    },
    closeRenderPdf () {
      this.$store.dispatch('loading/hide')
      this.lockPdfButton = false
      this.$emit('pdfRenderedOrg')
    },
    getHeatMap (s) {
      if (!s) {
        return '#FFFFFF'
      } else if (s >= 1 && s < 2) {
        return this.heatMap[0]
      } else if (s >= 2 && s < 3) {
        return this.heatMap[1]
      } else if (s >= 3 && s < 4) {
        return this.heatMap[2]
      } else if (s >= 4 && s < 4.5) {
        return this.heatMap[3]
      } else if (s >= 4.5) {
        return this.heatMap[4]
      }
    },
    getPercentString (value) {
      // if (value % 1 === 0) {
      if (Number.isInteger(value)) {
        return Math.round(value).toString()
      } else {
        return this.round(value).toString()
      }
    },
    generateResponseRatePie () {
      const canvas = document.createElement('canvas')
      canvas.width = 1040 * 2
      canvas.height = 740 * 2

      const chartPieLocal = echarts.init(canvas)

      const participationPercent = (this.completedPolls * 100) / this.expectedPolls
      const participationPercentString = this.getPercentString(participationPercent)

      chartPieLocal.setOption({
        tooltip: {
          trigger: 'none'
        },
        title: {
          text: this.$t('Views.Evaluations.report.organizational.of_population'),
          left: 'center',
          textStyle: { fontSize: 40, fontWeight: 'lighter' },
          y: 876
        },
        series: [
          {
            name: 'Response Rate',
            type: 'pie',
            radius: ['59%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
            },
            markPoint: {
              tooltip: { show: false },
              label: {
                show: true,
                formatter: '{b}%',
                color: 'black',
                fontSize: 270,
                fontWeight: 'bold'
              },
              data: [{
                name: participationPercentString,
                value: '',
                symbol: 'circle',
                itemStyle: { color: 'transparent' },
                x: '50%',
                y: '51.5%'
              }]
            },
            data: [
              {
                value: 100 - participationPercent,
                itemStyle: {
                  color: '#DDDDDD'
                }
              },
              {
                value: participationPercent,
                itemStyle: {
                  color: this.occBlue
                }
              }
            ]
          }
        ]
      })

      chartPieLocal.on('finished', () => {
        this.responseRatePie = chartPieLocal.getDataURL()
        this.renderPart.donutPie = true
        this.generateDimensionsResultsPie()
      })
    },
    generateDimensionsResultsPie () {
      const canvas = document.createElement('canvas')
      canvas.width = 700
      canvas.height = 700

      const chartPieLocal = echarts.init(canvas)

      chartPieLocal.setOption({
        angleAxis: {
          type: 'category',
          data: [
            {
              value: '{a|4.10}{b| | 5.00}\n{c|PROFESIONAL}',
              textStyle: {
                rich: {
                  a: {
                    fontSize: 19,
                    color: '#1999da',
                    align: 'center'
                  },
                  b: {
                    fontSize: 18,
                    color: '#000000',
                    align: 'center'
                  },
                  c: {
                    fontSize: 20,
                    color: '#1999da',
                    align: 'center'
                  }
                }
              }
            },
            {
              value: '{a|2.00}{b| | 4.28}\n{c|EMOCIONAL}',
              textStyle: {
                rich: {
                  a: {
                    fontSize: 19,
                    color: '#ec604d',
                    align: 'center'
                  },
                  b: {
                    fontSize: 18,
                    color: '#000000',
                    align: 'center'
                  },
                  c: {
                    fontSize: 20,
                    color: '#ec604d',
                    align: 'center'
                  }
                }
              }
            },
            {
              value: '{a|4.33}{b| | 4.67}\n{c|FÍSICA}',
              textStyle: {
                rich: {
                  a: {
                    fontSize: 19,
                    color: '#51c7af',
                    align: 'center'
                  },
                  b: {
                    fontSize: 18,
                    color: '#000000',
                    align: 'center'
                  },
                  c: {
                    fontSize: 20,
                    color: '#51c7af',
                    align: 'center'
                  }
                }
              }
            },
            {
              value: '{a|4.67}{b| | 3.28}\n{c|MENTAL}',
              textStyle: {
                rich: {
                  a: {
                    fontSize: 19,
                    color: '#7d838d',
                    align: 'center'
                  },
                  b: {
                    fontSize: 18,
                    color: '#000000',
                    align: 'center'
                  },
                  c: {
                    fontSize: 20,
                    color: '#7d838d',
                    align: 'center'
                  }
                }
              }
            }
          ],
          z: 10
        },
        radiusAxis: {
          min: 1,
          max: 5,
          interval: 1,
          axisLabel: {
            show: true,
            fontSize: 15
          }
        },
        polar: {},
        series: [
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(25, 153, 218, 0.6)',
            data: [4.10, 0, 0, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(0,0,0,0)',
            data: [0.8, 0, 0, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: '#555555',
            data: [0.1, 0, 0, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(236, 96, 77, 0.6)',
            data: [0, 2, 0, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(0,0,0,0)',
            data: [0, 2.18, 0, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: '#555555',
            data: [0, 0.1, 0, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(81, 199, 175, 0.6)',
            data: [0, 0, 4.33, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(0,0,0,0)',
            data: [0, 0, 0.24, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: '#555555',
            data: [0, 0, 0.1, 0]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(125, 131, 141, 0.6)',
            data: [0, 0, 0, 3.18]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: '#555555',
            data: [0, 0, 0, 0.1]
          },
          {
            type: 'bar',
            coordinateSystem: 'polar',
            stack: 'a',
            color: 'rgba(125, 131, 141, 0.6)',
            data: [0, 0, 0, 1.39]
          }
        ],
        barWidth: '100%'
      })

      chartPieLocal.on('finished', () => {
        this.dimensionsResultsPie = chartPieLocal.getDataURL()
        this.renderPart.chartPie = true
      })
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
    getDateString () {
      const today = new Date()
      const monthName = this.$t(`Views.Evaluations.report.months.${[today.getMonth()]}`)
      return `${monthName} - ${today.getFullYear()}`
    },
    round (value, decimals = 2) {
      if (isNaN(Number(value))) {
        return '--'
      }
      if ((value * 100) < 1 && (value * 100) > -1) {
        value = 0
      }
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals)
    }
  }
}
</script>
