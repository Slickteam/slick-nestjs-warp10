import { Module } from '@nestjs/common';
import { DataPoint, FormattedGTS, GTS, TimeUnits, W10Data } from '@senx/warp10';

import { BuckertizerWarp10Enum, DataPointResult, MapperWarp10Enum, ReducerWarp10Enum, Warp10Service } from './warp10.service';

@Module({
  providers: [Warp10Service],
  exports: [Warp10Service],
})
class Warp10Module {}

export {
  Warp10Module,
  Warp10Service,
  DataPointResult,
  BuckertizerWarp10Enum,
  MapperWarp10Enum,
  ReducerWarp10Enum,
  // Warp10 class
  DataPoint,
  FormattedGTS,
  TimeUnits,
  GTS,
  W10Data,
};
