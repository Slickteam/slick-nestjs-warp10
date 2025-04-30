import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Warp10 } from '@senx/warp10';

import { DataPoint } from './model/DataPoint';
import { GTS } from './model/GTS';
import { JsonLib } from './utils/JsonLib';
import { Utils } from './utils/Utils';

@Injectable()
export class Warp10Service {
  private readonly warp10Url: string;
  private readonly warp10Timeout: number;
  private readonly writeToken: string;
  private readonly readToken: string;
  private readonly logger = new Logger(Warp10Service.name);

  public BASE_APP_CLASS_NAME: string;

  public readonly w10: Warp10;

  public constructor(private configService: ConfigService) {
    this.warp10Url = this.configService.get<string>('WARP10_URL') ?? 'http://localhost:8080';
    this.warp10Timeout = this.configService.get<number>('WARP10_HTTP_TIMEOUT') ?? 5000;
    this.writeToken = this.configService.get('WARP10_WRITE_TOKEN') ?? '';
    this.readToken = this.configService.get('WARP10_READ_TOKEN') ?? '';
    this.BASE_APP_CLASS_NAME = this.configService.get('WARP10_BASE_CLASS_NAME') ?? 'fr.slickteam.wattson';
    this.w10 = new Warp10().endpoint(this.warp10Url).timeout(this.warp10Timeout);
  }

  public async exec(request: string | undefined, withInnerToken = false): Promise<any> {
    if (request) {
      let _request;
      if (withInnerToken) {
        _request = `'${this.writeToken}' 'wt' STORE`;
        _request += `\r\n'${this.readToken}' 'rt' STORE`;
        _request += `\r\n${request}`;
      } else {
        _request = request;
      }
      this.logger.verbose(_request);
      const warp10EndpointExec = `${this.warp10Url}/api/v0/exec`;
      try {
        const response = await Utils.httpPost(warp10EndpointExec, _request);
        if (response) {
          return new JsonLib().parse(response.data as string);
        }
      } catch (err) {
        console.error(err);
      }
    }
    return [] as GTS[];
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
    return this.w10.delete(writeToken ?? this.writeToken, className, labels, start, end, deleteAll);
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
