
export default {
  dashboard: {
    list: ['admin', 'customer', 'employee']
  },
  evaluation: {
    list: ['customer'],
    create: ['admin', 'customer', 'employee'],
    edit: ['admin', 'customer', 'employee'],
    show: ['admin', 'customer', 'employee'],
    answer: ['admin', 'customer', 'employee'],
    close: ['admin', 'customer', 'employee']
  },
  openQuestions: {
    listAll: ['admin'],
    list: ['admin', 'customer'],
    create: ['admin'],
    edit: ['admin'],
    show: ['admin']
  },
  productService: {
    list: ['admin', 'customer', 'employee'],
    create: ['admin', 'customer', 'employee'],
    edit: ['admin', 'customer', 'employee'],
    show: ['admin', 'customer', 'employee']
  },
  questionnaires: {
    listAll: ['admin'],
    list: ['admin', 'customer'],
    create: ['admin'],
    edit: ['admin'],
    show: ['admin']
  }
}
