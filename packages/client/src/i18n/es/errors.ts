
export default {
  apology: '¡Lo sentimos!',
  not_found: 'La página que busca no ha sido encontrada.',
  forbidden: 'Usted no está autorizado para acceder a esta información.',
  back_home: 'Volver al inicio',
  'auth/invalid-credentials': 'Los datos ingresados son incorrectos.',
  // tslint:disable-next-line:max-line-length
  'auth/user-is-disabled': 'El usuario ingresado se encuentra deshabilitado.<br/>Por favor comunicarse con el administrador.',
  'auth/employee-no-exist': 'Empleado no encontrado.',
  'auth/demo-request-exist': 'Ya existe una solitud de cuenta demo con el correo solicitado.',
  'validator/verify_fields': 'Por favor, verifique los campos del formulario.',
  'employees/enterprise-is-not-active': 'Esta empresa no se encuentra activa.',
  'validator/invalid-input': 'Uno o más campos no son válidos.',
  'validator/academicDegreeId-invalid-input': 'El campo nivel académico es obligatorio por corte demográfico.',
  'validator/countryId-invalid-input': 'El campo país es obligatorio por corte demográfico.',
  'validator/headquarterId-invalid-input': 'El campo sede es obligatorio por corte demográfico.',
  'validator/chargeId-invalid-input': 'El campo cargo es obligatorio por corte demográfico.',
  'validator/departmentId-invalid-input': 'El campo área/departamento es obligatorio por corte demográfico.',
  'validator/genderId-invalid-input': 'El campo género es obligatorio por corte demográfico.',
  'validator/jobTypeId-invalid-input': 'El campo tipo de contratación es obligatorio por corte demográfico.',
  'validator/birthdate-invalid-input': 'El campo fecha de nacimiento es obligatorio por corte demográfico.',
  'validator/admission-invalid-input': 'El campo fecha de ingreso es obligatorio por corte demográfico.',
  // tslint:disable-next-line:max-line-length
  'employees/identify-document-not-in-headers': 'La cabecera para el documento de identificación no está presente en el archivo.',
  'employees/missing-required-headers-in-csv': 'El archivo debe poseer todas las cabeceras obligatorias.',
  'employees/empty-fields': 'Todos los campos del formulario deben ser completados.',
  'employees/employee-already-exists': 'Este empleado ya existe.',
  'employees/employee-already-exists-another-enterprise': 'Este empleado ya existe en otra empresa.',
  'employees/employee-already-active-another-enterprise': 'Este empleado ya existe activo en otra empresa.',
  'email/unique:User,email,user_id': 'El correo especificado ya se encuentra en uso.',
  'validator/reminders': 'Solo puede seleccionar cinco recordatorios.',
  'validator/delete_reminder': 'No puede eliminar este recordatorio.',
  'engagements/token-not-found': 'El token suministrado no pudo encontrarse.',
  // tslint:disable-next-line:max-line-length
  'engagements/token-poll-completed': 'Esta encuesta ya fue completada.<br/><br/>Recuerde que, una vez finalizado el llenado de la encuesta, no es posible acceder otra vez a ella.',
  'engagements/poll-not-found': 'La encuesta solicitada no existe.<br/><br/>Verifique su token de acceso.',
  // tslint:disable-next-line:max-line-length
  'engagements/poll-has-ended': 'La encuesta solicitada finalizó.<br/><br/>Una vez alcanzada la fecha de finalización, no podrá acceder a la encuesta.',
  // tslint:disable-next-line:max-line-length
  'engagements/poll-employee-not-found': 'La encuesta a la que intenta acceder no existe.<br/><br/>Por favor verifique su participación e intente nuevamente.',
  'engagements/missing-questions': 'Todas las preguntas deben ser respondidas.',
  'engagements/missing-extra-questions': 'Todas las preguntas adicionales deben ser respondidas.',
  'pulses/token-not-found': 'El token suministrado no pudo encontrarse.',
  // tslint:disable-next-line:max-line-length
  'pulses/token-poll-completed': 'Esta encuesta ya fue completada.<br/><br/>Recuerde que, una vez finalizado el llenado de la encuesta, no es posible acceder otra vez a ella.',
  'pulses/poll-not-found': 'La encuesta solicitada no existe.<br/><br/>Verifique su token de acceso.',
  // tslint:disable-next-line:max-line-length
  'pulses/poll-has-ended': 'La encuesta solicitada finalizó.<br/><br/>Una vez alcanzada la fecha de finalización, no podrá acceder a la encuesta.',
  // tslint:disable-next-line:max-line-length
  'pulses/poll-employee-not-found': 'La encuesta a la que intenta acceder no existe.<br/><br/>Por favor verifique su participación e intente nuevamente.',
  'pulses/missing-extra-questions': 'Todas las preguntas adicionales deben ser respondidas.',
  undefined: 'Ha ocurrido un error en el sistema.',
  timezone: 'La hora seleccionada no es válida para esa zona horaria.',
  question_emply: 'La pregunta no puede estar vacía.',
  'validator/select_one': 'Seleccione al menos un idioma.',
  'validator/empty-field': 'El campo no puede estar vacío.',
  'validator/no_receivers': 'La encuesta debe poseer al menos un encuestado.',
  'image/size': 'El tamaño de la imagen debe ser inferior a 2MB.',
  employees_limit: 'Ya ha alcanzado el limite de colaboradores permitidos por su licencia.',
  engagements_limit: 'Ya ha alcanzado el limite de Engagement permitidos por su licencia.',
  pulses_limit: 'Ya ha alcanzado el limite de Pulses permitidos por su licencia.',
  modal_identify_type: 'Seleccione un tipo de identidad válida.',
  modal_identify_document: 'Ingrese un número de identificación válido.',
  modal_first_name: 'Ingrese un nombre válido.',
  modal_last_name: 'Ingrese un apellido válido.',
  modal_exists_email: 'El correo electrónico ingresado ya existe.',
  modal_user_not_employee: 'El correo electrónico ingresado existe como otro tipo de usuario',
  modal_exist_identification: 'El número de identificación ingresado ya existe.',
  modal_email: 'Ingrese un correo electrónico válido.',
  modal_gender: 'Seleccione un género válido.',
  modal_antiquity_range: 'Ingrese una fecha de ingreso válida.',
  modal_department: 'Seleccione un departamento válido.',
  modal_charge: 'Seleccione un cargo válido.',
  modal_job_type: 'Seleccione un tipo de contratación válida.',
  modal_age_range: 'Ingrese una fecha de nacimiento válida.',
  modal_country: 'Seleccione un país válido.',
  modal_headquarter: 'Seleccione una sede válida.',
  modal_academic_degree: 'Seleccione un nivel académico válido.',
  modal_validation_error: 'Quedan registros por corregir.',
  email_already_taken: 'El correo electrónico ingresado ya está en uso.',
  'groups/updated-plan-some': 'No se aplicó el cambio para todas las empresas.',
  'groups/updated-plan-none': 'No se aplicó el cambio debido a un error.',
  'video/size': 'El tamaño del video debe ser inferior a 20MB.',
  error_disable_questionnaires: 'No se pueden desactivar todos los cuestionarios',
  'auth/enterprise_disabled': 'La empresa solicitada se encuentra inactiva',
  'auth/employee_disabled': 'El empleado solicitado se encuentra inactivo',
  'auth/password-not-match': 'La contraseña actual es incorrecta',
  'auth/email-not-match': 'El correo actual es incorrecto',
  'auth/email-already-registered': 'El nuevo correo electronico ya se encuentra asignado a otro usuario',
  required_enterprise_p1: 'Para continuar debe seleccionar una empresa.',
  required_enterprise_p2: 'En breves momentos será redirigido a Suite.',
  error_select_dates: 'Debe seleccionar un rango de tiempo válido.',
  no_balance: 'Sin balance suficiente',
  no_balance_msg: 'Empresa sin balance suficiente, si continua el proceso, el sistema intentará consumir saldos autorizados.',
  invalid_service: 'Servicio inválido',
  invalid_evaluation: 'Valoración inválida',
  'demographic_report/001': 'No tiene tokens disponibles',
  'demographic_report/002': 'Id es requerido',
  'demographic_report/003': 'Debe tener por lo menos un corte demográfico',
  'demographic_report/004': 'No se encontraron resultados para la evaluación actual',
  'demographic_report/005': 'Error interno al consignar el reporte'
}
