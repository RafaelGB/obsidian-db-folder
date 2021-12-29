import {
    MetadataCache, 
    TFile,
    Vault,
    MarkdownRenderChild
} from "obsidian";

import { 
	Settings
} from 'Settings';

import {
    createTable
} from 'components/Table';
/**
 * Render a search bar of notes into a folder path with filters
 */
export class DBFolderSearchRenderer extends MarkdownRenderChild {
    
    constructor(
        public container: HTMLElement,
        public db_yaml: any,
        public sourcePath: string,
        public settings: Settings
    ) {
        super(container);
    }

    async onload() {
        await this.render();
    }

    async render() {
        this.container.createEl("h3", { text: this.db_yaml.title });

        const searchEl = this.container.createEl("input", {
            type: "text"
        });
        const searchButton = this.container.createEl("button", {
            text: "Search"
        });

        searchButton.addEventListener("click", async () => {
            const searchResult = searchEl.value;
            console.log(searchResult);
        });
        // Add a table to the container

        const tableContainer  = this.container.createDiv("table-container");
        createTable(tableContainer,sample);
        // TODO obtain current file
        // TODO generate a factory of renderers with unique id
        // TODO use de result of the search to filter the files inside db_yaml defined folder
    }
    
}
let sample = [
    {
        id: 1,
        title: "Beetlejuice",
        year: "1988",
        runtime: "92",
        genres: ["Comedy", "Fantasy"],
        director: "Tim Burton",
        actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
        plot:
          'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg"
      }
];