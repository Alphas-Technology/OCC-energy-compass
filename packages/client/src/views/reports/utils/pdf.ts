
export default {
  generateHeaderTitle (title: string, isToc = true) {
    return {
      pageBreak: 'before',
      layout: 'noBorders',
      table: {
        widths: [368, 0],
        body: [
          [
            { text: title, bold: true, color: '#444444', margin: [22, 21, 22, 18], fontSize: 20 },
            // ToC text
            isToc ? { text: title, fontSize: 0, tocItem: 'mainToc', tocMargin: [0, 8, 0, 0] } : {}
          ]
        ]
      },
      alignment: 'left',
      margin: [25, -100, 0, 0]
    }
  }
}
