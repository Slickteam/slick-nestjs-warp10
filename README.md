# Slick Nestjs Warp10

Available on npmjs.org : [@slickteam/nestjs-warp10](https://www.npmjs.com/package/@slickteam/nestjs-warp10)

## Usage

- Install dependency

```bash
npm i -S @slickteam/nestjs-warp10
```

- In your environment file, add these lines :

```conf
WARP10_URL=http://localhost:8080
WARP10_READ_TOKEN=
WARP10_WRITE_TOKEN=
WARP10_HTTP_TIMEOUT=5000
WARP10_BASE_CLASS_NAME=fr.slickteam.example
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

## Dependencies version

Nestjs

- `@nestjs/common`: `^10.4.7`
- `@nestjs/config`: `^3.3.0`

Warp10

- `@senx/warp10`: `^2.0.3`
