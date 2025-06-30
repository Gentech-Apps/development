import { name } from '../constants.ts/localstorage-constant';

export class editorDialog {
  title?: string;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
  submitButtonName?: string;
  cancelButtonName?: string;
  height?: string;
  width?: string;

  constructor(
    title: string,
    showSubmitButton: boolean,
    showCancelButton: boolean,
    submitButtonName?: string,
    cancelButtonName?: string,
    height?: string,
    width?: string,
  ) {
    this.title = title;
    this.showSubmitButton = showSubmitButton;
    this.showCancelButton = showCancelButton;
    this.submitButtonName = submitButtonName;
    this.cancelButtonName = submitButtonName;
    this.height = height;
    this.width = width;
  }
}
