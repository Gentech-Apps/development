import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { EmailTemplateModel } from '../../../core/models/emailTemplate.model';
import { AddDriveService } from '../../services/addDrive.service';
import { APIResponseObject } from '../../../core/interface/apiResponseObject';
import { AreaModel } from '../../../core/models/area.model';
import { MessageTemplate } from '../../../core/models/message-template.model';
import { LocalStorageService } from '../../../core/services/local.storage.services';
import { EmailTemplatePreviewDialogComponent } from '../../../core/dialog/email-template-preview-dialog/email-template-preview-dialog.component';
import { LoggerService } from '../../../core/services/logger.service';
import { AddDriveFormGroup } from '../../models/add-drive-form-group.model';
import { StageModel } from '../../../interviewer/models/stage.model';
import { CuttOffModel } from '../../../core/models/cuttOff.model';
import { PaperCutOffList } from '../../models/paper-cutoff-list.model';
import { FormField } from '../../models/form-field.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-drive-preview-dialog',
  templateUrl: './drive-preview-dialog.component.html',
  styleUrls: ['./drive-preview-dialog.component.scss'],
})
export class DrivePreviewDialogComponent {
  formFields!: FormField[];
  areaList: AreaModel[] = [];
  cutOffList: PaperCutOffList[] = [];
  emailTemplateList: EmailTemplateModel[] = [];
  addDriveFormGroup!: AddDriveFormGroup;
  messageTemplateList: MessageTemplate[] = [];
  aoiInterviewStages: StageModel[][] = [];
  interviewStages: StageModel[] = [];

  constructor(
    private storageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private addDriveService: AddDriveService,
  ) {}

  ngOnInit(): void {
    this.addDriveFormGroup = this.data.addDriveFormGroup.value;
    let tempArray: FormField[] = [];
    Object.keys(this.data.formFields.value).forEach((key) => {
      let value = this.data.formFields.value[key];
      if (value) {
        tempArray = [...tempArray, { fieldName: key, available: value }];
      }
    });

    this.formFields = tempArray;
    this.areaList = this.data.areaList;

    let cutoffTempArray: PaperCutOffList[] = [];
    this.data.cutOffList.map((value: CuttOffModel) => {
      let isAreaOfInterestExist = cutoffTempArray?.findIndex(
        (data: PaperCutOffList) => data.areaOfInterestId === value.areaOfInterestId,
      );
      if (isAreaOfInterestExist !== -1) {
        cutoffTempArray[isAreaOfInterestExist]?.paperCutOff?.push({
          paperName: value.paperName,
          cutoffMarks: value.cutoffMarks,
          autoCutOffMarks: value.autoCutOffMarks,
        });
      } else {
        cutoffTempArray?.push({
          areaOfInterestId: value.areaOfInterestId,
          areaOfInterestName: value.areaOfInterestName,
          paperCutOff: [
            {
              paperName: value.paperName,
              cutoffMarks: value.cutoffMarks,
              autoCutOffMarks: value.autoCutOffMarks,
            },
          ],
        });
      }
    });

    this.cutOffList = cutoffTempArray;
    this.emailTemplateList = this.data.emailTemplateList;
    this.messageTemplateList = this.data.messageTemplateList;

    this.interviewStages = this.data.interviewStages;
    this.prepareInterviewStageData();
  }

  async previewEmailTemplate(id: number) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1000px';
    dialogConfig.maxHeight = '500px';
    const emailTemplate =
      this.emailTemplateList[
        this.emailTemplateList.findIndex((data: EmailTemplateModel) => {
          return data.id == id;
        })
      ];
    await this.addDriveService.getDefaultEmailTemplate().subscribe(
      (res: APIResponseObject) => {
        if (res.result) {
          dialogConfig.data = {
            obj: Object.assign(
              {},
              { html: res.data?.replace('#editHere', emailTemplate?.content) },
            ),
            option: 'preview',
            subject: emailTemplate?.subject,
            name: emailTemplate.name,
          };
          let dialogReference = this.dialog.open(EmailTemplatePreviewDialogComponent, dialogConfig);
          dialogReference.afterClosed().subscribe((result) => {});
        }
      },
      (error: HttpErrorResponse) => {
        LoggerService.log(error);
      },
    );
  }

  previewMessageTemplate(template: MessageTemplate) {
    this.storageService.setItem('previewData', template.content);
    window.open('/drive-setup/preview-template?type=' + template.type, '_blank');
  }

  prepareInterviewStageData() {
    const aoiStagesMapList = this.data.aoiStagesMapList;
    this.areaList.forEach((area: AreaModel) => {
      const stageIds = aoiStagesMapList[area.id];
      let stagesList: StageModel[] = [];
      stageIds.map((stageId: number) => {
        stagesList.push(...this.interviewStages.filter((stage: StageModel) => stage.id == stageId));
      });
      this.aoiInterviewStages.push(stagesList);
    });
  }
}
