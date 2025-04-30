export declare class DataPoint {
  timestamp?: number;
  lat?: number;
  lng?: number;
  elev?: number;
  className: string;
  value: number | string | boolean;
  labels: {
    [key: string]: string;
  };
}
