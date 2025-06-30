import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../../core/services/local.storage.services';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { MessageTemplateType } from '../../../core/enums/messageTemplateType';

@Component({
  selector: 'app-successful-registration',
  templateUrl: './successful-registration.component.html',
  styleUrls: ['./successful-registration.component.scss'],
})
export class SuccessfulRegistrationComponent {
  driveId: number = 0;
  messageContent: string = '';
  showLoader: boolean = false;

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService,
  ) {}

  ngOnInit() {
    this.driveId = Number(this.localStorage.getItem('examineeDriveId'));
    this.loadContent();
  }

  loadContent() {
    this.showLoader = true;
    this.authService
      .getMessageContentByDriveIdAndTypeId(this.driveId, MessageTemplateType.REGISTRATION)
      .subscribe((response: APIResponseObject) => {
        this.showLoader = false;
        if (response.result) {
          this.messageContent = response.data.content;
        }
      });
  }

  ngOnDestroy() {
    this.localStorage.removeItem('examineeDriveId');
  }
}
