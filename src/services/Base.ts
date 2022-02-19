import {
    Models
}from 'cdm/folder';

export class Schema{
    models: Models;

    constructor(models: Models){
        this.models = models;
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
        return this.getSubgroupProperty(this.models,keypath);
    }

    /**
     * Obtain list of keys from root settings
     */
    getKeys(keypath: string){
        const subgroup = this.getProperty(keypath);
        return Object.keys(subgroup);
    }
}