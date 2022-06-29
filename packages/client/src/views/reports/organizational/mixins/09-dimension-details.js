
import pdfUtils from '../../utils/pdf'

import physicalDetailBase64 from '../../base64Files/dimension-detail1'
import mentalDetailBase64 from '../../base64Files/dimension-detail2'
import emotionalDetailBase64 from '../../base64Files/dimension-detail3'
import professionalDetailBase64 from '../../base64Files/dimension-detail4'

export default {
  methods: {
    truncateReference (str, limit = 24) {
      return str.length > limit ? str.slice(0, limit) + '...' : str
    },
    $generateDimensionDetail () {
      const pages = []
      for (const dimKey of Object.keys(this.answersDimension)) {
        let backgroundImg
        switch (dimKey) {
          case 'physical': backgroundImg = physicalDetailBase64
            break
          case 'mental': backgroundImg = mentalDetailBase64
            break
          case 'emotional': backgroundImg = emotionalDetailBase64
            break
          case 'professional': backgroundImg = professionalDetailBase64
            break
        }

        const rows = []
        for (const varKey of Object.keys(this.answersDimension[dimKey].variables)) {
          for (const qKey of Object.keys(this.answersDimension[dimKey].variables[varKey].questions)) {
            const score = this.answersDimension[dimKey].variables[varKey].questions[qKey].general.score
            const previous = this.answersDimension[dimKey].variables[varKey].questions[qKey].general.previous

            const vName = this.answersDimension[dimKey].variables[varKey].name
            const qName = this.answersDimension[dimKey].variables[varKey].questions[qKey].name

            const reference = this.evaluationData.questionnaire.evaluations[dimKey][vName][qName].reference[this.user.lang]

            rows.push([
              {
                text: this.truncateReference(reference),
                margin: [2, 7.6, 0, -5],
                fontSize: 7,
                color: '#666666',
                characterSpacing: 0.4
              },
              {
                text: ' '
              },
              pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), -5),
              pdfUtils.generateScoreWithHeatMap(!this.hasPrevious ? '--' : this.round(previous), this.getHeatMap(previous), -5),
              {
                text: !this.hasPrevious ? '--' : this.round(score - previous),
                margin: [0, 5.4, 0, -5],
                fontSize: 11,
                alignment: 'center',
                bold: true,
                color: '#444444',
                characterSpacing: 0.2
              },
              // Score Bars
              this.hasPrevious
                ? pdfUtils.generatePreviousScoreBar(score, previous, 3.6)
                : pdfUtils.generateSimpleScoreBar(score, 7)
            ])
          }
          // Variable spacer
          rows.push([
            {
              text: '', colSpan: 6, margin: [0, 6.5]
            }
          ])
        }

        pages.push(
          // Page Title
          pdfUtils.generateHeaderTitle(this.$t(`Views.Evaluations.report.toc.detailed_scores_dim_${dimKey}`)),
          // base64 image
          {
            image: backgroundImg,
            fit: [730, 760],
            margin: [0, 30, 0, 0],
            alignment: 'center'
          },
          // Table
          {
            absolutePosition: { x: 240, y: 73.2 },
            table: {
              widths: ['21%', '0.4%', '6.2%', '6.1%', '7.3%', '55%'],
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
        )
      }

      return pages
    }
  }
}
