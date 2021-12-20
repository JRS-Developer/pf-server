const actions = [
  { id:'30fe307d-363c-46d3-8cf5-184254e45198', name: 'Nuevo', onclick: 'handleClickOpen', action_param: 'add', icon: 'add_circle' },
  { id:'318caf13-5c64-4aec-91fb-26abca03c348', name: 'Editar', onclick: 'handleClickOpen', action_param: 'edit', icon: 'edit' },
  { id:'f33c5435-9cb2-4d18-8530-e37f28fd231d', name: 'Eliminar', onclick: 'handleOpenConfirm', action_param: 'delete', icon: 'delete' },
  {id: '94a37cc3-7ac3-4b2f-8020-2bd8ef4af9b5', name: 'Asignar Accesos', onclick: 'handleClickOpen', action_param: 'access', icon: 'admin_panel_settings'}
];

const modules = [
  { id:'c9e0712e-c2f3-4891-93dc-4d89c60bfc91', name: 'SEGURIDAD', url: '#', icon: '', module_id: 0 },
  { id:'348ced4b-96d5-4cfd-ba01-14312dc23751', name: 'Roles', url: '/roles', icon: 'account_circle', module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91' },
  { id:'d63411ce-54ef-4671-ba83-6e1db5bb7750', name: 'Usuarios', url: '/users', icon: 'people', module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91' },
  { id:'313630df-4951-42df-860e-6ec7ad857f4f', name: 'Acciones', url: '/actions', icon: 'format_list_bulleted', module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91' },
  { id:'7a42cf94-db4f-41e6-9a2d-3fa497608bf5', name: 'Módulos', url: '/modules', icon: 'recent_actors', module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91' },
  { id:'cc2b3043-a35d-425e-963a-b4936e91c6c8', name: 'COMUNICACIÓN', url: '#', icon: '', module_id: 0 },
  { id:'9c137ea3-5958-47c9-bd91-91766d322141', name: 'Noticias', url: '/noticias', icon: 'campaign', module_id: 'cc2b3043-a35d-425e-963a-b4936e91c6c8' },
  { id:'d544b900-a077-483e-b335-8a52c2fde399', name: 'AULA VIRTUAL', url: '#', icon: '', module_id: 0 },
  { id:'4c8f8e25-63e5-46b4-b11d-309ff6666e11', name: 'Materias', url: '/materias', icon: 'text_snippet', module_id: 'd544b900-a077-483e-b335-8a52c2fde399' },
  { id:'45388d9e-23c1-4c01-96de-7270769ce278', name: 'Classroom', url: '/classroom', icon: 'school', module_id: 'd544b900-a077-483e-b335-8a52c2fde399' },
  { id:'6d74b4b0-473a-48ed-97cf-154e53cd92c5', name: 'ADMINISTRACION', url: '#', icon: '', module_id: 0 },
  { id:'2a3f2402-3559-42ae-a9f7-b467df3a6b10', name: 'Matrículas', url: '/matriculas', icon: 'note_alt', module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5' },
  { id:'c68b6501-ff66-4ed9-ade4-380bfc3f548f', name: 'School', url: '/schools', icon: 'apartment', module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5' },
  { id:'6a0ecd53-8566-48ae-89c4-c9dbbf647091', name: 'Alumnos', url: '/students', icon: 'people', module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5' },
  { id:'cebc1da6-3402-4d58-844e-2407b189c826', name: 'Clases', url: '/class', icon: 'people', module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5' },
  { id:'"f3e55d08-c004-4340-8f79-bcaf4b37608d"', name: 'Ciclo Lectivo', url: '/ciclo-lectivo', icon: 'event', module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5' },

];

module.exports = {
  modules,
  actions
}
