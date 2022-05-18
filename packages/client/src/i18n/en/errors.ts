
export default {
  apology: '¡We are sorry!',
  not_found: 'The page you are looking for has not been found.',
  forbidden: 'You are not authorized to access this information.',
  back_home: 'Back to home',
  'auth/invalid-credentials': 'Los datos ingresados son incorrectos.',
  // tslint:disable-next-line:max-line-length
  'auth/user-is-disabled': 'User disabled. Please contact the system administrator.',
  'auth/employee-no-exist': 'Employee not found',
  'auth/demo-request-exist': 'There is already a demo account request with the requested email.',
  'validator/verify_fields': 'Please, verify the form fields.',
  'employees/enterprise-is-not-active': 'This enterprise is not active.',
  'validator/invalid-input': 'One or more fields are not valid.',
  'validator/academicDegreeId-invalid-input': 'The academic title field is mandatory by demographic item.',
  'validator/countryId-invalid-input': 'The contry field is mandatory by demographic item.',
  'validator/headquarterId-invalid-input': 'The headquarter field is mandatory by demographic item.',
  'validator/chargeId-invalid-input': 'The charge field is mandatory by demographic item.',
  'validator/departmentId-invalid-input': 'The department field is mandatory by demographic item.',
  'validator/genderId-invalid-input': 'The gender field is mandatory by demographic item.',
  'validator/jobTypeId-invalid-input': 'The job type field is mandatory by demographic item.',
  'validator/birthdate-invalid-input': 'The birthdate field is mandatory by demographic item.',
  'validator/admission-invalid-input': 'The admission field is mandatory by demographic item.',
  // tslint:disable-next-line:max-line-length
  'employees/identify-document-not-in-headers': 'The identify document header is not present in the file.',
  'employees/missing-required-headers-in-csv': 'The file must have all of the required headers.',
  'employees/empty-fields': 'All the form fields must be fullfiled.',
  'email/unique:User,email,user_id': 'The specified e-mail address is already in use.',
  'employees/employee-already-exists': 'This employee already exists.',
  'employees/employee-already-exists-another-enterprise': 'This employee already exists in other enterprise.',
  'employees/employee-already-active-another-enterprise': 'This employee exists and is active in other enterprise.',
  'validator/reminders': 'You can only select five reminders.',
  'validator/delete_reminder': 'No puede eliminar este recordatorio.',
  'engagements/token-not-found': 'The token provided could not be found.',
  // tslint:disable-next-line:max-line-length
  'engagements/token-poll-completed': 'This poll its already completed.<br/><br/>Rememberd that once the poll has been filled it is not possible to access to it again.',
  'engagements/poll-not-found': 'The requested poll does not exists.<br/><br/>Verify your access token.',
  // tslint:disable-next-line:max-line-length
  'engagements/poll-has-ended': 'The requested poll has ended.<br/><br/>Once the deadline date has been reached you won\'t be able to access it.',
  // tslint:disable-next-line:max-line-length
  'engagements/poll-employee-not-found': 'The survey you are trying to access does not exist.<br/><br/>Please verify your participation and try again.',
  'engagements/missing-questions': 'All questions must be answered.',
  'engagements/missing-extra-questions': 'All the additional questions must be answered.',
  // tslint:disable-next-line:max-line-length
  'pulses/token-poll-completed': 'This poll its already completed.<br/><br/>Rememberd that once the poll has been filled it is not possible to access to it again.',
  'pulses/poll-not-found': 'The requested poll does not exists.<br/><br/>Verify your access token.',
  // tslint:disable-next-line:max-line-length
  'pulses/poll-has-ended': 'The requested poll has ended.<br/><br/>Once the deadline date has been reached you won\'t be able to access it.',
  // tslint:disable-next-line:max-line-length
  'pulses/poll-employee-not-found': 'The survey you are trying to access does not exist.<br/><br/>Please verify your participation and try again.',
  'pulses/missing-extra-questions': 'All the additional questions must be answered.',
  undefined: 'An error has ocurred in the system.',
  timezone: 'The selected time is not valid for that time zone.',
  question_emply: 'The question can\'t be emply',
  'validator/select_one': 'Select one lenguage',
  'validator/empty-field': 'The field cannot be empty.',
  'validator/no_receivers': 'The poll must have at least one recipient',
  'image/size': 'Image size must be less than 2MB',
  employees_limit: 'You have already reached the limit of employees allowed by your license.',
  engagements_limit: 'You have already reached the limit of Engagement allowed by your license.',
  pulses_limit: 'You have already reached the limit of Pulses allowed by your license.',
  modal_identify_type: 'Select a valid identity type',
  modal_identify_document: 'Enter a valid identity number',
  modal_first_name: 'Enter a valid first name',
  modal_last_name: 'Enter a valid last name',
  modal_exists_email: 'Entered email already exists',
  modal_user_not_employee: 'Entered email exists as another type of user',
  modal_exist_identification: 'Entered identification number already exists.',
  modal_email: 'Enter a valid email',
  modal_gender: 'Select a valid gender',
  modal_antiquity_range: 'Enter a valid entry date',
  modal_department: 'Select a valid department',
  modal_charge: 'Select a valid charge',
  modal_job_type: 'Select a valid job type',
  modal_age_range: 'Enter a valid birth date',
  modal_country: 'Select a valid country',
  modal_headquarter: 'Select a valid headquarter',
  modal_academic_degree: 'Select a valid academic degree',
  modal_validation_error: 'There are still records to fix',
  email_already_taken: 'The email has been alreade taken',
  'groups/updated-plan-some': 'This change was not applied to all enterprises',
  'groups/updated-plan-none': 'This change was not applied due to errors',
  'video/size': 'Video size must be less than 20MB',
  error_disable_questionnaires: 'You cannot disable all the questionnaries',
  'auth/enterprise_disabled': 'The requested enterpise is not active',
  'auth/employee_disabled': 'The requested employee is not active',
  required_enterprise_p1: 'To continue you must select a company.',
  required_enterprise_p2: 'In a few moments you will be redirected to Suite.',
  error_select_dates: 'You must select a valid time range.',
  no_balance: 'Without sufficient balance',
  no_balance_msg: 'Enterprise without sufficient balance, if the process continues, the system will attempt to consume authorized balances.',
  invalid_service: 'Invalid service',
  invalid_evaluation: 'Invalid evaluation',
  'demographic_report/001': 'You dont have available tokens',
  'demographic_report/002': 'Id is required',
  'demographic_report/003': 'You must have at least a demographic cut',
  'demographic_report/004': 'No results found for the current evaluation',
  'demographic_report/005': 'Internal error when reporting the report'
}
