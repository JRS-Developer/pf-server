
const rol = {
    sAadmin: 'SuperAdmin',
    admin: 'Admin',
    profesor: 'Profesor',
    alumno: 'Alumno',
    tutor: 'Tutor'
  }
  
  module.exports = {
    ROLE: rol,
    users: [
      { id: 1, name: 'Wilmer', rol: rol.sAadmin },
      { id: 2, name: 'Edwin', rol: rol.admin },
      { id: 3, name: 'Valentin', rol: rol.profesor },
      { id: 4, name: 'Jose', rol: rol.alumno },
      { id: 5, name: 'Luan', rol: rol.profesor },
      { id: 6, name: 'Lean', rol: rol.profesor },
      { id: 7, name: 'Nico', rol: rol.tutor },
      { id: 8, name: 'Juan', rol: rol.alumno },
    ],
    aulas: [
      { id: 1, name: " Aula general", userId: [3] },
      { id: 2, name: "Aula de Valentin", userId: [2,3,4] },
      { id: 3, name: "Aula de Luan", userId: [5,8,7] }
    ]
  }