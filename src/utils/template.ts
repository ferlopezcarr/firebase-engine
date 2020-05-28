import { app } from "firebase-admin"
import { Settings } from "./initialization"
import { Logger } from "./Logger"

/**
 * Job Template Class
 */
export class JobTemplate {
    /**
     * @param settings - settings object
     * @param admin - firebase app
     */
    constructor(settings: Settings, admin: app.App  ){       
        this.settings = settings
        this.admin = admin
    }
    /**
     * settings object
     */
    settings: Settings
    /**
     * firebase app
     */
    admin: app.App
}

/**
 * Job One Template Class
 */
export class JobOneTemplate extends JobTemplate{
    /**
     * @param settings - settings object
     * @param admin - firebase app
     */
    constructor(settings: Settings, admin: app.App){
        super(settings, admin)
    }
    /**
     * Jobs for Firebase.Firestore
     */
    public firestore = async () => { 
        Logger.warn("Not supported.")
        return
    }
    /**
     * Jobs for Firebase.Auth
     */
    public auth = async () => { 
        Logger.warn("Not supported.")
        return
    }
    /**
     * Jobs for Firebase.Storage
     */
    public storage = async () => { 
        Logger.warn("Not supported.")
        return
    }
}

/**
 * Job class
 */
export class JobOneServiceTemplate extends JobTemplate{
    /**
     * @param settings - settings object
     * @param admin - firebase app
     */
    constructor(settings: Settings, admin: app.App){
        super(settings, admin)
    }
    /**
     * Job runner
     */
    public run = async () => { 
        Logger.warn("Not supported.")
        return
    }
}

/**
 * Data Model
 */
export interface DataModel {
    /**
     * service type
     */
    service: "firestore"|"auth"|"storage",
    /**
     * document path
     */
    path: string,
    /**
     * document data
     */
    data: string
}