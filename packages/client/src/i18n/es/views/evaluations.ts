
export default {
  list: {
    title: 'Valoraciones',
    btn_create: 'Crear Valoración',
    btn_link: 'Copiar enlace',
    btn_edit: 'Editar valoración',
    btn_details: 'Ver detalles',
    btn_report: 'Ver reportes',
    input_filter_by: 'Filtrar por',
    generic_link_btn: 'Enlace para Colaboradores sin Correo',
    table_name: 'Nombre',
    table_status: 'Estado',
    table_vigency: 'Vigencia',
    table_actions: 'Acciones',
    table_no_data: 'No hay valoraciones para mostrar',
    status_pending: 'Pendiente',
    status_in_progress: 'En progreso',
    status_completed: 'Completada',
    modal_invitation_url: 'Enlace de invitación',
    modal_url_copied: 'Enlace copiado',
    modal_copy_invitation_url_title: 'Enlace para colaboradores sin correo',
    modal_copy_invitation_url: 'Este enlace lo puedes copiar y enviar a los colaboradores que estén participando en la medición y no tengan correo electrónico o no les haya llegado el correo de invitación. Para poder responder la encuesta, los colaboradores deberán ingresar su documento de identidad con el cual se han cargado en la plataforma.',
    modal_link: 'Copiar enlace',
    modal_btn_close: 'Cerrar',
    may_take_while: 'Esta acción puede tardar unos minutos',
    msg_link_copied: 'Enlace copiado'
  },
  create: {
    title: 'Crear valoración',
    stepper_overview: 'Nombre de la encuesta',
    stepper_date: 'Fecha',
    stepper_questions: 'Preguntas',
    stepper_team: 'Equipo',
    stepper_revition: 'Revisión y personalización',
    stepper_btn_next: 'Siguiente',
    stepper_btn_back: 'Atrás',
    stepper_btn_cancel: 'Cancelar',
    stepper_btn_save: 'Guardar',
    stepper_btn_confirm_create: 'Confirmar y Crear',
    modal_confirm_create_title: 'Confirme la creación de la valoración',
    modal_workshop_cost: 'Costo de la valoración',
    total_receptors: 'Total de encuestados: {n}',
    msg_created_evaluation: 'Valoración creada satisfactoriamente'
  },
  stepOverview: {
    title: 'Nombre de la encuesta',
    input_name: 'Nombre',
    tooltip_input_name: 'Nombre interno de la valoración',
    want_external_name: '¿Desea colocar un nombre externo para los integrantes?',
    input_display_name: 'Nombre de muestra',
    tooltip_input_display_name: 'Nombre de muestra'
  },
  stepDate: {
    title: 'Fecha',
    date_delivery: 'Fecha de lanzamiento',
    poll_valid_until: 'Valoración válida hasta',
    hours_valid_until: 'Hora de cierre',
    time_zone: 'Zona horaria',
    want_send_reminders: '¿Desea enviar recordatorios?',
    reminders: 'Enviar recordatorio',
    invalid_reminder_date: 'La Fecha del Recordatorio debe estar dentro del período de lanzamiento',
    hours: 'Hora de lanzamiento',
    add: 'Agregar',
    trash: 'Borrar',
    the_reminders: 'Los recordatorios'
  },
  stepQuestion: {
    title: 'Preguntas',
    custom_questionnaire_info: 'Si usted desea modificar alguno de los enunciados de la encuesta podrá hacerlo, siempre y cuando se mantenga el modelo OCC POR. Por favor comuníquese a través de nuestro correo info@occsolutions.org',
    inputDownload: 'Descargar Cuestionario',
    questionnaire_e: 'Cuestionario POR',
    pdf_explained: 'Este archivo contiene las preguntas del cuestionario "{name}" agrupadas por dimensión.',
    questionnaire_title: 'OCC - Reporte POR',
    copyright: 'Copyright por OCC - Todos los derechos reservados',
    autoEvaluation: 'Autovaloración',
    generalEvaluation: 'Valoración del equipo'
  },
  stepEvaluatedSelection: {
    title: 'Equipo',
    want_massive: '¿Desea realizar la asignación de la valoración via carga masiva?',
    add_evaluated: 'Agregar integrante',
    select_file_to_upload: 'Selecciones archivo a subir',
    evaluatedExists: 'Hay integrantes en el archivo que ya se encuentran en el listado',
    incorrect_file: 'Por favor cargue un archivo valido',
    input_upload_file: 'Subir archivo',
    modal_del_title: 'Confirmar Borrado',
    modal_del_question: '¿Desea borrar este integrante?',
    input_trash: 'Borrar',
    min_evaluated: 'Se necesitan al menos dos(2) miembros para ser considerado un equipo',
    evaluatedTable: {
      team_members: 'Integrantes',
      actions: 'Acciones',
      eval_no_data: 'No hay integrantes para mostrar',
      input_trash: 'Borrar'
    },
    generateInstructive: {
      download_instructive: 'Descargar instructivo'
    },
    generateTemplate: {
      download_template: 'Descargar plantilla'
    },
    warningsDialog: {
      evaluated_not_found_warning: 'Los integrantes mostrados a continación no fueron encontrados como colaboradores de su empresa:',
      multiple_appears_warning: 'se ha repetido como evaluado, por lo cual se tomó en cuenta en su primera aparición y se ignoró en la o las siguientes',
      the_member: 'El integrante',
      warnings_list: 'Listado de advertencias',
      input_close: 'Cerrar'
    },
    addEvaluatorDialog: {
      add_evaluated: 'Agregar integrante',
      evaluated: 'Integrantes',
      input_cancel: 'Cancelar',
      input_save: 'Guardar'
    }
  },
  stepRevition: {
    poll_name: 'Nombre de la valoración',
    external_name: 'Nombre de muestra',
    date_delivery: 'Fecha de lanzamiento',
    poll_valid_until: 'Valoración válida hasta',
    time_zone: 'Zona horaria',
    send_reminders: 'Envio de recordatorios',
    questionnaire: 'Cuestionario',
    paid_measuring: 'La valoración ya ha sido pagada.',
    workshop_cost: 'Costo de la valoración para {members} integrantes',
    personalization: 'Personalización de correos electrónicos',
    poll_invitation: 'Invitación a la valoración',
    reminder_mail: 'Correo de recordatorio',
    tk_message: 'Mensaje de agradecimiento',
    message_subject: 'Asunto del mensaje',
    body_message: 'Cuerpo del mensaje',
    input_preview: 'Previsualización',
    fileExistNote: 'Para sustituir el archivo adjunto no es necesario eliminar el anterior.',
    input_select_video: 'Seleccionar video',
    fileExist: 'Video adjunto',
    token_unit: 'OCC Tokens',
    team: 'Equipo',
    team_members: 'Integrantes',
    deleteFile: 'Eliminar archivo',
    custom_msg: '<p>Bienvenido a la valoración POR la cual recoge las percepciones sobre del trabajo en equipo con su auto-percepción. Esta información permite tener un panorama completo sobre el equipo y el impacto que está generando en su entorno laboral.</p>' +
    '<p>Ésta es una encuesta de percepción; ninguna pregunta tiene respuesta correcta o incorrecta. Su <b>sinceridad y franqueza</b> son fundamentales para que los resultados sean útiles. <b>Sus respuestas son totalmente confidenciales.</b></p>' +
    '<p>Información clave sobre esta encuesta:</p>' +
    '<p>La información entregada será manejada de manera <b>confidencial</b> y será utilizada con fines estadísticos.</p>' +
    '<p>Para una mejor experiencia use <b>Google Chrome,</b> recuerde que debe estar conectado a Internet.</p>' +
    '<p>Si tiene alguna duda o evidencia algún problema con la encuesta por favor no dude en contactarnos en el correo: <a href="mailto:info@occsolutions.org">info@occsolutions.org</a>.</p>' +
    '<p>Recuerde que <b>este link es personal</b> y no se debe compartir.</p>' +
    '<p>De antemano le agradecemos por su tiempo en este importante proceso.</p>',
    custom_reminder: '<p>Le recordamos que tiene pendiente la valoración de liderazgo POR. Su opinión es muy importante en este proceso. Queremos recordarle que:</p>' +
      '<p>Ésta es una encuesta de percepción; ninguna pregunta tiene respuesta correcta o incorrecta. Su <b>sinceridad y franqueza</b> son fundamentales para que los resultados sean útiles. <b>Sus respuestas son totalmente confidenciales.</b></p>' +
      '<p>Información clave sobre esta encuesta:</p>' +
      '<p>La información entregada será manejada de manera <b>confidencial</b> y será utilizada con fines estadísticos.</p>' +
      '<p>Para una mejor experiencia use <b>Google Chrome,</b> recuerde que debe estar conectado a Internet.</p>' +
      '<p>Si tiene alguna duda o evidencia algún problema con la encuesta por favor no dude en contactarnos en el correo: <b><a href="mailto:info@occsolutions.org">info@occsolutions.org</a>.</b></p>' +
      '<p>Recuerde que <b>este link es personal</b> y no se debe compartir.</p>' +
      '<p><b>De antemano le agradecemos por su tiempo en este importante proceso.</b></p>',
    previewEmail: {
      subject: 'Asunto',
      hello: 'Hola',
      link_to_poll: 'El siguiente enlace le enviará hacia la encuesta',
      click_here: 'click aquí',
      por_team_members_info: 'En la siguiente tabla se listan todos los integrantes del equipo a valorar',
      por_team_members: 'Integrantes del equipo',
      attached_video: 'Vídeo adjunto',
      rights_reserved: 'Todos los derechos reservados 2020',
      sent_automatic: 'Este mensaje fue automáticamente enviado desde',
      support: 'Por favor no responda directamente a este correo. Las respuestas llegarán a un buzón automatizado y no nos será posible leer o contestar su correo. Para ponerse en contacto con nosotros envíe un correo a'
    }
  },
  edit: {
    title: 'Editar valoración',
    confirm_edit_title: 'Confirme la edición de la valoración<br/>Nuevos integrantes',
    diff_cost: 'Costo de la diferencia',
    updated_evaluation: 'Valoración actualizada exitosamente',
    stepper_overview: 'Nombre de la encuesta',
    stepper_date: 'Fecha',
    stepper_questions: 'Preguntas',
    stepper_team: 'Equipo',
    stepper_revition: 'Revisión y personalización',
    stepper_btn_next: 'Siguiente',
    stepper_btn_back: 'Atrás',
    stepper_btn_cancel: 'Cancelar',
    stepper_btn_update: 'Actualizar'
  },
  show: {
    evaluation: 'Valoración POR',
    options: 'Opciones',
    generate_report: 'Generar reportes',
    edit: 'Editar valoración',
    sending_reminders: 'Enviar recordatorios',
    close_evaluation: 'Cerrar valoración',
    close_evaluation_q: '¿Desea cerrar la valoración?',
    total: 'Total',
    pending_evaluations: 'Pendientes',
    finished_evaluations: 'Completadas',
    of_polls: 'de encuestas',
    date_delivery: 'Fecha de lanzamiento',
    poll_valid_until: 'Valoración válida hasta',
    scheduled_reminders: 'Recordatorios programados',
    no_reminders: 'Sin recordatorios programados',
    completed: 'Completada',
    send_reminders: 'Envio de recordatorios',
    send_reminders_q: '¿Desea enviar recordatorios?',
    reminders_sent_succesfully: 'Recordatorios enviados correctamente',
    evaluation_closed_succesfully: 'Valoración cerrada correctamente',
    team: 'Equipo',
    team_members: 'Integrantes',
    status_pending: 'Pendiente',
    status_in_progress: 'En progreso',
    status_completed: 'Completada',
    input_confirm: 'Confirmar',
    download_reports: 'Descargar Reportes',
    modal_title: 'Participación de los integrantes del equipo',
    modal_info: 'A continuación se muestra una explicación del estado de la participación de los integrantes del equipo según un color representativo',
    modal_chip_default: 'No han iniciado o ingresado a responder la valoración',
    modal_chip_info: 'Ha ingresado a responder la valoración',
    modal_chip_success: 'Ha finalizado de responder la valoración',
    modal_input_close: 'Cerrar'
  },
  evaluation: {
    evaluate: 'Integrante',
    information: 'Bienvenido(a) a la encuesta para valoración de trabajo en equipo con el modelo POR® (Personas, Organización y Resultados).',
    information_2: 'La valoración está compuesta por una serie comportamientos y conductas relacionadas con las competencias y valores del Modelo POR, sobre las cuales cada evaluador califica la frecuencia entre 1 y 6 de acuerdo a la siguiente escala:',
    information_3: 'Puede visualizar está y más información haciendo click en el botón de progreso, ubicado en el inferior derecho de la página',
    score_label1: 'Nunca',
    score_label2: 'Casi nunca',
    score_label3: 'Ocasionalmente',
    score_label4: 'Con frecuencia',
    score_label5: 'Casi siempre',
    score_label6: 'Siempre',
    confirmation_modal_title: 'Guardar respuestas',
    confirmation_modal_des: 'Asegúrese de verificar sus respuestas, ya que una vez guardadas no se pueden modificar',
    expiration_date: 'La encuesta a la que se está intentando ingresar ha terminado',
    wellcome_instructions: 'Recuerde, para obtener resultados fieles a la realidad asegúrese de estar respondiendo de forma sincera. Su valoración no es ni buena ni mala, se trata de encontrar el valor que refleje con mayor fidelidad a la realidad. Confiamos en su criterio y sinceridad. Asegúrese de leer adecuadamente la información. El plazo máximo para completar la encuesta es: {deadline}',
    end: 'Muchas gracias por tu participación. Has completado la encuesta satisfactoriamente.',
    middle: '¡Muy Bien! ¡Ya has completado la mitad del proceso, mantente atento a cada pregunta!',
    invalid_token: 'No existe encuesta para este acceso, por favor coloque uno válido',
    before_date: 'La encuesta no se encuentra disponible para la fecha actual',
    not_available: 'La encuesta no se encuentra disponible en estos momentos',
    evaluation_completed: 'Ya has completado esta encuesta.',
    columm_auto_info: 'Las preguntas en esta columna se representan en primera persona y refieren a tu autoevaluación',
    columm_team_info: 'Las preguntas en esta columna se representan en tercera persona y refieren a la valoración del equipo',
    input_save: 'Guardar',
    input_back: 'Atras',
    input_next: 'Siguiente',
    wellcomeDialog: {
      wellcome_title: 'Bienvenido a la valoración POR.',
      wellcome_instructions: 'Bienvenido(a) a la encuesta para valoración de trabajo en equipo con el modelo POR® (Personas, Organización y Resultados).' +
      '<br/><br/>A continuación encontrará 45 enunciados de conductas que debe tener un equipo de alto desempeño dentro de una organización. Para cada una de estas conductas, por favor indique como considera que usted (primera columna) y el equipo (segunda columna) actúan.' +
      '<br/><br/>Califique todas las conductas utilizando una escala de 1 a 6, donde: (1) Nunca, (2) Casi nunca, (3) Ocasionalmente, (4) Con frecuencia, (5) Casi siempre, (6) Siempre.' +
      '<br/><br/>Recuerde, para obtener resultados fieles a la realidad asegúrese de estar respondiendo de forma sincera. Su valoración no es ni buena ni mala, se trata de encontrar el valor que refleje con mayor fidelidad a la realidad. Confiamos en su criterio y sinceridad. Asegúrese de leer adecuadamente la información. El plazo máximo para completar la encuesta es: {deadline}',
      input_start_poll: 'Comenzar valoración'
    },
    middleDialog: {
      middle: '¡Muy Bien! ¡Ya has completado la mitad del proceso, mantente atento a cada pregunta!',
      input_continue: 'Continuar'
    },
    helpDialog: {
      tab_help: 'Información',
      tab_progress: 'Progreso',
      tab_team: 'Equipo',
      info: 'La valoración está compuesta por una serie comportamientos y conductas relacionadas con las competencias y valores del Modelo POR, sobre las cuales cada evaluador califica la frecuencia entre 1 y 6 de acuerdo a la siguiente escala:',
      score_label1: 'Nunca',
      score_label2: 'Casi nunca',
      score_label3: 'Ocasionalmente',
      score_label4: 'Con frecuencia',
      score_label5: 'Casi siempre',
      score_label6: 'Siempre',
      input_continue: 'Continuar',
      progress_auto_info: 'Progreso de respuestas por autoevaluación',
      progress_team_info: 'Progreso de respuestas por valoración al equipo',
      progress_info: 'Progreso de respuestas general',
      members_info: 'Integrantes del equipo'
    }
  },
  report: {
    no_answers_modal_msg: 'La encuesta actual no posee respuestas, por lo cual no será posible generar un reporte.',
    select_report_type: 'Seleccione el tipo de reporte que desea generar',
    required_general_title: 'Reporte Organizacional',
    required_general_desc: 'Este reporte muestra los resultados de la apreciación de todos los integrantes del equipo con respecto al mismo.',
    no_members: 'No hubo participación de los miembros',
    general_report: 'Generar reporte',
    individual_title: 'Reportes individuales',
    individual_desc: 'Cada reporte cuenta con los resultados de la valoración realizada por cada miembro del equipo.',
    header_members: 'Integrantes',
    header_action: 'Acción',
    input_back: 'Atras',
    input_accept: 'Aceptar'
  }
}
