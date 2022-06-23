
import pdfUtils from '../../utils/pdf'

import ChipBlueBase64 from '../../base64Files/chip-blue'
import ChipGreenBase64 from '../../base64Files/chip-green'
import ChipGreyBase64 from '../../base64Files/chip-grey'
import ChipRedBase64 from '../../base64Files/chip-red'

export default {
  methods: {
    $generateIntroduction () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.introduction')),
        { text: this.$t('Views.Evaluations.report.introduction.first_paragraph'), margin: [10, 50, 0, 0], alignment: 'justify' },
        { text: this.$t('Views.Evaluations.report.introduction.second_paragraph'), margin: [10, 0, 0, 0], alignment: 'justify' },
        { text: this.$t('Views.Evaluations.report.toc.model').toUpperCase(), margin: [10, 15, 10, 0], fontSize: 14, bold: true },
        { text: this.$t('Views.Evaluations.report.introduction.third_paragraph'), margin: [10, 12, 0, 0], alignment: 'justify' },
        { text: this.$t('Views.Evaluations.report.introduction.fourth_paragraph'), margin: [10, 0, 0, 0], alignment: 'justify' },
        // Examples
        {
          layout: 'noBorders',
          margin: [-8, 0, 0, 0],
          table: {
            body: [
              [
                {
                  image: ChipBlueBase64,
                  fit: [350, 200],
                  margin: [0, 0, 0, 0],
                  alignment: 'center'
                },
                { text: this.$t('Views.Evaluations.report.introduction.professional'), margin: [-320, 22, 0, 0], fontSize: 13, bold: true },
                {
                  image: ChipGreenBase64,
                  fit: [350, 200],
                  margin: [0, 0, 0, 0],
                  alignment: 'center'
                },
                { text: this.$t('Views.Evaluations.report.introduction.physical'), margin: [-320, 22, 0, 0], fontSize: 13, bold: true }
              ]
            ]
          }
        },
        {
          layout: 'noBorders',
          margin: [-8, 0, 0, 0],
          table: {
            body: [
              [
                {
                  image: ChipGreyBase64,
                  fit: [350, 200],
                  margin: [0, -10, 0, 0],
                  alignment: 'center'
                },
                { text: this.$t('Views.Evaluations.report.introduction.emotional'), margin: [-320, 12, 0, 0], fontSize: 13, bold: true },
                {
                  image: ChipRedBase64,
                  fit: [350, 200],
                  margin: [0, -10, 0, 0],
                  alignment: 'center'
                },
                { text: this.$t('Views.Evaluations.report.introduction.mental'), margin: [-320, 12, 0, 0], fontSize: 13, bold: true }
              ]
            ]
          }
        }
      ]
    }
  }
}
