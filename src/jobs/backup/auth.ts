import { app, auth as Auth } from "firebase-admin"
import { Settings } from "../../utils/initialization"
import { JobBackupServiceTemplate, DataModel } from "../../utils/template"
import { AuthConverter } from "../../utils/AuthConverter"
import { Logger } from "../../utils/Logger"
import { Gzip } from "zlib"
import { WriteStream } from "fs"
import { Storage } from "@google-cloud/storage"

export class JobBackupAuth extends JobBackupServiceTemplate {
    /**
     * @param settings - settings object
     * @param admin - firebase app
     * @param store - google cloud storage app
     */
    constructor(settings: Settings, admin: app.App, store: Storage){
        super(settings, admin, store)
        this.auth = this.admin.auth()
    }
    /**
     * firebase auth app
     */
    private auth: Auth.Auth
    /**
     * recursive backup function
     */
    private async recursiveBackup(nextPageToken?: string){
        const listUsers = await this.auth.listUsers(1000, nextPageToken)
        for(const userRecord of listUsers.users){
            ++this.counter
            if((this.counter % 100) === 0)
                Logger.log(" -- Auth Backuped - "+this.counter+" users in "+this.getWorkTime()+".")
            const docString = AuthConverter.toString(userRecord)
            const _doc: DataModel = {
                service: "auth",
                path: userRecord.uid,
                data: docString
            }
            await new Promise((res, rej) => {
                this.stringiferStream.write(_doc, undefined, (err: Error|null|undefined)=>{
                    if(err) Logger.warn(err)
                    res()
                })
            })
        }
        if(listUsers.pageToken)
            await this.recursiveBackup(listUsers.pageToken)
        return
    }
    /**
     * job runner
     */
    public async run(){
        this.startTimestamp = Date.now()
        let _write: Gzip|WriteStream
        if(this.writer.gzipStream){
            _write = this.writer.gzipStream
        } else {
            _write = this.writer.fileStream
        }
        const unpipe = new Promise((res, rej) => {
            _write.once("unpipe", () => {
                Logger.log(" -- Auth Backuped - "+this.counter+" users in "+this.getWorkTime()+".")
                Logger.log(" - Auth Backup Complete!")
                res()
            })
        })
        this.stringiferStream.pipe(_write)
        await this.recursiveBackup()
        this.stringiferStream.unpipe(_write)
        await unpipe
        return
    }
}