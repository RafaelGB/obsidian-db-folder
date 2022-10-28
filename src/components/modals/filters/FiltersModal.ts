import {
  FiltersModalHandlerResponse,
  FiltersModalProps,
} from "cdm/ModalsModel";
import { StyleClasses } from "helpers/Constants";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { filter_group_section } from "components/modals/filters/FilterGroupSection";

export class FiltersModal extends Modal {
  addColumnManager: FiltersModalManager;
  enableReset: boolean = false;
  constructor(props: FiltersModalProps) {
    super(app);
    this.addColumnManager = new FiltersModalManager(this, props);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.addColumnManager.constructUI(contentEl);
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class FiltersModalManager {
  modal: FiltersModal;
  props: FiltersModalProps;
  constructor(filtersModal: FiltersModal, props: FiltersModalProps) {
    this.modal = filtersModal;
    this.props = props;
  }
  constructUI(containerEl: HTMLElement) {
    /** Common modal headings */
    containerEl.addClass(StyleClasses.FILTERS_MODAL);
    add_setting_header(containerEl, `Table Filters`, "h2");

    const addColumnBody = containerEl.createDiv();
    addColumnBody.addClass(StyleClasses.FILTERS_MODAL_BODY);
    addColumnBody.setAttribute("id", StyleClasses.FILTERS_MODAL_BODY);
    const initialResponse: FiltersModalHandlerResponse = {
      containerEl: addColumnBody,
      filtersModalManager: this,
    };
    this.constructBody(initialResponse);
  }

  constructBody(response: FiltersModalHandlerResponse) {
    /** select new column section */
    filter_group_section.run(response);
  }

  reset(response: FiltersModalHandlerResponse) {
    const columnElement = activeDocument.getElementById(
      StyleClasses.FILTERS_MODAL_BODY
    );
    // remove all sections
    columnElement.empty();
    this.constructBody(response);
  }
}
