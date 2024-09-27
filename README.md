# Slick Nestjs Warp10

## Dependencies version

Nestjs

- `@nestjs/common`: `^10.4.4`
- `@nestjs/config`: `^3.2.3`

Warp10

- `@senx/warp10`: `^2.0.3`

## Usage

- Install dependency

```bash
npm i -S @slickteam/nestjs-warp10
```

- In module where you want use this module, add this :

```ts
@Module({
  imports: [Warp10Module],
  controllers: [],
  providers: [],
  exports: [],
})
class ExempleModule {}
```
