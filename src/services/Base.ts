type Parameter = {
    input: string,
    optional?: boolean;
}

type Model= {
    label: string,
    path: string,
    params: Parameter[]
}

type Settings= {
    models: Model[]
}

export class Config{
    settings: Settings;

    constructor(settings: Settings){
        this.settings = settings;
    }

    /**
    * Obtain property inside of input subgroup
    */
    getSubgroupProperty(subgroup: any ,keypath: string){
      const s = keypath.split('.');
      subgroup = subgroup[s.shift()];
      while(subgroup && s.length) subgroup = subgroup[s.shift()];
      return subgroup;
    }
    /**
     * Obtain subgroup of root settings
     */
    getProperty(keypath: string){
        return this.getSubgroupProperty(this.settings,keypath);
    }

    /**
     * Obtain list of keys from root settings
     */
    getKeys(keypath: string){
        const subgroup = this.getProperty(keypath);
        return Object.keys(subgroup);
    }
}