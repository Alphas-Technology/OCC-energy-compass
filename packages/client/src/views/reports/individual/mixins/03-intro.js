
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
        // Examples
        {
          image: ChipBlueBase64,
          fit: [0.1, 0.1],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        },
        {
          image: ChipGreenBase64,
          fit: [0.1, 0.1],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        },
        {
          image: ChipGreyBase64,
          fit: [0.1, 0.1],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        },
        {
          image: ChipRedBase64,
          fit: [0.1, 0.1],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        }
      ]
    }
  }
}
