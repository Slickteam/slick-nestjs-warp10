import { Module } from '@nestjs/common';
import { DataPoint, FormattedGTS, TimeUnits, GTS, W10Data } from '@senx/warp10';
import { Warp10Service, DataPointResult, BuckertizerWarp10Enum, MapperWarp10Enum, ReducerWarp10Enum } from './warp10.service';

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
