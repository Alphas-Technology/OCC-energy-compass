
export default {
  generateHeaderTitle (title: string) {
    return {
      pageBreak: 'before',
      layout: 'noBorders',
      table: {
        widths: [368],
        body: [
          [{ text: title, bold: true, color: '#444444', margin: [22, 21, 22, 18], fontSize: 20 }]
        ]
      },
      alignment: 'left',
      margin: [25, -100, 0, 0]
    }
  }
}
