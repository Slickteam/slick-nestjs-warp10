import { Module } from '@nestjs/common';

import { DataPoint } from './model/DataPoint';
import { DataPointResult } from './model/DataPointResult';
import { GTS } from './model/GTS';
import { UpdatedWarp10Result } from './model/UpdatedWarp10Result';
import { BuckertizerWarp10Type } from './type/BuckertizerWarp10Type';
import { MapperWarp10Type } from './type/MapperWarp10Type';
import { ReducerWarp10Type } from './type/ReducerWarp10Type';
import { TimeUnits } from './type/TimeUnits';
import { Warp10Service } from './warp10.service';

@Module({
  providers: [Warp10Service],
  exports: [Warp10Service],
})
class Warp10Module {}

export {
  Warp10Module,
  Warp10Service,
  // Models
  DataPoint,
  DataPointResult,
  GTS,
  UpdatedWarp10Result,
  // Types
  BuckertizerWarp10Type,
  MapperWarp10Type,
  ReducerWarp10Type,
  TimeUnits,
};
