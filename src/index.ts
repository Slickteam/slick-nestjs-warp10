import { Module } from '@nestjs/common';
import { Warp10Service, DataPointResult, BuckertizerWarp10Enum, MapperWarp10Enum, ReducerWarp10Enum } from './warp10.service';

@Module({
  providers: [Warp10Service],
  exports: [Warp10Service],
})
class Warp10Module {}

export { Warp10Module, Warp10Service, DataPointResult, BuckertizerWarp10Enum, MapperWarp10Enum, ReducerWarp10Enum };
