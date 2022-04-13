export class FileContent{
    public value: string;
    constructor(string: string){
        this.value = string;
    }

    object(): string[]{
        return this.real_array(this.value.split('\n'));
    }

    replaceAll(pattern_to_replace:RegExp, input:string): FileContent{
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

    remove(pattern_to_be_removed:RegExp): FileContent{
        let _object = this.object();
        _object.forEach((value,index) => {
            if (value.match(pattern_to_be_removed)){
                delete _object[index];
            }
        });
        this.value = this.real_array(_object).join('\n');
        return this;
    }

    removeAll(string_to_be_removed:string): FileContent{
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

    edit(content:string,line_number:number): FileContent{
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