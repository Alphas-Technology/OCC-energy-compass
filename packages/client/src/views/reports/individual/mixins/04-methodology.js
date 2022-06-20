
import pdfUtils from '../../utils/pdf'

import SquareBase64 from '../../base64Files/square'

export default {
  methods: {
    $generateMethodology () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.methodology')),
        // Example
        {
          image: SquareBase64,
          fit: [0.1, 0.1],
          margin: [0, 0, 0, 0],
          alignment: 'center'
        }
      ]
    }
  }
}
