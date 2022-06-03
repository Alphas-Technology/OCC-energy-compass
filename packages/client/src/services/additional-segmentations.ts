
import Services from './base-services'

const service = new Services('additional-segmentation')

export default {
  list: () => {
    return service.suiteOperation(() => service.get('list-by-enterprise'))
  },
  listActive: () => {
    return service.suiteOperation(() => service.get('list-active-by-enterprise'))
  },
  saveEmployeeDetail: (detailId: number, employeeEnterpriseId: number) => {
    return service.suiteOperation(() => service.put(`save-employee-detail/${detailId}/${employeeEnterpriseId}`))
  }
}
