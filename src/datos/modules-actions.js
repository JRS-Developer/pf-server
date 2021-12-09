const modules = [
  { name: 'SEGURIDAD', url: '#', icon: '', module_id: '' },
  { name: 'Roles', url: '/roles', icon: 'account_circle', module_id: '' },
  { name: 'Usuarios', url: '/users', icon: 'people', module_id: '' },
  { name: 'Acciones', url: '/actions', icon: 'format_list_bulleted', module_id: '' },
  { name: 'Módulos', url: '/modules', icon: 'recent_actors', module_id: '' },
  { name: 'COMUNICACIÓN', url: '#', icon: '', module_id: '' },
  { name: 'Noticias', url: '/noticias', icon: 'campaign', module_id: '' },
  { name: 'AULA VIRTUAL', url: '#', icon: '', module_id: '' },
  { name: 'Materias', url: '/materias', icon: 'text_snippet', module_id: '' },
];

const actions = [
  { name: 'Nuevo', onclick: 'handleClickOpen', action_param: 'add', icon: 'add_circle' },
  { name: 'Editar', onclick: 'handleClickOpen', action_param: 'edit', icon: 'edit' },
  { name: 'Eliminar', onclick: 'handleOpenConfirm', action_param: '', icon: 'delete' },
];

module.exports = {
  modules,
  actions
}