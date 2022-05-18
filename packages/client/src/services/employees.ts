
import Services from './base-services'

const service = new Services('employees')

export default {
  listActive: () => {
    return service.suiteOperation(() => service.get('participants-list'))
  }
}
