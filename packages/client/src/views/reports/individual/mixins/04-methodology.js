
import pdfUtils from '../../utils/pdf'

import squareWithColors from '../../base64Files/squareWithColors'

export default {
  methods: {
    $generateMethodology () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.methodology')),
        { text: this.$t('Views.Evaluations.report.methodology.first_paragraph'), margin: [10, 50, 0, 0], alignment: 'justify' },
        { text: this.$t('Views.Evaluations.report.methodology.second_paragraph'), margin: [10, 0, 0, 0], alignment: 'justify' },
        // Example
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                {
                  image: squareWithColors,
                  fit: [400, 300],
                  margin: [-8, 40, 0, 0],
                  alignment: 'left'
                },
                {
                  layout: 'noBorders',
                  table: {
                    body: [
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.third_paragraph'), margin: [10, 110, 0, 0], alignment: 'justify' }
                      ],
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.fifth_paragraph'), margin: [10, 0, 0, 0], alignment: 'justify' }
                      ],
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.sixth_paragraph'), margin: [10, 0, 0, 0], alignment: 'justify' }
                      ],
                      [
                        { text: this.$t('Views.Evaluations.report.methodology.seventh_paragraph'), margin: [10, 0, 0, 0], alignment: 'justify' }
                      ]
                    ]
                  }
                }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          margin: [30, -260, 0, 0],
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.very_good'), margin: [35, 3, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.good'), margin: [65, 28, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.acceptable'), margin: [65, 28, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.bad'), margin: [65, 28, 0, 0] }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            body: [
              [
                { text: this.$t('Views.Evaluations.report.methodology.scores.very_bad'), margin: [65, 28, 0, 0] }
              ]
            ]
          }
        }
      ]
    }
  }
}
