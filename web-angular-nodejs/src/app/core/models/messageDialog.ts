import { messageDialogInterface } from '../interface/messageDialog';

export class messageDialog implements messageDialogInterface {
  icon: string;
  message: string;
  title: string;
  showSubmitButton: boolean;
  showCancelButton: boolean;
  submitButtonName: string;
  cancelButtonName?: string;
  height?: string;
  width?: string;

  constructor(
    title: string,
    message: string,
    icon: string,
    showSubmitButton: boolean,
    showCancelButton: boolean,
    submitButtonName: string,
    cancelButtonName?: string,
    height?: string,
    width?: string,
  ) {
    this.icon = icon;
    this.message = message;
    this.title = title;
    this.showSubmitButton = showSubmitButton;
    this.showCancelButton = showCancelButton;
    this.submitButtonName = submitButtonName;
    this.cancelButtonName = cancelButtonName;
    this.height = height;
    this.width = width;
  }
}
