
import pdfUtils from '../../utils/pdf'

import dimResultsBase64 from '../../base64Files/dimension-results'

export default {
  methods: {
    truncateReference (str, limit = 24) {
      return str.length > limit ? str.slice(0, limit) + '...' : str
    },
    $generateDimensionsResults () {
      const rows = []
      let dimCnt = 0
      for (const dimKey of Object.keys(this.answersDimension)) {
        for (const varKey of Object.keys(this.answersDimension[dimKey].variables)) {
          const score = this.answersDimension[dimKey].variables[varKey].general.score
          const previous = this.answersDimension[dimKey].variables[varKey].general.previous

          const vName = this.answersDimension[dimKey].variables[varKey].name
          const variable = this.$t(`Views.Questionnaires.edit.v_${vName}`)

          rows.push([
            {
              text: this.truncateReference(variable),
              margin: [2, 9.4, 0, 8.4],
              fontSize: 7,
              color: '#666666',
              characterSpacing: 0.4
            },
            {
              text: ' '
            },
            pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), 0.5),
            pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), 0.5),
            {
              text: !this.hasPrevious ? '--' : this.round(score - previous),
              margin: [0, 7, 0, -5],
              fontSize: 11,
              alignment: 'center',
              bold: true,
              color: '#444444',
              characterSpacing: 0.2
            },
            // Score Bars
            this.hasPrevious
              ? pdfUtils.generatePreviousScoreBar(score, previous, 7)
              : pdfUtils.generateSimpleScoreBar(score, 10)
          ])
        }
        // Dimension spacer
        rows.push([
          {
            text: '', colSpan: 6, margin: [0, dimCnt === 0 ? 4 : 4.1]
          }
        ])
        dimCnt++
      }

      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.dimensions_variables_scores')),
        // base64 image
        {
          image: dimResultsBase64,
          fit: [721, 760],
          margin: [14, 35.3, 0, 0],
          alignment: 'right'
        },
        // Table
        {
          absolutePosition: { x: 240, y: 73.2 },
          table: {
            widths: ['21%', '0.4%', '6.2%', '6.1%', '7.3%', '56%'],
            body: [
              // Headers
              [
                {
                  text: ' '
                },
                {
                  text: ' '
                },
                {
                  text: '·',
                  margin: [0, -12, 0, -40],
                  fontSize: 40,
                  color: '#445bcc',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '·',
                  margin: [0, -12, 0, -40],
                  fontSize: 40,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' '
                },
                {
                  text: ' '
                }
              ],
              [
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                },
                {
                  text: this.$t('Views.Evaluations.report.current'),
                  margin: [0, 4, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.prev_score'),
                  margin: [0, 0, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: this.$t('Views.Evaluations.report.organizational.trend'),
                  margin: [0, 4, 0, -3],
                  fontSize: 7,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: ' ',
                  margin: [0, 0, 0, -3]
                }
              ],
              // Variables rows
              ...rows
            ]
          },
          layout: {
            hLineWidth: () => {
              return 0
            },
            vLineWidth: () => {
              return 0
            }
          }
        }
      ]
    }
  }
}
