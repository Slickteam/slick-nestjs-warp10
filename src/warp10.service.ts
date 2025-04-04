import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataPoint, Warp10 } from '@senx/warp10';

export enum BuckertizerWarp10Enum {
  MEAN = 'mean',
  MIN = 'min',
  MAX = 'max',
  FIRST = 'first',
  LAST = 'last',
  COUNT = 'count',
  SUM = 'sum',
}

export enum MapperWarp10Enum {
  EQUAL = 'eq',
  NOT_EQUAL = 'ne',
  LESSER_THAN = 'lt',
  GREATER_THAN = 'gt',
  LESSER_THAN_OR_EQUAL = 'le',
  GREATER_THAN_OR_EQUAL = 'ge',
}

export enum ReducerWarp10Enum {
  MEAN = 'mean',
  MIN = 'min',
  MAX = 'max',
  COUNT = 'count',
  SUM = 'sum',
}

export interface IUpdateResultWarp10 {
  response: string;
  count: number;
}

export class DataPointResult {
  public c: string;
  public v: [number, number | string | boolean][];
  public l: Record<string, string>;
}

@Injectable()
export class Warp10Service {
  private readonly writeToken: string;
  private readonly readToken: string;
  private readonly logger = new Logger(Warp10Service.name);

  public BASE_APP_CLASS_NAME: string;

  public readonly w10: Warp10;

  public constructor(private configService: ConfigService) {
    this.writeToken = this.configService.get('WARP10_WRITE_TOKEN') ?? '';
    this.readToken = this.configService.get('WARP10_READ_TOKEN') ?? '';
    this.w10 = new Warp10()
      .endpoint(this.configService.getOrThrow('WARP10_URL'))
      .timeout(this.configService.getOrThrow<number>('WARP10_HTTP_TIMEOUT'));
    this.BASE_APP_CLASS_NAME = this.configService.get('WARP10_BASE_CLASS_NAME') ?? 'fr.slickteam.wattson';
  }

  public execWithToken(script: string): Promise<{
    result: any[];
    meta: { elapsed: number; ops: number; fetched: number };
  }> {
    this.logger.verbose(script);
    return this.w10.exec(`'${this.writeToken}' 'wt' STORE
    '${this.readToken}' 'rt' STORE
    ${script}`);
  }

  public exec(script: string): Promise<{
    result: any[];
    meta: { elapsed: number; ops: number; fetched: number };
  }> {
    this.logger.verbose(script);
    return this.w10.exec(script);
  }

  public fetch(
    readToken: string | undefined,
    className: string,
    labels: Record<string, string>,
    start: string,
    stop: any,
    format?: 'text' | 'fulltext' | 'json' | 'tsv' | 'fulltsv' | 'pack' | 'raw' | 'formatted' | undefined,
    dedup?: boolean | undefined,
  ): Promise<{
    result: any[];
    meta: {
      elapsed: number;
      ops: number;
      fetched: number;
    };
  }> {
    return this.w10.fetch(readToken ?? this.readToken, className, labels, start, stop, format, dedup);
  }

  public meta(
    writeToken: string | undefined,
    meta: {
      className: string;
      labels: Record<string, string>;
      attributes: Record<string, string>;
    }[],
  ): Promise<{ response: string; count: number }> {
    return this.w10.meta(writeToken ?? this.writeToken, meta);
  }

  public update(
    writeToken: string | undefined,
    dataPoints: (string | DataPoint)[],
  ): Promise<{ response: string | undefined; count: number }> {
    return this.w10.update(writeToken ?? this.writeToken, dataPoints);
  }

  public delete(
    writeToken: string | undefined,
    className: string,
    labels: Record<string, string>,
    start: string,
    end: string,
    deleteAll?: boolean,
  ): Promise<{ result: string }> {
    return this.w10.delete(this.writeToken, className, labels, start, end, deleteAll);
  }

  public deleteByTimestamp(
    writeToken: string | undefined,
    className: string,
    labels: Record<string, string>,
    timestamp: string,
  ): Promise<{ result: string }> {
    return this.w10.delete(writeToken ?? this.writeToken, className, labels, timestamp, timestamp, false);
  }
}
