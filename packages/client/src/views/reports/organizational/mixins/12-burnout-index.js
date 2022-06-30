
import pdfUtils from '../../utils/pdf'

import burnout from '../../base64Files/burnout-square'

export default {
  computed: {
    distanceBetweenPoints () {
      return 90
    }
  },
  methods: {
    getBIndividualPosition () {
      const distanceFromLeftLimit = 40
      const value = this.indicesAnswers.burnoutIndividual.general.score < 1
        ? 1
        : this.indicesAnswers.burnoutIndividual.general.score > 5
          ? 5
          : this.indicesAnswers.burnoutIndividual.general.score
      return distanceFromLeftLimit + (this.distanceBetweenPoints * (value - 1))
    },
    getBOrganizationalPosition () {
      const distanceFromTopLimit = 423
      const value = this.indicesAnswers.burnoutOrganizational.general.score < 1
        ? 1
        : this.indicesAnswers.burnoutOrganizational.general.score > 5
          ? 5
          : this.indicesAnswers.burnoutOrganizational.general.score
      return distanceFromTopLimit - (this.distanceBetweenPoints * (value - 1))
    },
    getImage () {
      return new Promise((resolve) => {
        const data = burnout
        const canvas = document.getElementById('burnoutIndex')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.src = data
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 451, 451)
          ctx.font = '100px serif'
          // Coordenadas a modificar para ubicar el
          // Punto 1: x = 40, y = 433; Distancia entre puntos es de 90
          ctx.fillText('·', this.getBIndividualPosition(), this.getBOrganizationalPosition())
        }

        setTimeout(() => {
          resolve(canvas.toDataURL())
        }, 100)
      })
    },
    async $generateBurnoutIndex () {
      return [
        // Page Title
        pdfUtils.generateHeaderTitle(this.$t('Views.Evaluations.report.toc.burnout_index')),
        {
          margin: [0, 40, 10, 0],
          columns: [
            {
              image: await this.getImage(),
              fit: [600, 400],
              alignment: 'center'
            },
            {
              text: this.$t('Views.Evaluations.report.burnout_index'),
              margin: [0, 270, 0, 0],
              width: '40%',
              alignment: 'justify'
            }
          ]
        }
      ]
    }
  }
}
