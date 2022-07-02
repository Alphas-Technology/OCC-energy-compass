
import pdfUtils from '../../utils/pdf'

import physicalDetailBase64 from '../../base64Files/individual/dimension-detail1'
import mentalDetailBase64 from '../../base64Files/individual/dimension-detail2'
import emotionalDetailBase64 from '../../base64Files/individual/dimension-detail3'
import professionalDetailBase64 from '../../base64Files/individual/dimension-detail4'

export default {
  methods: {
    $generateDimensionDetail () {
      const pages = []
      const evaluations = this.evaluation.questionnaire.evaluations
      const answers = this.evaluated.temp.evaluations

      let dimCnt = 0
      for (const dimKey of Object.keys(evaluations)) {
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
        let varCnt = 0
        for (const varKey of Object.keys(evaluations[dimKey])) {
          for (const qKey of Object.keys(evaluations[dimKey][varKey])) {
            const reference = evaluations[dimKey][varKey][qKey].reference[this.lang]
            const score = answers[dimCnt].variable[varCnt].score

            // Keep the questionnaire question, belonging to the health index
            if (evaluations[dimKey][varKey][qKey].index.includes('generalHealth')) {
              this.healthIndexQ1 = evaluations[dimKey][varKey][qKey].reference
              this.healthIndexQ1Score = score
            }

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
              pdfUtils.generateScoreWithHeatMap(this.round(score, 2), this.getHeatMap(score), -4.9),
              // Score Bars
              pdfUtils.generateIndividualScoreBar(score, 7.7)
            ])
            varCnt++
          }
          // Variable spacer
          rows.push([{ text: '', colSpan: 4, margin: [0, 6.6] }])
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
            absolutePosition: { x: 244, y: 95 },
            table: {
              widths: ['20%', '0.9%', '6%', '68.2%'],
              body: [
                // Headers
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
        dimCnt++
      }

      return pages
    }
  }
}
