import type { User } from "."

export type DraftFormConflicto = {
    id?:number,
    fecha:string,
    edoId?:string|null,
    munpioId?:string|null,
    asunto:string,    
    predio?:string|null,    
    promovente:string,    
    contraparte?:string|null,    
    vertienteId:string,
    ha:number,
    area:number,
    ca:number,
    puebloIndigena?:string|null,
    nombreRegSoc?:string|null,
    numBeneficiario:number,
    anioFiscal?:number,
    regSocialId?:string|null,    
    estatusId?:string,
    observaciones?:string|null,
    orgInvolucradaId?:string|null,
    problematica?:string|null,
}

export type DraftFormUser = {
    username:string,
    password:string,
    confirmPassword:string,
    perfil:number,
}

export type DraftFormConfirmPass = Pick<DraftFormUser, 'password' | 'confirmPassword'> & {
    id?:User['id']
}

export type DraftFormModulo = {
    nombre:string,
    controlador?:string,
    icono?:string,
    clase?:string,
    orden:number,
    nodo_padre:number,
    acciones?:string,
    descripcion?:string,
    grupo:number,
    ruta?:string,
}

export type DraftFormUR = {
    ur:string,
    sigla:string,
    calle?:string|null,
    ext?:string|null,
    int?:string|null,
    col?:string|null,
    edoId?:string|null,
    mpio?:number|null,
}

export type DraftFormPerfil = {
    nombre?:string|null,
    apPaterno:string,
    apMaterno?:string|null,
    cargo:string,
    puestoId:string|number,
    munpioId?:string|null,
    edoId:string|number,
    correo:string,
    foto?:string|null,
}