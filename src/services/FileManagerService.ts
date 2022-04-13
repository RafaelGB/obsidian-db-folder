import { obtainContentFromTfile, obtainTfileFromBasename } from "helpers/VaultManagement";
import { TFile, TFolder } from "obsidian";
import { LOGGER } from "./Logger";

class FileContent{
    public value: string;
    constructor(string: string){
        this.value = string;
    }

    object(): string[]{
        return this.real_array(this.value.split('\n'));
    }

    replaceAll(pattern_to_replace:any, input:any): FileContent{
      if(input!==''){
        if(Array.isArray(pattern_to_replace)){
          pattern_to_replace.forEach(
            (regex,index) =>  {
              this.value = this.value.replaceAll(
                regex,
                input[index]
              );
            }
          );
        }else{
          this.value = this.value.replaceAll(
            pattern_to_replace,
            input
          );
        }
      }
      return this;
    }

    remove(pattern_to_be_removed:any): FileContent{
        let _object = this.object();
        _object.forEach((value,index) => {
            if (value.match(pattern_to_be_removed)){
                delete _object[index];
            }
        });
        this.value = this.real_array(_object).join('\n');
        return this;
    }

    removeAll(string_to_be_removed:any): FileContent{
        let _object = this.object();
        _object.forEach((value,index) => {
            if (value.trim().indexOf(string_to_be_removed)!=-1){
                delete _object[index];
            }
        });
        this.value = this.real_array(_object).join('\n');
        return this;
    }

    fetch(line_number:number){
        let _object = this.object();
        for (let i=0;i<_object.length;i++){
            if (i+1===line_number){
                return _object[i];
            }
        }
        return null;
    }

    edit(content:string,line_number:any): FileContent{
         let _object = this.object();
        _object[line_number-1] = content;
         this.value = this.real_array(_object).join('\n');
         return this;
     }

    real_array(array:string[]):string[]{
        let output:string[] = [];
        array.forEach(element=>{
            output.push(element);
        });
        return output;
    }
}
export class FileManager{
    private static instance: FileManager;
    constructor(){}
    
    /**
     * Add new file inside TFolder
     * @param file_path 
     * @param filename 
     * @param content 
     */
    async create_markdown_file(targetFolder: TFolder, filename:string, content?: string): Promise<TFile> {
        LOGGER.debug(`=> create_markdown_file. name:${targetFolder.path}/${filename})`);
        const created_note = await app.fileManager.createNewMarkdownFile(
            targetFolder,
            filename ?? "Untitled"
        );
        await app.vault.modify(created_note, content ?? "");
        LOGGER.debug(`<= create_markdown_file`);
        return created_note;
    }

    async editNoteContent(note:any) {
        LOGGER.debug(`=> editNoteContent. note:${JSON.stringify(note)}`);
        try{
            let tfile = obtainTfileFromBasename(note.basename);
            let tfileContent = await obtainContentFromTfile(tfile);
            let line_string = new FileContent(tfileContent);
            let releasedContent = tfileContent;
            switch (note.action) {
              case 'remove':
                releasedContent = line_string.remove(note.regexp).value;
                break;
              case 'replace':
                releasedContent = line_string.replaceAll(note.regexp, note.newValue).value;
                break;
              default:
                throw "Error: Option " + note.action + " is not supported with tp.user.editNoteContent.";
            }
            app.vault.modify(tfile,releasedContent);
            LOGGER.debug(`<= editNoteContent. file '${tfile.path}' edited`);
        }catch(err) {
            LOGGER.error(`<= editNoteContent exit with errors`,err);
        }
      }
    /**
     * Singleton instance
     * @returns {FileManager}
     */
    public static getInstance(): FileManager {
    if (!this.instance) {
        this.instance = new FileManager();
    }
        return this.instance;
    }
}
 
export const FileManagerDB = FileManager.getInstance();