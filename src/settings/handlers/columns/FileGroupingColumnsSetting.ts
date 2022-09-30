import { DatabaseView } from "DatabaseView";
import { ButtonComponent, SearchComponent, Setting } from "obsidian";
import { FileAttributeSuggester } from "settings/suggesters/FileAttributeSuggester";

export class FileGroupingColumnsSetting {
  fileAttributeSuggester: FileAttributeSuggester;
  labelContainer: HTMLParagraphElement;
  searchComponent: SearchComponent;
  debouncedOrganizeNotesIntoSubfolders: any;
  label: HTMLSpanElement;

  constructor(
    private view: DatabaseView,
    private allowedColumns: Set<string>,
    private organize: () => Promise<void>,
  ) {}

  init = (containerEl: HTMLElement) => {
    new Setting(containerEl)
      .setName("Column to use for grouping")
      .setDesc("The column to use for grouping files into subfolders")
      .addSearch((sc) => {
        sc.setPlaceholder("").setValue("").onChange(this.onSearchChange);
        this.searchComponent = sc;
        const currentlySelectedColumns = new Set(
          this.view.diskConfig.yaml.config.group_folder_column.split(","),
        );
        this.fileAttributeSuggester = new FileAttributeSuggester(
          this.searchComponent.inputEl,
          [...this.allowedColumns].filter(
            (c) => !currentlySelectedColumns.has(c),
          ),
        );
      })
      .addButton(this.onClearButtonClick);

    this.configureDisplay(containerEl);
  };

  onSearchChange = (value: string) => {
    if (value && !this.allowedColumns.has(value)) return;

    const previouslySelectedColumns =
      this.view.diskConfig.yaml.config.group_folder_column
        .split(",")
        .filter(Boolean);

    const newSeting = new Set(
      [...previouslySelectedColumns, value].filter(Boolean),
    );

    this.view.diskConfig.updateConfig({
      group_folder_column: [...newSeting].join(","),
    });

    this.organize();
    this.searchComponent.clearButtonEl.click();
    this.searchComponent.inputEl.blur();
    this.fileAttributeSuggester.options = [...this.allowedColumns].filter(
      (v) => !newSeting.has(v),
    );
    this.renderLabel([...newSeting]);
  };

  private renderLabel = (values: string[]) => {
    if (values.filter(Boolean).length) {
      this.label.innerHTML =
        values
          .map((v) => `<span style='color: #ccc;'>${v}</span>`)
          .join("<span style='color: #666;'> / </span>") || "None";
      this.labelContainer.style.display = "flex";
    } else {
      this.labelContainer.style.display = "none";
    }
  };
  
  private onClearButtonClick = (button: ButtonComponent) => {
    button.setButtonText("Reset");
    button.onClick(async () => {
      this.label.innerHTML = "None";
      this.labelContainer.style.display = "none";
      this.view.diskConfig.updateConfig({ group_folder_column: "" });
      this.searchComponent.clearButtonEl.click();
      this.searchComponent.inputEl.blur();
      this.fileAttributeSuggester.options = [...this.allowedColumns];
    });
  };

  
  private configureDisplay = (containerEl: HTMLElement) => {
    this.labelContainer = containerEl.createEl("div");
    const label = containerEl.createEl("span", {
      text: "Current path: ",
    });
    label.style.color = "#666";
    this.labelContainer.appendChild(label);

    this.label = containerEl.createEl("span");
    this.labelContainer.appendChild(this.label);
    this.labelContainer.style.gap = "15px";
    this.labelContainer.style.marginBottom = "20px";
    this.renderLabel(
      this.view.diskConfig.yaml.config.group_folder_column.split(","),
    );
  };
}
