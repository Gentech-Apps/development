import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';
import { OperationType } from './enums/operation.enum';
import { OperationOptions } from './interfaces/operation-options.interface';
import { isMissing } from '../utils/typecheck';
import { RecordAlreadyExistsModel } from './model/record-exists.model';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../modules/audit-logs/audit-logs.service';
import { CreateAuditLogDto } from '../modules/audit-logs/dto/create-audit-log.dto';
import { ActionEnum } from '../modules/audit-logs/enum/action.enum';
import { applyDefaultOptions } from './utils/apply-default-option';
import { GlobalPathParamDto } from '../dto/global-path-param.dto';

@Injectable()
export class UnifiedOperationService<T> {
  constructor(
    private readonly model: Model<T>,
    @Inject(REQUEST) private request: Request,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async handleOperation(operation: OperationType, options: OperationOptions<T>): Promise<any> {
    const { data, id, tenantId, session } = options;
    switch (operation) {
      case OperationType.CREATE:
        return this.createOne(data as Partial<T>, session);
      case OperationType.CREATE_BATCH:
        return this.createBatch(data as Partial<T[]>, session);
      case OperationType.LIST:
        return this.findAll(options);
      case OperationType.GET:
        return this.findOne({ id, tenantId });
      case OperationType.UPDATE:
        return this.updateOne(options);
      case OperationType.DELETE:
        return this.deleteOne(options);
      default:
        throw new Error('Invalid operation');
    }
  }

  private async createOne(createDto: Partial<T>, session?: ClientSession): Promise<any> {
    const result = await this.model.create([createDto], { session });
    this.generateAuditLog(result, ActionEnum.CREATE, 201);
    return result[0];
  }

  private async createBatch(data: Partial<T[]>, session: ClientSession): Promise<any> {
    const result = await this.model.insertMany(data, { session });
    this.generateAuditLog(result, ActionEnum.CREATE, 201);
    return result;
  }

  private async findAll(options: OperationOptions<T> = {}): Promise<T[]> {
    const updatedOptions = applyDefaultOptions(options);

    const { $skip, $limit } = updatedOptions.query.cursor;

    const dataStages = [{ $skip: $limit * ($skip - 1) }, { $limit }];

    const pipeline: any = [
      ...(updatedOptions.query.stages ? updatedOptions.query.stages : []),
      {
        $facet: {
          data: dataStages,
          totalCount: [{ $count: 'totalCount' }],
        },
      },
    ];

    const records = await this.model.aggregate(pipeline);
    return records[0];
  }

  public async recordAlreadyExists(data: RecordAlreadyExistsModel): Promise<boolean> {
    const commonConditions = {
      isDeleted: false,
    };
    // Getting field name for exception message
    const field = Object.keys(data).pop();
    const result = await this.model.findOne({ ...commonConditions, ...data });
    if (result) {
      throw new ConflictException(`${this.model.modelName} ${field} should be unique`);
    }
    return true;
  }

  private async findOne(options: GlobalPathParamDto): Promise<T> {
    const { id, tenantId } = options;

    const record = await this.model.find({ _id: id, tenantId }).exec();
    if (record.length === 0) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }
    return record[0];
  }

  private async updateOne(updateDto: OperationOptions<T>): Promise<T | null> {
    const { id, tenantId, ...data } = updateDto;

    const record = await this.model.findByIdAndUpdate(id, data, { $where: tenantId, new: true });
    if (isMissing(record)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    this.generateAuditLog(record, ActionEnum.UPDATE, 200);
    return record;
  }

  private async deleteOne(deleteDto: OperationOptions<T>): Promise<string> {
    const { id, tenantId } = deleteDto;
    const result = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { $where: tenantId, new: true },
    );

    if (isMissing(result)) {
      throw new NotFoundException(`Record not found with id: ${id}`);
    }

    this.generateAuditLog(result, ActionEnum.DELETE, 200);
    return 'Record deleted successfully';
  }

  private generateAuditLog(result: any, action: ActionEnum, statusCode: number) {
    const createAuditLogDto: CreateAuditLogDto = {
      tenantId: this.request['user']?.tenant_id,
      userId: this.request['user']?.user_id,
      entity: this.model.modelName,
      action,
      documentId: result?._id as string,
      modifiedData: { ...result },
      statusCode,
      ipAddress: this.request['ip'],
    };
    this.auditLogsService.createOneAuditLog(createAuditLogDto);
  }
}
