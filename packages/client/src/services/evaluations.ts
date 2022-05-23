
import mapParameters from '../utils/map-parameters'
import Services from './base-services'

const service = new Services('evaluations')

interface IOptionsList {
  page?: number;
  itemsPerPage?: number;
  filter?: string;
  search?: string;
}

export default {
  list: (options: IOptionsList) => {
    const params = mapParameters({
      page: options && options.page ? options.page : null,
      rowsPerPage: options && options.itemsPerPage ? options.itemsPerPage : null,
      filter: options && options.filter ? options.filter : null,
      search: options && options.search ? options.search : null
    })
    return service.get('list', params)
  },
  create: (evaluation: any) => {
    return service.post('create', { evaluation })
  },
  sendInvitationFiles: (id: string, file: object) => {
    return service.form(`upload-invitation-file/${id}`, file)
  },
  sendReminderFiles: (id: string, file: object) => {
    return service.form(`upload-reminder-file/${id}`, file)
  },
  getOneToEdit: (slug: string) => {
    return service.get(`get-one-to-edit/${slug}`)
  },
  getOneToShow: (slug: string) => {
    return service.get(`get-one-to-show/${slug}`)
  },
  getOne: (slug: string) => {
    return service.get(`get-one/${slug}`)
  },
  getCountEvaluated: (slug: string) => {
    return service.get(`get-count-evaluated/${slug}`)
  },
  findByTokenId: (tokenId: string) => {
    return service.get(`find-by-token-id/${tokenId}`)
  },
  findById: (id: string) => {
    return service.get(`find-by-id/${id}`)
  },
  findByIdToReport: (id: string) => {
    return service.get(`find-by-id-to-report/${id}`)
  },
  openReportOneById: (id: number) => {
    return service.post(`open-report/${id}`)
  },
  openReportIndividualOneById: (id: number, evaluatedId: number) => {
    return service.post(`open-report-individual/${id}`, { evaluatedId })
  },
  currentThreadsById: (id: number) => {
    return service.get(`current-threads/${id}`)
  },
  getOneReportByThreadId: (id: number, pollId: number) => {
    return service.post(`open-thread-report/${id}`, { id: pollId })
  },
  edit: (slug: string, evaluation: any) => {
    return service.post(`edit/${slug}`, { evaluation })
  },
  toggle: (slug: string, active: boolean) => {
    return service.post(`toggle/${slug}`, { active })
  },
  updateInfo: (slug: string, evaluation: any) => {
    return service.post(`update-info/${slug}`, { evaluation })
  },
  massiveUpload: (file: File) => {
    return service.form('massive-upload', { file: file })
  },
  generateTemplate: () => {
    return service.get('generate-template')
  },
  updateEvaluator: (tokenId: string, answersDimention: any) => {
    return service.put('update-evaluator', { tokenId, data: answersDimention })
  },
  setAnswersDimention: (tokenId: string, answersDimention: any) => {
    return service.put('set-answersDimention', { tokenId: tokenId, data: answersDimention })
  },
  updateAnswersDimention: (tokenId: string, dimention: string, attribute: string, behavior: string, scoreKey: string, scoreValue: number) => {
    return service.put('update-answersDimention', { tokenId: tokenId, path: `${dimention}.${attribute}.${behavior}.${scoreKey}`, score: scoreValue })
  },
  updateEvaluation: (tokenId: string, answersDimention: object) => {
    return service.put('update-evaluation', { tokenId, answersDimention })
  },
  sendReminders: (slug: string) => {
    return service.post('send-reminders', { slug })
  },
  closeEvaluation: (slug: string) => {
    return service.get(`close/${slug}`)
  },
  checkBalance: (key: string) => {
    return service.get(`check-balance/${key}`)
  }
}
