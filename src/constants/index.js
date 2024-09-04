const registrarse = 'http://localhost:8080/api/user/authenticate';
const iniciarSesion = 'http://localhost:8080/api/user/';
const validarDocumentoPersona = 'http://localhost:8080/api/persona/';


const getDuenio = 'http://localhost:8080/api/duenio/getDueniosRequest/';
const getInquilino = 'http://localhost:8080/api/inquilino/getInquilinos/';

const getEdificio = 'http://localhost:8080/api/edificio/';

const getBuildingByTenant = 'http://localhost:8080/api/edificio/getBuildingWithUnits/';

const getUnidad = 'http://localhost:8080/api/unidad/getUnidad/'

const crearReclamo = 'http://localhost:8080/api/reclamo/';

const crearEdificio = 'http://localhost:8080/api/edificio/';

const getReclamos = 'http://localhost:8080/api/reclamo/';

const getComplaintsByTenant = 'http://localhost:8080/api/reclamo/getReclamosByTenant/'

const saveFile = 'http://localhost:8080/api/file/'

export {
    registrarse,
    iniciarSesion,
    validarDocumentoPersona,
    getDuenio, getInquilino,
    getEdificio,
    getUnidad,
    crearReclamo,
    crearEdificio,
    getReclamos,
    getBuildingByTenant,
    getComplaintsByTenant,
    saveFile,
}
