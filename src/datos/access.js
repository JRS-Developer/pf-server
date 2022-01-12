const { users } = require('./users')

function userIdsByRole(role) {
  const array = users
    .filter((user) => user.roleId === role)
    .map((user) => user.id)
  return array
}

function setUserAccesses(filteredUserIdsByRole, accessesToSet) {
  const dataAccess = []
  filteredUserIdsByRole.forEach((user) => {
    accessesToSet.forEach((element) => {
      element.user_id = user
      dataAccess.push({
        user_id: element.user_id,
        module_id: element.module_id,
        action_id: element.action_id,
      })
    })
  })
  return dataAccess
}

const sUsers = userIdsByRole('a83af560-8a48-4edd-83eb-6bd3f7e97861')
const alumnos = userIdsByRole('5d3709ba-3a27-48cc-8a75-256338684cee')
const administrativo = userIdsByRole('633c2cda-d0f1-40f8-b07c-041a8cc217be')
const profesores = userIdsByRole('606c0802-5332-4531-9189-eac84e6fcceb')

const sUserAccess = [
  //Seguridad (MODULO PADRE)
  { module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91', action_id: null },
  //  Roles
  {
    module_id: '348ced4b-96d5-4cfd-ba01-14312dc23751',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '348ced4b-96d5-4cfd-ba01-14312dc23751',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '348ced4b-96d5-4cfd-ba01-14312dc23751',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Usuarios
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: '94a37cc3-7ac3-4b2f-8020-2bd8ef4af9b5',
  },
  //  Acciones
  {
    module_id: '313630df-4951-42df-860e-6ec7ad857f4f',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '313630df-4951-42df-860e-6ec7ad857f4f',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '313630df-4951-42df-860e-6ec7ad857f4f',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Módulos
  {
    module_id: '7a42cf94-db4f-41e6-9a2d-3fa497608bf5',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '7a42cf94-db4f-41e6-9a2d-3fa497608bf5',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '7a42cf94-db4f-41e6-9a2d-3fa497608bf5',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //Comunicación (Módulo Padre)
  { module_id: 'cc2b3043-a35d-425e-963a-b4936e91c6c8', action_id: null },
  //  Noticias
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //Aula Virtual (Módulo Padre)
  { module_id: 'd544b900-a077-483e-b335-8a52c2fde399', action_id: null },
  //  Materias
  {
    module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Classroom
  {
    module_id: '45388d9e-23c1-4c01-96de-7270769ce278',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '45388d9e-23c1-4c01-96de-7270769ce278',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '45388d9e-23c1-4c01-96de-7270769ce278',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //Administracion (Módulo Padre)
  { module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5', action_id: null },
  //  Matriculas
  {
    module_id: '2a3f2402-3559-42ae-a9f7-b467df3a6b10',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '2a3f2402-3559-42ae-a9f7-b467df3a6b10',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '2a3f2402-3559-42ae-a9f7-b467df3a6b10',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  School
  {
    module_id: 'c68b6501-ff66-4ed9-ade4-380bfc3f548f',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'c68b6501-ff66-4ed9-ade4-380bfc3f548f',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'c68b6501-ff66-4ed9-ade4-380bfc3f548f',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Alumnos
  {
    module_id: '6a0ecd53-8566-48ae-89c4-c9dbbf647091',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  //  Clases
  {
    module_id: 'cebc1da6-3402-4d58-844e-2407b189c826',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'cebc1da6-3402-4d58-844e-2407b189c826',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'cebc1da6-3402-4d58-844e-2407b189c826',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Ciclo Lectivo
  {
    module_id: 'f3e55d08-c004-4340-8f79-bcaf4b37608d',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'f3e55d08-c004-4340-8f79-bcaf4b37608d',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'f3e55d08-c004-4340-8f79-bcaf4b37608d',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  // Asignar Materias
  {
    module_id: '92d8947d-42d8-4db9-a732-529a9532b2e6',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '92d8947d-42d8-4db9-a732-529a9532b2e6',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '92d8947d-42d8-4db9-a732-529a9532b2e6',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
]

const adminAccess = [
  //Seguridad (MODULO PADRE)
  { module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91', action_id: null },

  //  Usuarios
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  {
    module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
    action_id: '94a37cc3-7ac3-4b2f-8020-2bd8ef4af9b5',
  },
  //Comunicación (Módulo Padre)
  { module_id: 'cc2b3043-a35d-425e-963a-b4936e91c6c8', action_id: null },
  //  Noticias
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '0c377e51-7c25-41f0-9a25-8cf2b0e6b048',
  },
  //Aula Virtual (Módulo Padre)
  { module_id: 'd544b900-a077-483e-b335-8a52c2fde399', action_id: null },
  //  Materias
  {
    module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //Administracion (Módulo Padre)
  { module_id: '6d74b4b0-473a-48ed-97cf-154e53cd92c5', action_id: null },
  //  Matriculas
  {
    module_id: '2a3f2402-3559-42ae-a9f7-b467df3a6b10',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '2a3f2402-3559-42ae-a9f7-b467df3a6b10',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '2a3f2402-3559-42ae-a9f7-b467df3a6b10',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  School
  {
    module_id: 'c68b6501-ff66-4ed9-ade4-380bfc3f548f',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'c68b6501-ff66-4ed9-ade4-380bfc3f548f',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'c68b6501-ff66-4ed9-ade4-380bfc3f548f',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Alumnos
  {
    module_id: '6a0ecd53-8566-48ae-89c4-c9dbbf647091',
    action_id: '0c377e51-7c25-41f0-9a25-8cf2b0e6b048',
  },
  //  Clases
  {
    module_id: 'cebc1da6-3402-4d58-844e-2407b189c826',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'cebc1da6-3402-4d58-844e-2407b189c826',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'cebc1da6-3402-4d58-844e-2407b189c826',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  //  Ciclo Lectivo
  {
    module_id: 'f3e55d08-c004-4340-8f79-bcaf4b37608d',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'f3e55d08-c004-4340-8f79-bcaf4b37608d',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'f3e55d08-c004-4340-8f79-bcaf4b37608d',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
  // Asignar Materias
  {
    module_id: '92d8947d-42d8-4db9-a732-529a9532b2e6',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: '92d8947d-42d8-4db9-a732-529a9532b2e6',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: '92d8947d-42d8-4db9-a732-529a9532b2e6',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
]

const alumnosAccess = [
  //Comunicación (Módulo Padre)
  { module_id: 'cc2b3043-a35d-425e-963a-b4936e91c6c8', action_id: null },
  //  Noticias
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '0c377e51-7c25-41f0-9a25-8cf2b0e6b048',
  },
  //Aula Virtual (Módulo Padre)
  { module_id: 'd544b900-a077-483e-b335-8a52c2fde399', action_id: null },
  //  Classroom
  {
    module_id: '45388d9e-23c1-4c01-96de-7270769ce278',
    action_id: '0c377e51-7c25-41f0-9a25-8cf2b0e6b048',
  },
]

const profesoresAccess = [
  //Comunicación (Módulo Padre)
  { module_id: 'cc2b3043-a35d-425e-963a-b4936e91c6c8', action_id: null },
  //  Noticias
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141', //action ver
    action_id: '0c377e51-7c25-41f0-9a25-8cf2b0e6b048',
  },
  {
    module_id: '9c137ea3-5958-47c9-bd91-91766d322141',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348', //action editar
  },
  //Aula Virtual (Módulo Padre)
  { module_id: 'd544b900-a077-483e-b335-8a52c2fde399', action_id: null },
  //  Classroom
  {
    module_id: 'b3602ada-16bf-44b4-8c24-2a35a5539c58',
    action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  },
  {
    module_id: 'b3602ada-16bf-44b4-8c24-2a35a5539c58',
    action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  },
  {
    module_id: 'b3602ada-16bf-44b4-8c24-2a35a5539c58',
    action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  },
]

const access = [
  /*ROL TUTOR => CLASSROM*/
  //Aula Virtual (Módulo Padre)
  // {
  //   user_id: '2e9e4070-2d42-41ed-8c6b-a018f40c7757',
  //   module_id: 'd544b900-a077-483e-b335-8a52c2fde399',
  //   action_id: null,
  // },
  // //Materias
  // {
  //   user_id: '2e9e4070-2d42-41ed-8c6b-a018f40c7757',
  //   module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
  //   action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  // },
  // {
  //   user_id: '2e9e4070-2d42-41ed-8c6b-a018f40c7757',
  //   module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
  //   action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  // },
  // {
  //   user_id: '2e9e4070-2d42-41ed-8c6b-a018f40c7757',
  //   module_id: '4c8f8e25-63e5-46b4-b11d-309ff6666e11',
  //   action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  // },
  // /*ADMINISTRATIVO => USERS*/
  // //Seguridad (Módulo Padre)
  // {
  //   user_id: '32c00bdf-a19f-48b1-bc5c-de123567c18a',
  //   module_id: 'c9e0712e-c2f3-4891-93dc-4d89c60bfc91',
  //   action_id: null,
  // },
  // //Usuarios
  // {
  //   user_id: '32c00bdf-a19f-48b1-bc5c-de123567c18a',
  //   module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
  //   action_id: '30fe307d-363c-46d3-8cf5-184254e45198',
  // },
  // {
  //   user_id: '32c00bdf-a19f-48b1-bc5c-de123567c18a',
  //   module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
  //   action_id: '318caf13-5c64-4aec-91fb-26abca03c348',
  // },
  // {
  //   user_id: '32c00bdf-a19f-48b1-bc5c-de123567c18a',
  //   module_id: 'd63411ce-54ef-4671-ba83-6e1db5bb7750',
  //   action_id: 'f33c5435-9cb2-4d18-8530-e37f28fd231d',
  // },
]

const sUsersdata = setUserAccesses(sUsers, sUserAccess)
const alumnosdata = setUserAccesses(alumnos, alumnosAccess)
const profesoresdata = setUserAccesses(profesores, profesoresAccess)
const admindata = setUserAccesses(administrativo, adminAccess)
access.push(...sUsersdata, ...alumnosdata, ...profesoresdata, ...admindata)

module.exports = {
  access,
  alumnosAccess,
  profesoresAccess,
}
