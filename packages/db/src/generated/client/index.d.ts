
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model Credentials
 * 
 */
export type Credentials = $Result.DefaultSelection<Prisma.$CredentialsPayload>
/**
 * Model Game
 * 
 */
export type Game = $Result.DefaultSelection<Prisma.$GamePayload>
/**
 * Model GameMove
 * 
 */
export type GameMove = $Result.DefaultSelection<Prisma.$GameMovePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.credentials`: Exposes CRUD operations for the **Credentials** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Credentials
    * const credentials = await prisma.credentials.findMany()
    * ```
    */
  get credentials(): Prisma.CredentialsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.game`: Exposes CRUD operations for the **Game** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Games
    * const games = await prisma.game.findMany()
    * ```
    */
  get game(): Prisma.GameDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameMove`: Exposes CRUD operations for the **GameMove** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameMoves
    * const gameMoves = await prisma.gameMove.findMany()
    * ```
    */
  get gameMove(): Prisma.GameMoveDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Profile: 'Profile',
    Credentials: 'Credentials',
    Game: 'Game',
    GameMove: 'GameMove'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "profile" | "credentials" | "game" | "gameMove"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      Credentials: {
        payload: Prisma.$CredentialsPayload<ExtArgs>
        fields: Prisma.CredentialsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CredentialsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CredentialsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>
          }
          findFirst: {
            args: Prisma.CredentialsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CredentialsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>
          }
          findMany: {
            args: Prisma.CredentialsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>[]
          }
          create: {
            args: Prisma.CredentialsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>
          }
          createMany: {
            args: Prisma.CredentialsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CredentialsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>[]
          }
          delete: {
            args: Prisma.CredentialsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>
          }
          update: {
            args: Prisma.CredentialsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>
          }
          deleteMany: {
            args: Prisma.CredentialsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CredentialsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CredentialsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>[]
          }
          upsert: {
            args: Prisma.CredentialsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CredentialsPayload>
          }
          aggregate: {
            args: Prisma.CredentialsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCredentials>
          }
          groupBy: {
            args: Prisma.CredentialsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CredentialsGroupByOutputType>[]
          }
          count: {
            args: Prisma.CredentialsCountArgs<ExtArgs>
            result: $Utils.Optional<CredentialsCountAggregateOutputType> | number
          }
        }
      }
      Game: {
        payload: Prisma.$GamePayload<ExtArgs>
        fields: Prisma.GameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findFirst: {
            args: Prisma.GameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findMany: {
            args: Prisma.GameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          create: {
            args: Prisma.GameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          createMany: {
            args: Prisma.GameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          delete: {
            args: Prisma.GameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          update: {
            args: Prisma.GameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          deleteMany: {
            args: Prisma.GameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          upsert: {
            args: Prisma.GameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          aggregate: {
            args: Prisma.GameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGame>
          }
          groupBy: {
            args: Prisma.GameGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameCountArgs<ExtArgs>
            result: $Utils.Optional<GameCountAggregateOutputType> | number
          }
        }
      }
      GameMove: {
        payload: Prisma.$GameMovePayload<ExtArgs>
        fields: Prisma.GameMoveFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameMoveFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameMoveFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>
          }
          findFirst: {
            args: Prisma.GameMoveFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameMoveFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>
          }
          findMany: {
            args: Prisma.GameMoveFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>[]
          }
          create: {
            args: Prisma.GameMoveCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>
          }
          createMany: {
            args: Prisma.GameMoveCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameMoveCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>[]
          }
          delete: {
            args: Prisma.GameMoveDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>
          }
          update: {
            args: Prisma.GameMoveUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>
          }
          deleteMany: {
            args: Prisma.GameMoveDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameMoveUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameMoveUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>[]
          }
          upsert: {
            args: Prisma.GameMoveUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameMovePayload>
          }
          aggregate: {
            args: Prisma.GameMoveAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameMove>
          }
          groupBy: {
            args: Prisma.GameMoveGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameMoveGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameMoveCountArgs<ExtArgs>
            result: $Utils.Optional<GameMoveCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    profile?: ProfileOmit
    credentials?: CredentialsOmit
    game?: GameOmit
    gameMove?: GameMoveOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    gamesAsWhite: number
    gamesAsBlack: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gamesAsWhite?: boolean | ProfileCountOutputTypeCountGamesAsWhiteArgs
    gamesAsBlack?: boolean | ProfileCountOutputTypeCountGamesAsBlackArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountGamesAsWhiteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountGamesAsBlackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }


  /**
   * Count Type GameCountOutputType
   */

  export type GameCountOutputType = {
    moves: number
  }

  export type GameCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moves?: boolean | GameCountOutputTypeCountMovesArgs
  }

  // Custom InputTypes
  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameCountOutputType
     */
    select?: GameCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountMovesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameMoveWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileAvgAggregateOutputType = {
    rating: number | null
    totalGames: number | null
    wins: number | null
    losses: number | null
    draws: number | null
  }

  export type ProfileSumAggregateOutputType = {
    rating: number | null
    totalGames: number | null
    wins: number | null
    losses: number | null
    draws: number | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    username: string | null
    rating: number | null
    totalGames: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    username: string | null
    rating: number | null
    totalGames: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    username: number
    rating: number
    totalGames: number
    wins: number
    losses: number
    draws: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileAvgAggregateInputType = {
    rating?: true
    totalGames?: true
    wins?: true
    losses?: true
    draws?: true
  }

  export type ProfileSumAggregateInputType = {
    rating?: true
    totalGames?: true
    wins?: true
    losses?: true
    draws?: true
  }

  export type ProfileMinAggregateInputType = {
    id?: true
    username?: true
    rating?: true
    totalGames?: true
    wins?: true
    losses?: true
    draws?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    username?: true
    rating?: true
    totalGames?: true
    wins?: true
    losses?: true
    draws?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    username?: true
    rating?: true
    totalGames?: true
    wins?: true
    losses?: true
    draws?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _avg?: ProfileAvgAggregateInputType
    _sum?: ProfileSumAggregateInputType
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    username: string
    rating: number
    totalGames: number
    wins: number
    losses: number
    draws: number
    createdAt: Date
    updatedAt: Date
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    rating?: boolean
    totalGames?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    credentials?: boolean | Profile$credentialsArgs<ExtArgs>
    gamesAsWhite?: boolean | Profile$gamesAsWhiteArgs<ExtArgs>
    gamesAsBlack?: boolean | Profile$gamesAsBlackArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    rating?: boolean
    totalGames?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    rating?: boolean
    totalGames?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    username?: boolean
    rating?: boolean
    totalGames?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "rating" | "totalGames" | "wins" | "losses" | "draws" | "createdAt" | "updatedAt", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    credentials?: boolean | Profile$credentialsArgs<ExtArgs>
    gamesAsWhite?: boolean | Profile$gamesAsWhiteArgs<ExtArgs>
    gamesAsBlack?: boolean | Profile$gamesAsBlackArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      credentials: Prisma.$CredentialsPayload<ExtArgs> | null
      gamesAsWhite: Prisma.$GamePayload<ExtArgs>[]
      gamesAsBlack: Prisma.$GamePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      rating: number
      totalGames: number
      wins: number
      losses: number
      draws: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    credentials<T extends Profile$credentialsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$credentialsArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    gamesAsWhite<T extends Profile$gamesAsWhiteArgs<ExtArgs> = {}>(args?: Subset<T, Profile$gamesAsWhiteArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gamesAsBlack<T extends Profile$gamesAsBlackArgs<ExtArgs> = {}>(args?: Subset<T, Profile$gamesAsBlackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly username: FieldRef<"Profile", 'String'>
    readonly rating: FieldRef<"Profile", 'Int'>
    readonly totalGames: FieldRef<"Profile", 'Int'>
    readonly wins: FieldRef<"Profile", 'Int'>
    readonly losses: FieldRef<"Profile", 'Int'>
    readonly draws: FieldRef<"Profile", 'Int'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.credentials
   */
  export type Profile$credentialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    where?: CredentialsWhereInput
  }

  /**
   * Profile.gamesAsWhite
   */
  export type Profile$gamesAsWhiteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Profile.gamesAsBlack
   */
  export type Profile$gamesAsBlackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model Credentials
   */

  export type AggregateCredentials = {
    _count: CredentialsCountAggregateOutputType | null
    _min: CredentialsMinAggregateOutputType | null
    _max: CredentialsMaxAggregateOutputType | null
  }

  export type CredentialsMinAggregateOutputType = {
    profileId: string | null
    passwordHash: string | null
  }

  export type CredentialsMaxAggregateOutputType = {
    profileId: string | null
    passwordHash: string | null
  }

  export type CredentialsCountAggregateOutputType = {
    profileId: number
    passwordHash: number
    _all: number
  }


  export type CredentialsMinAggregateInputType = {
    profileId?: true
    passwordHash?: true
  }

  export type CredentialsMaxAggregateInputType = {
    profileId?: true
    passwordHash?: true
  }

  export type CredentialsCountAggregateInputType = {
    profileId?: true
    passwordHash?: true
    _all?: true
  }

  export type CredentialsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Credentials to aggregate.
     */
    where?: CredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialsOrderByWithRelationInput | CredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Credentials
    **/
    _count?: true | CredentialsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CredentialsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CredentialsMaxAggregateInputType
  }

  export type GetCredentialsAggregateType<T extends CredentialsAggregateArgs> = {
        [P in keyof T & keyof AggregateCredentials]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCredentials[P]>
      : GetScalarType<T[P], AggregateCredentials[P]>
  }




  export type CredentialsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CredentialsWhereInput
    orderBy?: CredentialsOrderByWithAggregationInput | CredentialsOrderByWithAggregationInput[]
    by: CredentialsScalarFieldEnum[] | CredentialsScalarFieldEnum
    having?: CredentialsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CredentialsCountAggregateInputType | true
    _min?: CredentialsMinAggregateInputType
    _max?: CredentialsMaxAggregateInputType
  }

  export type CredentialsGroupByOutputType = {
    profileId: string
    passwordHash: string
    _count: CredentialsCountAggregateOutputType | null
    _min: CredentialsMinAggregateOutputType | null
    _max: CredentialsMaxAggregateOutputType | null
  }

  type GetCredentialsGroupByPayload<T extends CredentialsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CredentialsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CredentialsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CredentialsGroupByOutputType[P]>
            : GetScalarType<T[P], CredentialsGroupByOutputType[P]>
        }
      >
    >


  export type CredentialsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profileId?: boolean
    passwordHash?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credentials"]>

  export type CredentialsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profileId?: boolean
    passwordHash?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credentials"]>

  export type CredentialsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    profileId?: boolean
    passwordHash?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["credentials"]>

  export type CredentialsSelectScalar = {
    profileId?: boolean
    passwordHash?: boolean
  }

  export type CredentialsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"profileId" | "passwordHash", ExtArgs["result"]["credentials"]>
  export type CredentialsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type CredentialsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type CredentialsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $CredentialsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Credentials"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      profileId: string
      passwordHash: string
    }, ExtArgs["result"]["credentials"]>
    composites: {}
  }

  type CredentialsGetPayload<S extends boolean | null | undefined | CredentialsDefaultArgs> = $Result.GetResult<Prisma.$CredentialsPayload, S>

  type CredentialsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CredentialsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CredentialsCountAggregateInputType | true
    }

  export interface CredentialsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Credentials'], meta: { name: 'Credentials' } }
    /**
     * Find zero or one Credentials that matches the filter.
     * @param {CredentialsFindUniqueArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CredentialsFindUniqueArgs>(args: SelectSubset<T, CredentialsFindUniqueArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Credentials that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CredentialsFindUniqueOrThrowArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CredentialsFindUniqueOrThrowArgs>(args: SelectSubset<T, CredentialsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsFindFirstArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CredentialsFindFirstArgs>(args?: SelectSubset<T, CredentialsFindFirstArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Credentials that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsFindFirstOrThrowArgs} args - Arguments to find a Credentials
     * @example
     * // Get one Credentials
     * const credentials = await prisma.credentials.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CredentialsFindFirstOrThrowArgs>(args?: SelectSubset<T, CredentialsFindFirstOrThrowArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Credentials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Credentials
     * const credentials = await prisma.credentials.findMany()
     * 
     * // Get first 10 Credentials
     * const credentials = await prisma.credentials.findMany({ take: 10 })
     * 
     * // Only select the `profileId`
     * const credentialsWithProfileIdOnly = await prisma.credentials.findMany({ select: { profileId: true } })
     * 
     */
    findMany<T extends CredentialsFindManyArgs>(args?: SelectSubset<T, CredentialsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Credentials.
     * @param {CredentialsCreateArgs} args - Arguments to create a Credentials.
     * @example
     * // Create one Credentials
     * const Credentials = await prisma.credentials.create({
     *   data: {
     *     // ... data to create a Credentials
     *   }
     * })
     * 
     */
    create<T extends CredentialsCreateArgs>(args: SelectSubset<T, CredentialsCreateArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Credentials.
     * @param {CredentialsCreateManyArgs} args - Arguments to create many Credentials.
     * @example
     * // Create many Credentials
     * const credentials = await prisma.credentials.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CredentialsCreateManyArgs>(args?: SelectSubset<T, CredentialsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Credentials and returns the data saved in the database.
     * @param {CredentialsCreateManyAndReturnArgs} args - Arguments to create many Credentials.
     * @example
     * // Create many Credentials
     * const credentials = await prisma.credentials.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Credentials and only return the `profileId`
     * const credentialsWithProfileIdOnly = await prisma.credentials.createManyAndReturn({
     *   select: { profileId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CredentialsCreateManyAndReturnArgs>(args?: SelectSubset<T, CredentialsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Credentials.
     * @param {CredentialsDeleteArgs} args - Arguments to delete one Credentials.
     * @example
     * // Delete one Credentials
     * const Credentials = await prisma.credentials.delete({
     *   where: {
     *     // ... filter to delete one Credentials
     *   }
     * })
     * 
     */
    delete<T extends CredentialsDeleteArgs>(args: SelectSubset<T, CredentialsDeleteArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Credentials.
     * @param {CredentialsUpdateArgs} args - Arguments to update one Credentials.
     * @example
     * // Update one Credentials
     * const credentials = await prisma.credentials.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CredentialsUpdateArgs>(args: SelectSubset<T, CredentialsUpdateArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Credentials.
     * @param {CredentialsDeleteManyArgs} args - Arguments to filter Credentials to delete.
     * @example
     * // Delete a few Credentials
     * const { count } = await prisma.credentials.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CredentialsDeleteManyArgs>(args?: SelectSubset<T, CredentialsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Credentials
     * const credentials = await prisma.credentials.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CredentialsUpdateManyArgs>(args: SelectSubset<T, CredentialsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Credentials and returns the data updated in the database.
     * @param {CredentialsUpdateManyAndReturnArgs} args - Arguments to update many Credentials.
     * @example
     * // Update many Credentials
     * const credentials = await prisma.credentials.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Credentials and only return the `profileId`
     * const credentialsWithProfileIdOnly = await prisma.credentials.updateManyAndReturn({
     *   select: { profileId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CredentialsUpdateManyAndReturnArgs>(args: SelectSubset<T, CredentialsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Credentials.
     * @param {CredentialsUpsertArgs} args - Arguments to update or create a Credentials.
     * @example
     * // Update or create a Credentials
     * const credentials = await prisma.credentials.upsert({
     *   create: {
     *     // ... data to create a Credentials
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Credentials we want to update
     *   }
     * })
     */
    upsert<T extends CredentialsUpsertArgs>(args: SelectSubset<T, CredentialsUpsertArgs<ExtArgs>>): Prisma__CredentialsClient<$Result.GetResult<Prisma.$CredentialsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsCountArgs} args - Arguments to filter Credentials to count.
     * @example
     * // Count the number of Credentials
     * const count = await prisma.credentials.count({
     *   where: {
     *     // ... the filter for the Credentials we want to count
     *   }
     * })
    **/
    count<T extends CredentialsCountArgs>(
      args?: Subset<T, CredentialsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CredentialsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CredentialsAggregateArgs>(args: Subset<T, CredentialsAggregateArgs>): Prisma.PrismaPromise<GetCredentialsAggregateType<T>>

    /**
     * Group by Credentials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CredentialsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CredentialsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CredentialsGroupByArgs['orderBy'] }
        : { orderBy?: CredentialsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CredentialsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Credentials model
   */
  readonly fields: CredentialsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Credentials.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CredentialsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Credentials model
   */
  interface CredentialsFieldRefs {
    readonly profileId: FieldRef<"Credentials", 'String'>
    readonly passwordHash: FieldRef<"Credentials", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Credentials findUnique
   */
  export type CredentialsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * Filter, which Credentials to fetch.
     */
    where: CredentialsWhereUniqueInput
  }

  /**
   * Credentials findUniqueOrThrow
   */
  export type CredentialsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * Filter, which Credentials to fetch.
     */
    where: CredentialsWhereUniqueInput
  }

  /**
   * Credentials findFirst
   */
  export type CredentialsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * Filter, which Credentials to fetch.
     */
    where?: CredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialsOrderByWithRelationInput | CredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Credentials.
     */
    cursor?: CredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Credentials.
     */
    distinct?: CredentialsScalarFieldEnum | CredentialsScalarFieldEnum[]
  }

  /**
   * Credentials findFirstOrThrow
   */
  export type CredentialsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * Filter, which Credentials to fetch.
     */
    where?: CredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialsOrderByWithRelationInput | CredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Credentials.
     */
    cursor?: CredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Credentials.
     */
    distinct?: CredentialsScalarFieldEnum | CredentialsScalarFieldEnum[]
  }

  /**
   * Credentials findMany
   */
  export type CredentialsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * Filter, which Credentials to fetch.
     */
    where?: CredentialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Credentials to fetch.
     */
    orderBy?: CredentialsOrderByWithRelationInput | CredentialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Credentials.
     */
    cursor?: CredentialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Credentials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Credentials.
     */
    skip?: number
    distinct?: CredentialsScalarFieldEnum | CredentialsScalarFieldEnum[]
  }

  /**
   * Credentials create
   */
  export type CredentialsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * The data needed to create a Credentials.
     */
    data: XOR<CredentialsCreateInput, CredentialsUncheckedCreateInput>
  }

  /**
   * Credentials createMany
   */
  export type CredentialsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Credentials.
     */
    data: CredentialsCreateManyInput | CredentialsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Credentials createManyAndReturn
   */
  export type CredentialsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * The data used to create many Credentials.
     */
    data: CredentialsCreateManyInput | CredentialsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Credentials update
   */
  export type CredentialsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * The data needed to update a Credentials.
     */
    data: XOR<CredentialsUpdateInput, CredentialsUncheckedUpdateInput>
    /**
     * Choose, which Credentials to update.
     */
    where: CredentialsWhereUniqueInput
  }

  /**
   * Credentials updateMany
   */
  export type CredentialsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Credentials.
     */
    data: XOR<CredentialsUpdateManyMutationInput, CredentialsUncheckedUpdateManyInput>
    /**
     * Filter which Credentials to update
     */
    where?: CredentialsWhereInput
    /**
     * Limit how many Credentials to update.
     */
    limit?: number
  }

  /**
   * Credentials updateManyAndReturn
   */
  export type CredentialsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * The data used to update Credentials.
     */
    data: XOR<CredentialsUpdateManyMutationInput, CredentialsUncheckedUpdateManyInput>
    /**
     * Filter which Credentials to update
     */
    where?: CredentialsWhereInput
    /**
     * Limit how many Credentials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Credentials upsert
   */
  export type CredentialsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * The filter to search for the Credentials to update in case it exists.
     */
    where: CredentialsWhereUniqueInput
    /**
     * In case the Credentials found by the `where` argument doesn't exist, create a new Credentials with this data.
     */
    create: XOR<CredentialsCreateInput, CredentialsUncheckedCreateInput>
    /**
     * In case the Credentials was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CredentialsUpdateInput, CredentialsUncheckedUpdateInput>
  }

  /**
   * Credentials delete
   */
  export type CredentialsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
    /**
     * Filter which Credentials to delete.
     */
    where: CredentialsWhereUniqueInput
  }

  /**
   * Credentials deleteMany
   */
  export type CredentialsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Credentials to delete
     */
    where?: CredentialsWhereInput
    /**
     * Limit how many Credentials to delete.
     */
    limit?: number
  }

  /**
   * Credentials without action
   */
  export type CredentialsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Credentials
     */
    select?: CredentialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Credentials
     */
    omit?: CredentialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CredentialsInclude<ExtArgs> | null
  }


  /**
   * Model Game
   */

  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  export type GameAvgAggregateOutputType = {
    initialWhiteRating: number | null
    initialBlackRating: number | null
    whiteRatingChange: number | null
    blackRatingChange: number | null
  }

  export type GameSumAggregateOutputType = {
    initialWhiteRating: number | null
    initialBlackRating: number | null
    whiteRatingChange: number | null
    blackRatingChange: number | null
  }

  export type GameMinAggregateOutputType = {
    id: string | null
    whitePlayerId: string | null
    blackPlayerId: string | null
    winner: string | null
    resultReason: string | null
    pgn: string | null
    initialWhiteRating: number | null
    initialBlackRating: number | null
    whiteRatingChange: number | null
    blackRatingChange: number | null
    startedAt: Date | null
    finishedAt: Date | null
    createdAt: Date | null
  }

  export type GameMaxAggregateOutputType = {
    id: string | null
    whitePlayerId: string | null
    blackPlayerId: string | null
    winner: string | null
    resultReason: string | null
    pgn: string | null
    initialWhiteRating: number | null
    initialBlackRating: number | null
    whiteRatingChange: number | null
    blackRatingChange: number | null
    startedAt: Date | null
    finishedAt: Date | null
    createdAt: Date | null
  }

  export type GameCountAggregateOutputType = {
    id: number
    whitePlayerId: number
    blackPlayerId: number
    winner: number
    resultReason: number
    pgn: number
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange: number
    blackRatingChange: number
    startedAt: number
    finishedAt: number
    createdAt: number
    _all: number
  }


  export type GameAvgAggregateInputType = {
    initialWhiteRating?: true
    initialBlackRating?: true
    whiteRatingChange?: true
    blackRatingChange?: true
  }

  export type GameSumAggregateInputType = {
    initialWhiteRating?: true
    initialBlackRating?: true
    whiteRatingChange?: true
    blackRatingChange?: true
  }

  export type GameMinAggregateInputType = {
    id?: true
    whitePlayerId?: true
    blackPlayerId?: true
    winner?: true
    resultReason?: true
    pgn?: true
    initialWhiteRating?: true
    initialBlackRating?: true
    whiteRatingChange?: true
    blackRatingChange?: true
    startedAt?: true
    finishedAt?: true
    createdAt?: true
  }

  export type GameMaxAggregateInputType = {
    id?: true
    whitePlayerId?: true
    blackPlayerId?: true
    winner?: true
    resultReason?: true
    pgn?: true
    initialWhiteRating?: true
    initialBlackRating?: true
    whiteRatingChange?: true
    blackRatingChange?: true
    startedAt?: true
    finishedAt?: true
    createdAt?: true
  }

  export type GameCountAggregateInputType = {
    id?: true
    whitePlayerId?: true
    blackPlayerId?: true
    winner?: true
    resultReason?: true
    pgn?: true
    initialWhiteRating?: true
    initialBlackRating?: true
    whiteRatingChange?: true
    blackRatingChange?: true
    startedAt?: true
    finishedAt?: true
    createdAt?: true
    _all?: true
  }

  export type GameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Game to aggregate.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Games
    **/
    _count?: true | GameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameMaxAggregateInputType
  }

  export type GetGameAggregateType<T extends GameAggregateArgs> = {
        [P in keyof T & keyof AggregateGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>
  }




  export type GameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
    orderBy?: GameOrderByWithAggregationInput | GameOrderByWithAggregationInput[]
    by: GameScalarFieldEnum[] | GameScalarFieldEnum
    having?: GameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameCountAggregateInputType | true
    _avg?: GameAvgAggregateInputType
    _sum?: GameSumAggregateInputType
    _min?: GameMinAggregateInputType
    _max?: GameMaxAggregateInputType
  }

  export type GameGroupByOutputType = {
    id: string
    whitePlayerId: string | null
    blackPlayerId: string | null
    winner: string | null
    resultReason: string | null
    pgn: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange: number | null
    blackRatingChange: number | null
    startedAt: Date | null
    finishedAt: Date | null
    createdAt: Date | null
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  type GetGameGroupByPayload<T extends GameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameGroupByOutputType[P]>
            : GetScalarType<T[P], GameGroupByOutputType[P]>
        }
      >
    >


  export type GameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    whitePlayerId?: boolean
    blackPlayerId?: boolean
    winner?: boolean
    resultReason?: boolean
    pgn?: boolean
    initialWhiteRating?: boolean
    initialBlackRating?: boolean
    whiteRatingChange?: boolean
    blackRatingChange?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    createdAt?: boolean
    moves?: boolean | Game$movesArgs<ExtArgs>
    whitePlayer?: boolean | Game$whitePlayerArgs<ExtArgs>
    blackPlayer?: boolean | Game$blackPlayerArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    whitePlayerId?: boolean
    blackPlayerId?: boolean
    winner?: boolean
    resultReason?: boolean
    pgn?: boolean
    initialWhiteRating?: boolean
    initialBlackRating?: boolean
    whiteRatingChange?: boolean
    blackRatingChange?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    createdAt?: boolean
    whitePlayer?: boolean | Game$whitePlayerArgs<ExtArgs>
    blackPlayer?: boolean | Game$blackPlayerArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    whitePlayerId?: boolean
    blackPlayerId?: boolean
    winner?: boolean
    resultReason?: boolean
    pgn?: boolean
    initialWhiteRating?: boolean
    initialBlackRating?: boolean
    whiteRatingChange?: boolean
    blackRatingChange?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    createdAt?: boolean
    whitePlayer?: boolean | Game$whitePlayerArgs<ExtArgs>
    blackPlayer?: boolean | Game$blackPlayerArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectScalar = {
    id?: boolean
    whitePlayerId?: boolean
    blackPlayerId?: boolean
    winner?: boolean
    resultReason?: boolean
    pgn?: boolean
    initialWhiteRating?: boolean
    initialBlackRating?: boolean
    whiteRatingChange?: boolean
    blackRatingChange?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    createdAt?: boolean
  }

  export type GameOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "whitePlayerId" | "blackPlayerId" | "winner" | "resultReason" | "pgn" | "initialWhiteRating" | "initialBlackRating" | "whiteRatingChange" | "blackRatingChange" | "startedAt" | "finishedAt" | "createdAt", ExtArgs["result"]["game"]>
  export type GameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    moves?: boolean | Game$movesArgs<ExtArgs>
    whitePlayer?: boolean | Game$whitePlayerArgs<ExtArgs>
    blackPlayer?: boolean | Game$blackPlayerArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    whitePlayer?: boolean | Game$whitePlayerArgs<ExtArgs>
    blackPlayer?: boolean | Game$blackPlayerArgs<ExtArgs>
  }
  export type GameIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    whitePlayer?: boolean | Game$whitePlayerArgs<ExtArgs>
    blackPlayer?: boolean | Game$blackPlayerArgs<ExtArgs>
  }

  export type $GamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Game"
    objects: {
      moves: Prisma.$GameMovePayload<ExtArgs>[]
      whitePlayer: Prisma.$ProfilePayload<ExtArgs> | null
      blackPlayer: Prisma.$ProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      whitePlayerId: string | null
      blackPlayerId: string | null
      winner: string | null
      resultReason: string | null
      pgn: string | null
      initialWhiteRating: number
      initialBlackRating: number
      whiteRatingChange: number | null
      blackRatingChange: number | null
      startedAt: Date | null
      finishedAt: Date | null
      createdAt: Date | null
    }, ExtArgs["result"]["game"]>
    composites: {}
  }

  type GameGetPayload<S extends boolean | null | undefined | GameDefaultArgs> = $Result.GetResult<Prisma.$GamePayload, S>

  type GameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameCountAggregateInputType | true
    }

  export interface GameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Game'], meta: { name: 'Game' } }
    /**
     * Find zero or one Game that matches the filter.
     * @param {GameFindUniqueArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameFindUniqueArgs>(args: SelectSubset<T, GameFindUniqueArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Game that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameFindUniqueOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(args: SelectSubset<T, GameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameFindFirstArgs>(args?: SelectSubset<T, GameFindFirstArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(args?: SelectSubset<T, GameFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Games that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.game.findMany()
     * 
     * // Get first 10 Games
     * const games = await prisma.game.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWithIdOnly = await prisma.game.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameFindManyArgs>(args?: SelectSubset<T, GameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Game.
     * @param {GameCreateArgs} args - Arguments to create a Game.
     * @example
     * // Create one Game
     * const Game = await prisma.game.create({
     *   data: {
     *     // ... data to create a Game
     *   }
     * })
     * 
     */
    create<T extends GameCreateArgs>(args: SelectSubset<T, GameCreateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Games.
     * @param {GameCreateManyArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameCreateManyArgs>(args?: SelectSubset<T, GameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Games and returns the data saved in the database.
     * @param {GameCreateManyAndReturnArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameCreateManyAndReturnArgs>(args?: SelectSubset<T, GameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Game.
     * @param {GameDeleteArgs} args - Arguments to delete one Game.
     * @example
     * // Delete one Game
     * const Game = await prisma.game.delete({
     *   where: {
     *     // ... filter to delete one Game
     *   }
     * })
     * 
     */
    delete<T extends GameDeleteArgs>(args: SelectSubset<T, GameDeleteArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Game.
     * @param {GameUpdateArgs} args - Arguments to update one Game.
     * @example
     * // Update one Game
     * const game = await prisma.game.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameUpdateArgs>(args: SelectSubset<T, GameUpdateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Games.
     * @param {GameDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.game.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameDeleteManyArgs>(args?: SelectSubset<T, GameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameUpdateManyArgs>(args: SelectSubset<T, GameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games and returns the data updated in the database.
     * @param {GameUpdateManyAndReturnArgs} args - Arguments to update many Games.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameUpdateManyAndReturnArgs>(args: SelectSubset<T, GameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Game.
     * @param {GameUpsertArgs} args - Arguments to update or create a Game.
     * @example
     * // Update or create a Game
     * const game = await prisma.game.upsert({
     *   create: {
     *     // ... data to create a Game
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game we want to update
     *   }
     * })
     */
    upsert<T extends GameUpsertArgs>(args: SelectSubset<T, GameUpsertArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameCountArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.game.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
    **/
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameAggregateArgs>(args: Subset<T, GameAggregateArgs>): Prisma.PrismaPromise<GetGameAggregateType<T>>

    /**
     * Group by Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameGroupByArgs['orderBy'] }
        : { orderBy?: GameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Game model
   */
  readonly fields: GameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    moves<T extends Game$movesArgs<ExtArgs> = {}>(args?: Subset<T, Game$movesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    whitePlayer<T extends Game$whitePlayerArgs<ExtArgs> = {}>(args?: Subset<T, Game$whitePlayerArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    blackPlayer<T extends Game$blackPlayerArgs<ExtArgs> = {}>(args?: Subset<T, Game$blackPlayerArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Game model
   */
  interface GameFieldRefs {
    readonly id: FieldRef<"Game", 'String'>
    readonly whitePlayerId: FieldRef<"Game", 'String'>
    readonly blackPlayerId: FieldRef<"Game", 'String'>
    readonly winner: FieldRef<"Game", 'String'>
    readonly resultReason: FieldRef<"Game", 'String'>
    readonly pgn: FieldRef<"Game", 'String'>
    readonly initialWhiteRating: FieldRef<"Game", 'Int'>
    readonly initialBlackRating: FieldRef<"Game", 'Int'>
    readonly whiteRatingChange: FieldRef<"Game", 'Int'>
    readonly blackRatingChange: FieldRef<"Game", 'Int'>
    readonly startedAt: FieldRef<"Game", 'DateTime'>
    readonly finishedAt: FieldRef<"Game", 'DateTime'>
    readonly createdAt: FieldRef<"Game", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Game findUnique
   */
  export type GameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findUniqueOrThrow
   */
  export type GameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findFirst
   */
  export type GameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findFirstOrThrow
   */
  export type GameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findMany
   */
  export type GameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Games to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game create
   */
  export type GameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to create a Game.
     */
    data: XOR<GameCreateInput, GameUncheckedCreateInput>
  }

  /**
   * Game createMany
   */
  export type GameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Game createManyAndReturn
   */
  export type GameCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game update
   */
  export type GameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to update a Game.
     */
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>
    /**
     * Choose, which Game to update.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game updateMany
   */
  export type GameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
  }

  /**
   * Game updateManyAndReturn
   */
  export type GameUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game upsert
   */
  export type GameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The filter to search for the Game to update in case it exists.
     */
    where: GameWhereUniqueInput
    /**
     * In case the Game found by the `where` argument doesn't exist, create a new Game with this data.
     */
    create: XOR<GameCreateInput, GameUncheckedCreateInput>
    /**
     * In case the Game was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>
  }

  /**
   * Game delete
   */
  export type GameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter which Game to delete.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game deleteMany
   */
  export type GameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Games to delete
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to delete.
     */
    limit?: number
  }

  /**
   * Game.moves
   */
  export type Game$movesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    where?: GameMoveWhereInput
    orderBy?: GameMoveOrderByWithRelationInput | GameMoveOrderByWithRelationInput[]
    cursor?: GameMoveWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameMoveScalarFieldEnum | GameMoveScalarFieldEnum[]
  }

  /**
   * Game.whitePlayer
   */
  export type Game$whitePlayerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * Game.blackPlayer
   */
  export type Game$blackPlayerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * Game without action
   */
  export type GameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
  }


  /**
   * Model GameMove
   */

  export type AggregateGameMove = {
    _count: GameMoveCountAggregateOutputType | null
    _avg: GameMoveAvgAggregateOutputType | null
    _sum: GameMoveSumAggregateOutputType | null
    _min: GameMoveMinAggregateOutputType | null
    _max: GameMoveMaxAggregateOutputType | null
  }

  export type GameMoveAvgAggregateOutputType = {
    id: number | null
    moveNumber: number | null
    timeLeftWhite: number | null
    timeLeftBlack: number | null
  }

  export type GameMoveSumAggregateOutputType = {
    id: bigint | null
    moveNumber: number | null
    timeLeftWhite: number | null
    timeLeftBlack: number | null
  }

  export type GameMoveMinAggregateOutputType = {
    id: bigint | null
    gameId: string | null
    moveNumber: number | null
    moveSan: string | null
    moveUci: string | null
    fen: string | null
    timeLeftWhite: number | null
    timeLeftBlack: number | null
    createdAt: Date | null
  }

  export type GameMoveMaxAggregateOutputType = {
    id: bigint | null
    gameId: string | null
    moveNumber: number | null
    moveSan: string | null
    moveUci: string | null
    fen: string | null
    timeLeftWhite: number | null
    timeLeftBlack: number | null
    createdAt: Date | null
  }

  export type GameMoveCountAggregateOutputType = {
    id: number
    gameId: number
    moveNumber: number
    moveSan: number
    moveUci: number
    fen: number
    timeLeftWhite: number
    timeLeftBlack: number
    createdAt: number
    _all: number
  }


  export type GameMoveAvgAggregateInputType = {
    id?: true
    moveNumber?: true
    timeLeftWhite?: true
    timeLeftBlack?: true
  }

  export type GameMoveSumAggregateInputType = {
    id?: true
    moveNumber?: true
    timeLeftWhite?: true
    timeLeftBlack?: true
  }

  export type GameMoveMinAggregateInputType = {
    id?: true
    gameId?: true
    moveNumber?: true
    moveSan?: true
    moveUci?: true
    fen?: true
    timeLeftWhite?: true
    timeLeftBlack?: true
    createdAt?: true
  }

  export type GameMoveMaxAggregateInputType = {
    id?: true
    gameId?: true
    moveNumber?: true
    moveSan?: true
    moveUci?: true
    fen?: true
    timeLeftWhite?: true
    timeLeftBlack?: true
    createdAt?: true
  }

  export type GameMoveCountAggregateInputType = {
    id?: true
    gameId?: true
    moveNumber?: true
    moveSan?: true
    moveUci?: true
    fen?: true
    timeLeftWhite?: true
    timeLeftBlack?: true
    createdAt?: true
    _all?: true
  }

  export type GameMoveAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameMove to aggregate.
     */
    where?: GameMoveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameMoves to fetch.
     */
    orderBy?: GameMoveOrderByWithRelationInput | GameMoveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameMoveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameMoves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameMoves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameMoves
    **/
    _count?: true | GameMoveCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameMoveAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameMoveSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameMoveMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameMoveMaxAggregateInputType
  }

  export type GetGameMoveAggregateType<T extends GameMoveAggregateArgs> = {
        [P in keyof T & keyof AggregateGameMove]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameMove[P]>
      : GetScalarType<T[P], AggregateGameMove[P]>
  }




  export type GameMoveGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameMoveWhereInput
    orderBy?: GameMoveOrderByWithAggregationInput | GameMoveOrderByWithAggregationInput[]
    by: GameMoveScalarFieldEnum[] | GameMoveScalarFieldEnum
    having?: GameMoveScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameMoveCountAggregateInputType | true
    _avg?: GameMoveAvgAggregateInputType
    _sum?: GameMoveSumAggregateInputType
    _min?: GameMoveMinAggregateInputType
    _max?: GameMoveMaxAggregateInputType
  }

  export type GameMoveGroupByOutputType = {
    id: bigint
    gameId: string
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite: number | null
    timeLeftBlack: number | null
    createdAt: Date | null
    _count: GameMoveCountAggregateOutputType | null
    _avg: GameMoveAvgAggregateOutputType | null
    _sum: GameMoveSumAggregateOutputType | null
    _min: GameMoveMinAggregateOutputType | null
    _max: GameMoveMaxAggregateOutputType | null
  }

  type GetGameMoveGroupByPayload<T extends GameMoveGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameMoveGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameMoveGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameMoveGroupByOutputType[P]>
            : GetScalarType<T[P], GameMoveGroupByOutputType[P]>
        }
      >
    >


  export type GameMoveSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameId?: boolean
    moveNumber?: boolean
    moveSan?: boolean
    moveUci?: boolean
    fen?: boolean
    timeLeftWhite?: boolean
    timeLeftBlack?: boolean
    createdAt?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameMove"]>

  export type GameMoveSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameId?: boolean
    moveNumber?: boolean
    moveSan?: boolean
    moveUci?: boolean
    fen?: boolean
    timeLeftWhite?: boolean
    timeLeftBlack?: boolean
    createdAt?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameMove"]>

  export type GameMoveSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameId?: boolean
    moveNumber?: boolean
    moveSan?: boolean
    moveUci?: boolean
    fen?: boolean
    timeLeftWhite?: boolean
    timeLeftBlack?: boolean
    createdAt?: boolean
    game?: boolean | GameDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameMove"]>

  export type GameMoveSelectScalar = {
    id?: boolean
    gameId?: boolean
    moveNumber?: boolean
    moveSan?: boolean
    moveUci?: boolean
    fen?: boolean
    timeLeftWhite?: boolean
    timeLeftBlack?: boolean
    createdAt?: boolean
  }

  export type GameMoveOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gameId" | "moveNumber" | "moveSan" | "moveUci" | "fen" | "timeLeftWhite" | "timeLeftBlack" | "createdAt", ExtArgs["result"]["gameMove"]>
  export type GameMoveInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
  }
  export type GameMoveIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
  }
  export type GameMoveIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | GameDefaultArgs<ExtArgs>
  }

  export type $GameMovePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameMove"
    objects: {
      game: Prisma.$GamePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      gameId: string
      moveNumber: number
      moveSan: string
      moveUci: string
      fen: string
      timeLeftWhite: number | null
      timeLeftBlack: number | null
      createdAt: Date | null
    }, ExtArgs["result"]["gameMove"]>
    composites: {}
  }

  type GameMoveGetPayload<S extends boolean | null | undefined | GameMoveDefaultArgs> = $Result.GetResult<Prisma.$GameMovePayload, S>

  type GameMoveCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameMoveFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameMoveCountAggregateInputType | true
    }

  export interface GameMoveDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameMove'], meta: { name: 'GameMove' } }
    /**
     * Find zero or one GameMove that matches the filter.
     * @param {GameMoveFindUniqueArgs} args - Arguments to find a GameMove
     * @example
     * // Get one GameMove
     * const gameMove = await prisma.gameMove.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameMoveFindUniqueArgs>(args: SelectSubset<T, GameMoveFindUniqueArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameMove that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameMoveFindUniqueOrThrowArgs} args - Arguments to find a GameMove
     * @example
     * // Get one GameMove
     * const gameMove = await prisma.gameMove.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameMoveFindUniqueOrThrowArgs>(args: SelectSubset<T, GameMoveFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameMove that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveFindFirstArgs} args - Arguments to find a GameMove
     * @example
     * // Get one GameMove
     * const gameMove = await prisma.gameMove.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameMoveFindFirstArgs>(args?: SelectSubset<T, GameMoveFindFirstArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameMove that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveFindFirstOrThrowArgs} args - Arguments to find a GameMove
     * @example
     * // Get one GameMove
     * const gameMove = await prisma.gameMove.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameMoveFindFirstOrThrowArgs>(args?: SelectSubset<T, GameMoveFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameMoves that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameMoves
     * const gameMoves = await prisma.gameMove.findMany()
     * 
     * // Get first 10 GameMoves
     * const gameMoves = await prisma.gameMove.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameMoveWithIdOnly = await prisma.gameMove.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameMoveFindManyArgs>(args?: SelectSubset<T, GameMoveFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameMove.
     * @param {GameMoveCreateArgs} args - Arguments to create a GameMove.
     * @example
     * // Create one GameMove
     * const GameMove = await prisma.gameMove.create({
     *   data: {
     *     // ... data to create a GameMove
     *   }
     * })
     * 
     */
    create<T extends GameMoveCreateArgs>(args: SelectSubset<T, GameMoveCreateArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameMoves.
     * @param {GameMoveCreateManyArgs} args - Arguments to create many GameMoves.
     * @example
     * // Create many GameMoves
     * const gameMove = await prisma.gameMove.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameMoveCreateManyArgs>(args?: SelectSubset<T, GameMoveCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameMoves and returns the data saved in the database.
     * @param {GameMoveCreateManyAndReturnArgs} args - Arguments to create many GameMoves.
     * @example
     * // Create many GameMoves
     * const gameMove = await prisma.gameMove.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameMoves and only return the `id`
     * const gameMoveWithIdOnly = await prisma.gameMove.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameMoveCreateManyAndReturnArgs>(args?: SelectSubset<T, GameMoveCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameMove.
     * @param {GameMoveDeleteArgs} args - Arguments to delete one GameMove.
     * @example
     * // Delete one GameMove
     * const GameMove = await prisma.gameMove.delete({
     *   where: {
     *     // ... filter to delete one GameMove
     *   }
     * })
     * 
     */
    delete<T extends GameMoveDeleteArgs>(args: SelectSubset<T, GameMoveDeleteArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameMove.
     * @param {GameMoveUpdateArgs} args - Arguments to update one GameMove.
     * @example
     * // Update one GameMove
     * const gameMove = await prisma.gameMove.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameMoveUpdateArgs>(args: SelectSubset<T, GameMoveUpdateArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameMoves.
     * @param {GameMoveDeleteManyArgs} args - Arguments to filter GameMoves to delete.
     * @example
     * // Delete a few GameMoves
     * const { count } = await prisma.gameMove.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameMoveDeleteManyArgs>(args?: SelectSubset<T, GameMoveDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameMoves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameMoves
     * const gameMove = await prisma.gameMove.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameMoveUpdateManyArgs>(args: SelectSubset<T, GameMoveUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameMoves and returns the data updated in the database.
     * @param {GameMoveUpdateManyAndReturnArgs} args - Arguments to update many GameMoves.
     * @example
     * // Update many GameMoves
     * const gameMove = await prisma.gameMove.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameMoves and only return the `id`
     * const gameMoveWithIdOnly = await prisma.gameMove.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameMoveUpdateManyAndReturnArgs>(args: SelectSubset<T, GameMoveUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameMove.
     * @param {GameMoveUpsertArgs} args - Arguments to update or create a GameMove.
     * @example
     * // Update or create a GameMove
     * const gameMove = await prisma.gameMove.upsert({
     *   create: {
     *     // ... data to create a GameMove
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameMove we want to update
     *   }
     * })
     */
    upsert<T extends GameMoveUpsertArgs>(args: SelectSubset<T, GameMoveUpsertArgs<ExtArgs>>): Prisma__GameMoveClient<$Result.GetResult<Prisma.$GameMovePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameMoves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveCountArgs} args - Arguments to filter GameMoves to count.
     * @example
     * // Count the number of GameMoves
     * const count = await prisma.gameMove.count({
     *   where: {
     *     // ... the filter for the GameMoves we want to count
     *   }
     * })
    **/
    count<T extends GameMoveCountArgs>(
      args?: Subset<T, GameMoveCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameMoveCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameMove.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameMoveAggregateArgs>(args: Subset<T, GameMoveAggregateArgs>): Prisma.PrismaPromise<GetGameMoveAggregateType<T>>

    /**
     * Group by GameMove.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameMoveGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameMoveGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameMoveGroupByArgs['orderBy'] }
        : { orderBy?: GameMoveGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameMoveGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameMoveGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameMove model
   */
  readonly fields: GameMoveFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameMove.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameMoveClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends GameDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameDefaultArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameMove model
   */
  interface GameMoveFieldRefs {
    readonly id: FieldRef<"GameMove", 'BigInt'>
    readonly gameId: FieldRef<"GameMove", 'String'>
    readonly moveNumber: FieldRef<"GameMove", 'Int'>
    readonly moveSan: FieldRef<"GameMove", 'String'>
    readonly moveUci: FieldRef<"GameMove", 'String'>
    readonly fen: FieldRef<"GameMove", 'String'>
    readonly timeLeftWhite: FieldRef<"GameMove", 'Int'>
    readonly timeLeftBlack: FieldRef<"GameMove", 'Int'>
    readonly createdAt: FieldRef<"GameMove", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameMove findUnique
   */
  export type GameMoveFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * Filter, which GameMove to fetch.
     */
    where: GameMoveWhereUniqueInput
  }

  /**
   * GameMove findUniqueOrThrow
   */
  export type GameMoveFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * Filter, which GameMove to fetch.
     */
    where: GameMoveWhereUniqueInput
  }

  /**
   * GameMove findFirst
   */
  export type GameMoveFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * Filter, which GameMove to fetch.
     */
    where?: GameMoveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameMoves to fetch.
     */
    orderBy?: GameMoveOrderByWithRelationInput | GameMoveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameMoves.
     */
    cursor?: GameMoveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameMoves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameMoves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameMoves.
     */
    distinct?: GameMoveScalarFieldEnum | GameMoveScalarFieldEnum[]
  }

  /**
   * GameMove findFirstOrThrow
   */
  export type GameMoveFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * Filter, which GameMove to fetch.
     */
    where?: GameMoveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameMoves to fetch.
     */
    orderBy?: GameMoveOrderByWithRelationInput | GameMoveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameMoves.
     */
    cursor?: GameMoveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameMoves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameMoves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameMoves.
     */
    distinct?: GameMoveScalarFieldEnum | GameMoveScalarFieldEnum[]
  }

  /**
   * GameMove findMany
   */
  export type GameMoveFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * Filter, which GameMoves to fetch.
     */
    where?: GameMoveWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameMoves to fetch.
     */
    orderBy?: GameMoveOrderByWithRelationInput | GameMoveOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameMoves.
     */
    cursor?: GameMoveWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameMoves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameMoves.
     */
    skip?: number
    distinct?: GameMoveScalarFieldEnum | GameMoveScalarFieldEnum[]
  }

  /**
   * GameMove create
   */
  export type GameMoveCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * The data needed to create a GameMove.
     */
    data: XOR<GameMoveCreateInput, GameMoveUncheckedCreateInput>
  }

  /**
   * GameMove createMany
   */
  export type GameMoveCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameMoves.
     */
    data: GameMoveCreateManyInput | GameMoveCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameMove createManyAndReturn
   */
  export type GameMoveCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * The data used to create many GameMoves.
     */
    data: GameMoveCreateManyInput | GameMoveCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameMove update
   */
  export type GameMoveUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * The data needed to update a GameMove.
     */
    data: XOR<GameMoveUpdateInput, GameMoveUncheckedUpdateInput>
    /**
     * Choose, which GameMove to update.
     */
    where: GameMoveWhereUniqueInput
  }

  /**
   * GameMove updateMany
   */
  export type GameMoveUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameMoves.
     */
    data: XOR<GameMoveUpdateManyMutationInput, GameMoveUncheckedUpdateManyInput>
    /**
     * Filter which GameMoves to update
     */
    where?: GameMoveWhereInput
    /**
     * Limit how many GameMoves to update.
     */
    limit?: number
  }

  /**
   * GameMove updateManyAndReturn
   */
  export type GameMoveUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * The data used to update GameMoves.
     */
    data: XOR<GameMoveUpdateManyMutationInput, GameMoveUncheckedUpdateManyInput>
    /**
     * Filter which GameMoves to update
     */
    where?: GameMoveWhereInput
    /**
     * Limit how many GameMoves to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameMove upsert
   */
  export type GameMoveUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * The filter to search for the GameMove to update in case it exists.
     */
    where: GameMoveWhereUniqueInput
    /**
     * In case the GameMove found by the `where` argument doesn't exist, create a new GameMove with this data.
     */
    create: XOR<GameMoveCreateInput, GameMoveUncheckedCreateInput>
    /**
     * In case the GameMove was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameMoveUpdateInput, GameMoveUncheckedUpdateInput>
  }

  /**
   * GameMove delete
   */
  export type GameMoveDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
    /**
     * Filter which GameMove to delete.
     */
    where: GameMoveWhereUniqueInput
  }

  /**
   * GameMove deleteMany
   */
  export type GameMoveDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameMoves to delete
     */
    where?: GameMoveWhereInput
    /**
     * Limit how many GameMoves to delete.
     */
    limit?: number
  }

  /**
   * GameMove without action
   */
  export type GameMoveDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameMove
     */
    select?: GameMoveSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameMove
     */
    omit?: GameMoveOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameMoveInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    username: 'username',
    rating: 'rating',
    totalGames: 'totalGames',
    wins: 'wins',
    losses: 'losses',
    draws: 'draws',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const CredentialsScalarFieldEnum: {
    profileId: 'profileId',
    passwordHash: 'passwordHash'
  };

  export type CredentialsScalarFieldEnum = (typeof CredentialsScalarFieldEnum)[keyof typeof CredentialsScalarFieldEnum]


  export const GameScalarFieldEnum: {
    id: 'id',
    whitePlayerId: 'whitePlayerId',
    blackPlayerId: 'blackPlayerId',
    winner: 'winner',
    resultReason: 'resultReason',
    pgn: 'pgn',
    initialWhiteRating: 'initialWhiteRating',
    initialBlackRating: 'initialBlackRating',
    whiteRatingChange: 'whiteRatingChange',
    blackRatingChange: 'blackRatingChange',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    createdAt: 'createdAt'
  };

  export type GameScalarFieldEnum = (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum]


  export const GameMoveScalarFieldEnum: {
    id: 'id',
    gameId: 'gameId',
    moveNumber: 'moveNumber',
    moveSan: 'moveSan',
    moveUci: 'moveUci',
    fen: 'fen',
    timeLeftWhite: 'timeLeftWhite',
    timeLeftBlack: 'timeLeftBlack',
    createdAt: 'createdAt'
  };

  export type GameMoveScalarFieldEnum = (typeof GameMoveScalarFieldEnum)[keyof typeof GameMoveScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: StringFilter<"Profile"> | string
    username?: StringFilter<"Profile"> | string
    rating?: IntFilter<"Profile"> | number
    totalGames?: IntFilter<"Profile"> | number
    wins?: IntFilter<"Profile"> | number
    losses?: IntFilter<"Profile"> | number
    draws?: IntFilter<"Profile"> | number
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    credentials?: XOR<CredentialsNullableScalarRelationFilter, CredentialsWhereInput> | null
    gamesAsWhite?: GameListRelationFilter
    gamesAsBlack?: GameListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    credentials?: CredentialsOrderByWithRelationInput
    gamesAsWhite?: GameOrderByRelationAggregateInput
    gamesAsBlack?: GameOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    rating?: IntFilter<"Profile"> | number
    totalGames?: IntFilter<"Profile"> | number
    wins?: IntFilter<"Profile"> | number
    losses?: IntFilter<"Profile"> | number
    draws?: IntFilter<"Profile"> | number
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    credentials?: XOR<CredentialsNullableScalarRelationFilter, CredentialsWhereInput> | null
    gamesAsWhite?: GameListRelationFilter
    gamesAsBlack?: GameListRelationFilter
  }, "id" | "username">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _avg?: ProfileAvgOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
    _sum?: ProfileSumOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Profile"> | string
    username?: StringWithAggregatesFilter<"Profile"> | string
    rating?: IntWithAggregatesFilter<"Profile"> | number
    totalGames?: IntWithAggregatesFilter<"Profile"> | number
    wins?: IntWithAggregatesFilter<"Profile"> | number
    losses?: IntWithAggregatesFilter<"Profile"> | number
    draws?: IntWithAggregatesFilter<"Profile"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type CredentialsWhereInput = {
    AND?: CredentialsWhereInput | CredentialsWhereInput[]
    OR?: CredentialsWhereInput[]
    NOT?: CredentialsWhereInput | CredentialsWhereInput[]
    profileId?: StringFilter<"Credentials"> | string
    passwordHash?: StringFilter<"Credentials"> | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type CredentialsOrderByWithRelationInput = {
    profileId?: SortOrder
    passwordHash?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type CredentialsWhereUniqueInput = Prisma.AtLeast<{
    profileId?: string
    AND?: CredentialsWhereInput | CredentialsWhereInput[]
    OR?: CredentialsWhereInput[]
    NOT?: CredentialsWhereInput | CredentialsWhereInput[]
    passwordHash?: StringFilter<"Credentials"> | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "profileId">

  export type CredentialsOrderByWithAggregationInput = {
    profileId?: SortOrder
    passwordHash?: SortOrder
    _count?: CredentialsCountOrderByAggregateInput
    _max?: CredentialsMaxOrderByAggregateInput
    _min?: CredentialsMinOrderByAggregateInput
  }

  export type CredentialsScalarWhereWithAggregatesInput = {
    AND?: CredentialsScalarWhereWithAggregatesInput | CredentialsScalarWhereWithAggregatesInput[]
    OR?: CredentialsScalarWhereWithAggregatesInput[]
    NOT?: CredentialsScalarWhereWithAggregatesInput | CredentialsScalarWhereWithAggregatesInput[]
    profileId?: StringWithAggregatesFilter<"Credentials"> | string
    passwordHash?: StringWithAggregatesFilter<"Credentials"> | string
  }

  export type GameWhereInput = {
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    id?: StringFilter<"Game"> | string
    whitePlayerId?: StringNullableFilter<"Game"> | string | null
    blackPlayerId?: StringNullableFilter<"Game"> | string | null
    winner?: StringNullableFilter<"Game"> | string | null
    resultReason?: StringNullableFilter<"Game"> | string | null
    pgn?: StringNullableFilter<"Game"> | string | null
    initialWhiteRating?: IntFilter<"Game"> | number
    initialBlackRating?: IntFilter<"Game"> | number
    whiteRatingChange?: IntNullableFilter<"Game"> | number | null
    blackRatingChange?: IntNullableFilter<"Game"> | number | null
    startedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    moves?: GameMoveListRelationFilter
    whitePlayer?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    blackPlayer?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
  }

  export type GameOrderByWithRelationInput = {
    id?: SortOrder
    whitePlayerId?: SortOrderInput | SortOrder
    blackPlayerId?: SortOrderInput | SortOrder
    winner?: SortOrderInput | SortOrder
    resultReason?: SortOrderInput | SortOrder
    pgn?: SortOrderInput | SortOrder
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrderInput | SortOrder
    blackRatingChange?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    finishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    moves?: GameMoveOrderByRelationAggregateInput
    whitePlayer?: ProfileOrderByWithRelationInput
    blackPlayer?: ProfileOrderByWithRelationInput
  }

  export type GameWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    whitePlayerId?: StringNullableFilter<"Game"> | string | null
    blackPlayerId?: StringNullableFilter<"Game"> | string | null
    winner?: StringNullableFilter<"Game"> | string | null
    resultReason?: StringNullableFilter<"Game"> | string | null
    pgn?: StringNullableFilter<"Game"> | string | null
    initialWhiteRating?: IntFilter<"Game"> | number
    initialBlackRating?: IntFilter<"Game"> | number
    whiteRatingChange?: IntNullableFilter<"Game"> | number | null
    blackRatingChange?: IntNullableFilter<"Game"> | number | null
    startedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    moves?: GameMoveListRelationFilter
    whitePlayer?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    blackPlayer?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
  }, "id">

  export type GameOrderByWithAggregationInput = {
    id?: SortOrder
    whitePlayerId?: SortOrderInput | SortOrder
    blackPlayerId?: SortOrderInput | SortOrder
    winner?: SortOrderInput | SortOrder
    resultReason?: SortOrderInput | SortOrder
    pgn?: SortOrderInput | SortOrder
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrderInput | SortOrder
    blackRatingChange?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    finishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: GameCountOrderByAggregateInput
    _avg?: GameAvgOrderByAggregateInput
    _max?: GameMaxOrderByAggregateInput
    _min?: GameMinOrderByAggregateInput
    _sum?: GameSumOrderByAggregateInput
  }

  export type GameScalarWhereWithAggregatesInput = {
    AND?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    OR?: GameScalarWhereWithAggregatesInput[]
    NOT?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Game"> | string
    whitePlayerId?: StringNullableWithAggregatesFilter<"Game"> | string | null
    blackPlayerId?: StringNullableWithAggregatesFilter<"Game"> | string | null
    winner?: StringNullableWithAggregatesFilter<"Game"> | string | null
    resultReason?: StringNullableWithAggregatesFilter<"Game"> | string | null
    pgn?: StringNullableWithAggregatesFilter<"Game"> | string | null
    initialWhiteRating?: IntWithAggregatesFilter<"Game"> | number
    initialBlackRating?: IntWithAggregatesFilter<"Game"> | number
    whiteRatingChange?: IntNullableWithAggregatesFilter<"Game"> | number | null
    blackRatingChange?: IntNullableWithAggregatesFilter<"Game"> | number | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
    finishedAt?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
  }

  export type GameMoveWhereInput = {
    AND?: GameMoveWhereInput | GameMoveWhereInput[]
    OR?: GameMoveWhereInput[]
    NOT?: GameMoveWhereInput | GameMoveWhereInput[]
    id?: BigIntFilter<"GameMove"> | bigint | number
    gameId?: StringFilter<"GameMove"> | string
    moveNumber?: IntFilter<"GameMove"> | number
    moveSan?: StringFilter<"GameMove"> | string
    moveUci?: StringFilter<"GameMove"> | string
    fen?: StringFilter<"GameMove"> | string
    timeLeftWhite?: IntNullableFilter<"GameMove"> | number | null
    timeLeftBlack?: IntNullableFilter<"GameMove"> | number | null
    createdAt?: DateTimeNullableFilter<"GameMove"> | Date | string | null
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
  }

  export type GameMoveOrderByWithRelationInput = {
    id?: SortOrder
    gameId?: SortOrder
    moveNumber?: SortOrder
    moveSan?: SortOrder
    moveUci?: SortOrder
    fen?: SortOrder
    timeLeftWhite?: SortOrderInput | SortOrder
    timeLeftBlack?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    game?: GameOrderByWithRelationInput
  }

  export type GameMoveWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: GameMoveWhereInput | GameMoveWhereInput[]
    OR?: GameMoveWhereInput[]
    NOT?: GameMoveWhereInput | GameMoveWhereInput[]
    gameId?: StringFilter<"GameMove"> | string
    moveNumber?: IntFilter<"GameMove"> | number
    moveSan?: StringFilter<"GameMove"> | string
    moveUci?: StringFilter<"GameMove"> | string
    fen?: StringFilter<"GameMove"> | string
    timeLeftWhite?: IntNullableFilter<"GameMove"> | number | null
    timeLeftBlack?: IntNullableFilter<"GameMove"> | number | null
    createdAt?: DateTimeNullableFilter<"GameMove"> | Date | string | null
    game?: XOR<GameScalarRelationFilter, GameWhereInput>
  }, "id">

  export type GameMoveOrderByWithAggregationInput = {
    id?: SortOrder
    gameId?: SortOrder
    moveNumber?: SortOrder
    moveSan?: SortOrder
    moveUci?: SortOrder
    fen?: SortOrder
    timeLeftWhite?: SortOrderInput | SortOrder
    timeLeftBlack?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: GameMoveCountOrderByAggregateInput
    _avg?: GameMoveAvgOrderByAggregateInput
    _max?: GameMoveMaxOrderByAggregateInput
    _min?: GameMoveMinOrderByAggregateInput
    _sum?: GameMoveSumOrderByAggregateInput
  }

  export type GameMoveScalarWhereWithAggregatesInput = {
    AND?: GameMoveScalarWhereWithAggregatesInput | GameMoveScalarWhereWithAggregatesInput[]
    OR?: GameMoveScalarWhereWithAggregatesInput[]
    NOT?: GameMoveScalarWhereWithAggregatesInput | GameMoveScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"GameMove"> | bigint | number
    gameId?: StringWithAggregatesFilter<"GameMove"> | string
    moveNumber?: IntWithAggregatesFilter<"GameMove"> | number
    moveSan?: StringWithAggregatesFilter<"GameMove"> | string
    moveUci?: StringWithAggregatesFilter<"GameMove"> | string
    fen?: StringWithAggregatesFilter<"GameMove"> | string
    timeLeftWhite?: IntNullableWithAggregatesFilter<"GameMove"> | number | null
    timeLeftBlack?: IntNullableWithAggregatesFilter<"GameMove"> | number | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"GameMove"> | Date | string | null
  }

  export type ProfileCreateInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    credentials?: CredentialsCreateNestedOneWithoutProfileInput
    gamesAsWhite?: GameCreateNestedManyWithoutWhitePlayerInput
    gamesAsBlack?: GameCreateNestedManyWithoutBlackPlayerInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    credentials?: CredentialsUncheckedCreateNestedOneWithoutProfileInput
    gamesAsWhite?: GameUncheckedCreateNestedManyWithoutWhitePlayerInput
    gamesAsBlack?: GameUncheckedCreateNestedManyWithoutBlackPlayerInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: CredentialsUpdateOneWithoutProfileNestedInput
    gamesAsWhite?: GameUpdateManyWithoutWhitePlayerNestedInput
    gamesAsBlack?: GameUpdateManyWithoutBlackPlayerNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: CredentialsUncheckedUpdateOneWithoutProfileNestedInput
    gamesAsWhite?: GameUncheckedUpdateManyWithoutWhitePlayerNestedInput
    gamesAsBlack?: GameUncheckedUpdateManyWithoutBlackPlayerNestedInput
  }

  export type ProfileCreateManyInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CredentialsCreateInput = {
    passwordHash: string
    profile: ProfileCreateNestedOneWithoutCredentialsInput
  }

  export type CredentialsUncheckedCreateInput = {
    profileId: string
    passwordHash: string
  }

  export type CredentialsUpdateInput = {
    passwordHash?: StringFieldUpdateOperationsInput | string
    profile?: ProfileUpdateOneRequiredWithoutCredentialsNestedInput
  }

  export type CredentialsUncheckedUpdateInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type CredentialsCreateManyInput = {
    profileId: string
    passwordHash: string
  }

  export type CredentialsUpdateManyMutationInput = {
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type CredentialsUncheckedUpdateManyInput = {
    profileId?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type GameCreateInput = {
    id?: string
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    moves?: GameMoveCreateNestedManyWithoutGameInput
    whitePlayer?: ProfileCreateNestedOneWithoutGamesAsWhiteInput
    blackPlayer?: ProfileCreateNestedOneWithoutGamesAsBlackInput
  }

  export type GameUncheckedCreateInput = {
    id?: string
    whitePlayerId?: string | null
    blackPlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    moves?: GameMoveUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moves?: GameMoveUpdateManyWithoutGameNestedInput
    whitePlayer?: ProfileUpdateOneWithoutGamesAsWhiteNestedInput
    blackPlayer?: ProfileUpdateOneWithoutGamesAsBlackNestedInput
  }

  export type GameUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    whitePlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    blackPlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moves?: GameMoveUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameCreateManyInput = {
    id?: string
    whitePlayerId?: string | null
    blackPlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type GameUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    whitePlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    blackPlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameMoveCreateInput = {
    id?: bigint | number
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite?: number | null
    timeLeftBlack?: number | null
    createdAt?: Date | string | null
    game: GameCreateNestedOneWithoutMovesInput
  }

  export type GameMoveUncheckedCreateInput = {
    id?: bigint | number
    gameId: string
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite?: number | null
    timeLeftBlack?: number | null
    createdAt?: Date | string | null
  }

  export type GameMoveUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    game?: GameUpdateOneRequiredWithoutMovesNestedInput
  }

  export type GameMoveUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    gameId?: StringFieldUpdateOperationsInput | string
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameMoveCreateManyInput = {
    id?: bigint | number
    gameId: string
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite?: number | null
    timeLeftBlack?: number | null
    createdAt?: Date | string | null
  }

  export type GameMoveUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameMoveUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    gameId?: StringFieldUpdateOperationsInput | string
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CredentialsNullableScalarRelationFilter = {
    is?: CredentialsWhereInput | null
    isNot?: CredentialsWhereInput | null
  }

  export type GameListRelationFilter = {
    every?: GameWhereInput
    some?: GameWhereInput
    none?: GameWhereInput
  }

  export type GameOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileAvgOrderByAggregateInput = {
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileSumOrderByAggregateInput = {
    rating?: SortOrder
    totalGames?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type CredentialsCountOrderByAggregateInput = {
    profileId?: SortOrder
    passwordHash?: SortOrder
  }

  export type CredentialsMaxOrderByAggregateInput = {
    profileId?: SortOrder
    passwordHash?: SortOrder
  }

  export type CredentialsMinOrderByAggregateInput = {
    profileId?: SortOrder
    passwordHash?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type GameMoveListRelationFilter = {
    every?: GameMoveWhereInput
    some?: GameMoveWhereInput
    none?: GameMoveWhereInput
  }

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GameMoveOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameCountOrderByAggregateInput = {
    id?: SortOrder
    whitePlayerId?: SortOrder
    blackPlayerId?: SortOrder
    winner?: SortOrder
    resultReason?: SortOrder
    pgn?: SortOrder
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrder
    blackRatingChange?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GameAvgOrderByAggregateInput = {
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrder
    blackRatingChange?: SortOrder
  }

  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder
    whitePlayerId?: SortOrder
    blackPlayerId?: SortOrder
    winner?: SortOrder
    resultReason?: SortOrder
    pgn?: SortOrder
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrder
    blackRatingChange?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GameMinOrderByAggregateInput = {
    id?: SortOrder
    whitePlayerId?: SortOrder
    blackPlayerId?: SortOrder
    winner?: SortOrder
    resultReason?: SortOrder
    pgn?: SortOrder
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrder
    blackRatingChange?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GameSumOrderByAggregateInput = {
    initialWhiteRating?: SortOrder
    initialBlackRating?: SortOrder
    whiteRatingChange?: SortOrder
    blackRatingChange?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type GameScalarRelationFilter = {
    is?: GameWhereInput
    isNot?: GameWhereInput
  }

  export type GameMoveCountOrderByAggregateInput = {
    id?: SortOrder
    gameId?: SortOrder
    moveNumber?: SortOrder
    moveSan?: SortOrder
    moveUci?: SortOrder
    fen?: SortOrder
    timeLeftWhite?: SortOrder
    timeLeftBlack?: SortOrder
    createdAt?: SortOrder
  }

  export type GameMoveAvgOrderByAggregateInput = {
    id?: SortOrder
    moveNumber?: SortOrder
    timeLeftWhite?: SortOrder
    timeLeftBlack?: SortOrder
  }

  export type GameMoveMaxOrderByAggregateInput = {
    id?: SortOrder
    gameId?: SortOrder
    moveNumber?: SortOrder
    moveSan?: SortOrder
    moveUci?: SortOrder
    fen?: SortOrder
    timeLeftWhite?: SortOrder
    timeLeftBlack?: SortOrder
    createdAt?: SortOrder
  }

  export type GameMoveMinOrderByAggregateInput = {
    id?: SortOrder
    gameId?: SortOrder
    moveNumber?: SortOrder
    moveSan?: SortOrder
    moveUci?: SortOrder
    fen?: SortOrder
    timeLeftWhite?: SortOrder
    timeLeftBlack?: SortOrder
    createdAt?: SortOrder
  }

  export type GameMoveSumOrderByAggregateInput = {
    id?: SortOrder
    moveNumber?: SortOrder
    timeLeftWhite?: SortOrder
    timeLeftBlack?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type CredentialsCreateNestedOneWithoutProfileInput = {
    create?: XOR<CredentialsCreateWithoutProfileInput, CredentialsUncheckedCreateWithoutProfileInput>
    connectOrCreate?: CredentialsCreateOrConnectWithoutProfileInput
    connect?: CredentialsWhereUniqueInput
  }

  export type GameCreateNestedManyWithoutWhitePlayerInput = {
    create?: XOR<GameCreateWithoutWhitePlayerInput, GameUncheckedCreateWithoutWhitePlayerInput> | GameCreateWithoutWhitePlayerInput[] | GameUncheckedCreateWithoutWhitePlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhitePlayerInput | GameCreateOrConnectWithoutWhitePlayerInput[]
    createMany?: GameCreateManyWhitePlayerInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type GameCreateNestedManyWithoutBlackPlayerInput = {
    create?: XOR<GameCreateWithoutBlackPlayerInput, GameUncheckedCreateWithoutBlackPlayerInput> | GameCreateWithoutBlackPlayerInput[] | GameUncheckedCreateWithoutBlackPlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackPlayerInput | GameCreateOrConnectWithoutBlackPlayerInput[]
    createMany?: GameCreateManyBlackPlayerInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type CredentialsUncheckedCreateNestedOneWithoutProfileInput = {
    create?: XOR<CredentialsCreateWithoutProfileInput, CredentialsUncheckedCreateWithoutProfileInput>
    connectOrCreate?: CredentialsCreateOrConnectWithoutProfileInput
    connect?: CredentialsWhereUniqueInput
  }

  export type GameUncheckedCreateNestedManyWithoutWhitePlayerInput = {
    create?: XOR<GameCreateWithoutWhitePlayerInput, GameUncheckedCreateWithoutWhitePlayerInput> | GameCreateWithoutWhitePlayerInput[] | GameUncheckedCreateWithoutWhitePlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhitePlayerInput | GameCreateOrConnectWithoutWhitePlayerInput[]
    createMany?: GameCreateManyWhitePlayerInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutBlackPlayerInput = {
    create?: XOR<GameCreateWithoutBlackPlayerInput, GameUncheckedCreateWithoutBlackPlayerInput> | GameCreateWithoutBlackPlayerInput[] | GameUncheckedCreateWithoutBlackPlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackPlayerInput | GameCreateOrConnectWithoutBlackPlayerInput[]
    createMany?: GameCreateManyBlackPlayerInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CredentialsUpdateOneWithoutProfileNestedInput = {
    create?: XOR<CredentialsCreateWithoutProfileInput, CredentialsUncheckedCreateWithoutProfileInput>
    connectOrCreate?: CredentialsCreateOrConnectWithoutProfileInput
    upsert?: CredentialsUpsertWithoutProfileInput
    disconnect?: CredentialsWhereInput | boolean
    delete?: CredentialsWhereInput | boolean
    connect?: CredentialsWhereUniqueInput
    update?: XOR<XOR<CredentialsUpdateToOneWithWhereWithoutProfileInput, CredentialsUpdateWithoutProfileInput>, CredentialsUncheckedUpdateWithoutProfileInput>
  }

  export type GameUpdateManyWithoutWhitePlayerNestedInput = {
    create?: XOR<GameCreateWithoutWhitePlayerInput, GameUncheckedCreateWithoutWhitePlayerInput> | GameCreateWithoutWhitePlayerInput[] | GameUncheckedCreateWithoutWhitePlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhitePlayerInput | GameCreateOrConnectWithoutWhitePlayerInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutWhitePlayerInput | GameUpsertWithWhereUniqueWithoutWhitePlayerInput[]
    createMany?: GameCreateManyWhitePlayerInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutWhitePlayerInput | GameUpdateWithWhereUniqueWithoutWhitePlayerInput[]
    updateMany?: GameUpdateManyWithWhereWithoutWhitePlayerInput | GameUpdateManyWithWhereWithoutWhitePlayerInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type GameUpdateManyWithoutBlackPlayerNestedInput = {
    create?: XOR<GameCreateWithoutBlackPlayerInput, GameUncheckedCreateWithoutBlackPlayerInput> | GameCreateWithoutBlackPlayerInput[] | GameUncheckedCreateWithoutBlackPlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackPlayerInput | GameCreateOrConnectWithoutBlackPlayerInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutBlackPlayerInput | GameUpsertWithWhereUniqueWithoutBlackPlayerInput[]
    createMany?: GameCreateManyBlackPlayerInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutBlackPlayerInput | GameUpdateWithWhereUniqueWithoutBlackPlayerInput[]
    updateMany?: GameUpdateManyWithWhereWithoutBlackPlayerInput | GameUpdateManyWithWhereWithoutBlackPlayerInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type CredentialsUncheckedUpdateOneWithoutProfileNestedInput = {
    create?: XOR<CredentialsCreateWithoutProfileInput, CredentialsUncheckedCreateWithoutProfileInput>
    connectOrCreate?: CredentialsCreateOrConnectWithoutProfileInput
    upsert?: CredentialsUpsertWithoutProfileInput
    disconnect?: CredentialsWhereInput | boolean
    delete?: CredentialsWhereInput | boolean
    connect?: CredentialsWhereUniqueInput
    update?: XOR<XOR<CredentialsUpdateToOneWithWhereWithoutProfileInput, CredentialsUpdateWithoutProfileInput>, CredentialsUncheckedUpdateWithoutProfileInput>
  }

  export type GameUncheckedUpdateManyWithoutWhitePlayerNestedInput = {
    create?: XOR<GameCreateWithoutWhitePlayerInput, GameUncheckedCreateWithoutWhitePlayerInput> | GameCreateWithoutWhitePlayerInput[] | GameUncheckedCreateWithoutWhitePlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWhitePlayerInput | GameCreateOrConnectWithoutWhitePlayerInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutWhitePlayerInput | GameUpsertWithWhereUniqueWithoutWhitePlayerInput[]
    createMany?: GameCreateManyWhitePlayerInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutWhitePlayerInput | GameUpdateWithWhereUniqueWithoutWhitePlayerInput[]
    updateMany?: GameUpdateManyWithWhereWithoutWhitePlayerInput | GameUpdateManyWithWhereWithoutWhitePlayerInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutBlackPlayerNestedInput = {
    create?: XOR<GameCreateWithoutBlackPlayerInput, GameUncheckedCreateWithoutBlackPlayerInput> | GameCreateWithoutBlackPlayerInput[] | GameUncheckedCreateWithoutBlackPlayerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutBlackPlayerInput | GameCreateOrConnectWithoutBlackPlayerInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutBlackPlayerInput | GameUpsertWithWhereUniqueWithoutBlackPlayerInput[]
    createMany?: GameCreateManyBlackPlayerInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutBlackPlayerInput | GameUpdateWithWhereUniqueWithoutBlackPlayerInput[]
    updateMany?: GameUpdateManyWithWhereWithoutBlackPlayerInput | GameUpdateManyWithWhereWithoutBlackPlayerInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutCredentialsInput = {
    create?: XOR<ProfileCreateWithoutCredentialsInput, ProfileUncheckedCreateWithoutCredentialsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCredentialsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutCredentialsNestedInput = {
    create?: XOR<ProfileCreateWithoutCredentialsInput, ProfileUncheckedCreateWithoutCredentialsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCredentialsInput
    upsert?: ProfileUpsertWithoutCredentialsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutCredentialsInput, ProfileUpdateWithoutCredentialsInput>, ProfileUncheckedUpdateWithoutCredentialsInput>
  }

  export type GameMoveCreateNestedManyWithoutGameInput = {
    create?: XOR<GameMoveCreateWithoutGameInput, GameMoveUncheckedCreateWithoutGameInput> | GameMoveCreateWithoutGameInput[] | GameMoveUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameMoveCreateOrConnectWithoutGameInput | GameMoveCreateOrConnectWithoutGameInput[]
    createMany?: GameMoveCreateManyGameInputEnvelope
    connect?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
  }

  export type ProfileCreateNestedOneWithoutGamesAsWhiteInput = {
    create?: XOR<ProfileCreateWithoutGamesAsWhiteInput, ProfileUncheckedCreateWithoutGamesAsWhiteInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutGamesAsWhiteInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileCreateNestedOneWithoutGamesAsBlackInput = {
    create?: XOR<ProfileCreateWithoutGamesAsBlackInput, ProfileUncheckedCreateWithoutGamesAsBlackInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutGamesAsBlackInput
    connect?: ProfileWhereUniqueInput
  }

  export type GameMoveUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<GameMoveCreateWithoutGameInput, GameMoveUncheckedCreateWithoutGameInput> | GameMoveCreateWithoutGameInput[] | GameMoveUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameMoveCreateOrConnectWithoutGameInput | GameMoveCreateOrConnectWithoutGameInput[]
    createMany?: GameMoveCreateManyGameInputEnvelope
    connect?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type GameMoveUpdateManyWithoutGameNestedInput = {
    create?: XOR<GameMoveCreateWithoutGameInput, GameMoveUncheckedCreateWithoutGameInput> | GameMoveCreateWithoutGameInput[] | GameMoveUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameMoveCreateOrConnectWithoutGameInput | GameMoveCreateOrConnectWithoutGameInput[]
    upsert?: GameMoveUpsertWithWhereUniqueWithoutGameInput | GameMoveUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: GameMoveCreateManyGameInputEnvelope
    set?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    disconnect?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    delete?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    connect?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    update?: GameMoveUpdateWithWhereUniqueWithoutGameInput | GameMoveUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: GameMoveUpdateManyWithWhereWithoutGameInput | GameMoveUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: GameMoveScalarWhereInput | GameMoveScalarWhereInput[]
  }

  export type ProfileUpdateOneWithoutGamesAsWhiteNestedInput = {
    create?: XOR<ProfileCreateWithoutGamesAsWhiteInput, ProfileUncheckedCreateWithoutGamesAsWhiteInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutGamesAsWhiteInput
    upsert?: ProfileUpsertWithoutGamesAsWhiteInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutGamesAsWhiteInput, ProfileUpdateWithoutGamesAsWhiteInput>, ProfileUncheckedUpdateWithoutGamesAsWhiteInput>
  }

  export type ProfileUpdateOneWithoutGamesAsBlackNestedInput = {
    create?: XOR<ProfileCreateWithoutGamesAsBlackInput, ProfileUncheckedCreateWithoutGamesAsBlackInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutGamesAsBlackInput
    upsert?: ProfileUpsertWithoutGamesAsBlackInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutGamesAsBlackInput, ProfileUpdateWithoutGamesAsBlackInput>, ProfileUncheckedUpdateWithoutGamesAsBlackInput>
  }

  export type GameMoveUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<GameMoveCreateWithoutGameInput, GameMoveUncheckedCreateWithoutGameInput> | GameMoveCreateWithoutGameInput[] | GameMoveUncheckedCreateWithoutGameInput[]
    connectOrCreate?: GameMoveCreateOrConnectWithoutGameInput | GameMoveCreateOrConnectWithoutGameInput[]
    upsert?: GameMoveUpsertWithWhereUniqueWithoutGameInput | GameMoveUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: GameMoveCreateManyGameInputEnvelope
    set?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    disconnect?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    delete?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    connect?: GameMoveWhereUniqueInput | GameMoveWhereUniqueInput[]
    update?: GameMoveUpdateWithWhereUniqueWithoutGameInput | GameMoveUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: GameMoveUpdateManyWithWhereWithoutGameInput | GameMoveUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: GameMoveScalarWhereInput | GameMoveScalarWhereInput[]
  }

  export type GameCreateNestedOneWithoutMovesInput = {
    create?: XOR<GameCreateWithoutMovesInput, GameUncheckedCreateWithoutMovesInput>
    connectOrCreate?: GameCreateOrConnectWithoutMovesInput
    connect?: GameWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type GameUpdateOneRequiredWithoutMovesNestedInput = {
    create?: XOR<GameCreateWithoutMovesInput, GameUncheckedCreateWithoutMovesInput>
    connectOrCreate?: GameCreateOrConnectWithoutMovesInput
    upsert?: GameUpsertWithoutMovesInput
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutMovesInput, GameUpdateWithoutMovesInput>, GameUncheckedUpdateWithoutMovesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type CredentialsCreateWithoutProfileInput = {
    passwordHash: string
  }

  export type CredentialsUncheckedCreateWithoutProfileInput = {
    passwordHash: string
  }

  export type CredentialsCreateOrConnectWithoutProfileInput = {
    where: CredentialsWhereUniqueInput
    create: XOR<CredentialsCreateWithoutProfileInput, CredentialsUncheckedCreateWithoutProfileInput>
  }

  export type GameCreateWithoutWhitePlayerInput = {
    id?: string
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    moves?: GameMoveCreateNestedManyWithoutGameInput
    blackPlayer?: ProfileCreateNestedOneWithoutGamesAsBlackInput
  }

  export type GameUncheckedCreateWithoutWhitePlayerInput = {
    id?: string
    blackPlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    moves?: GameMoveUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutWhitePlayerInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutWhitePlayerInput, GameUncheckedCreateWithoutWhitePlayerInput>
  }

  export type GameCreateManyWhitePlayerInputEnvelope = {
    data: GameCreateManyWhitePlayerInput | GameCreateManyWhitePlayerInput[]
    skipDuplicates?: boolean
  }

  export type GameCreateWithoutBlackPlayerInput = {
    id?: string
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    moves?: GameMoveCreateNestedManyWithoutGameInput
    whitePlayer?: ProfileCreateNestedOneWithoutGamesAsWhiteInput
  }

  export type GameUncheckedCreateWithoutBlackPlayerInput = {
    id?: string
    whitePlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    moves?: GameMoveUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutBlackPlayerInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutBlackPlayerInput, GameUncheckedCreateWithoutBlackPlayerInput>
  }

  export type GameCreateManyBlackPlayerInputEnvelope = {
    data: GameCreateManyBlackPlayerInput | GameCreateManyBlackPlayerInput[]
    skipDuplicates?: boolean
  }

  export type CredentialsUpsertWithoutProfileInput = {
    update: XOR<CredentialsUpdateWithoutProfileInput, CredentialsUncheckedUpdateWithoutProfileInput>
    create: XOR<CredentialsCreateWithoutProfileInput, CredentialsUncheckedCreateWithoutProfileInput>
    where?: CredentialsWhereInput
  }

  export type CredentialsUpdateToOneWithWhereWithoutProfileInput = {
    where?: CredentialsWhereInput
    data: XOR<CredentialsUpdateWithoutProfileInput, CredentialsUncheckedUpdateWithoutProfileInput>
  }

  export type CredentialsUpdateWithoutProfileInput = {
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type CredentialsUncheckedUpdateWithoutProfileInput = {
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type GameUpsertWithWhereUniqueWithoutWhitePlayerInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutWhitePlayerInput, GameUncheckedUpdateWithoutWhitePlayerInput>
    create: XOR<GameCreateWithoutWhitePlayerInput, GameUncheckedCreateWithoutWhitePlayerInput>
  }

  export type GameUpdateWithWhereUniqueWithoutWhitePlayerInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutWhitePlayerInput, GameUncheckedUpdateWithoutWhitePlayerInput>
  }

  export type GameUpdateManyWithWhereWithoutWhitePlayerInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutWhitePlayerInput>
  }

  export type GameScalarWhereInput = {
    AND?: GameScalarWhereInput | GameScalarWhereInput[]
    OR?: GameScalarWhereInput[]
    NOT?: GameScalarWhereInput | GameScalarWhereInput[]
    id?: StringFilter<"Game"> | string
    whitePlayerId?: StringNullableFilter<"Game"> | string | null
    blackPlayerId?: StringNullableFilter<"Game"> | string | null
    winner?: StringNullableFilter<"Game"> | string | null
    resultReason?: StringNullableFilter<"Game"> | string | null
    pgn?: StringNullableFilter<"Game"> | string | null
    initialWhiteRating?: IntFilter<"Game"> | number
    initialBlackRating?: IntFilter<"Game"> | number
    whiteRatingChange?: IntNullableFilter<"Game"> | number | null
    blackRatingChange?: IntNullableFilter<"Game"> | number | null
    startedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"Game"> | Date | string | null
  }

  export type GameUpsertWithWhereUniqueWithoutBlackPlayerInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutBlackPlayerInput, GameUncheckedUpdateWithoutBlackPlayerInput>
    create: XOR<GameCreateWithoutBlackPlayerInput, GameUncheckedCreateWithoutBlackPlayerInput>
  }

  export type GameUpdateWithWhereUniqueWithoutBlackPlayerInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutBlackPlayerInput, GameUncheckedUpdateWithoutBlackPlayerInput>
  }

  export type GameUpdateManyWithWhereWithoutBlackPlayerInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutBlackPlayerInput>
  }

  export type ProfileCreateWithoutCredentialsInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    gamesAsWhite?: GameCreateNestedManyWithoutWhitePlayerInput
    gamesAsBlack?: GameCreateNestedManyWithoutBlackPlayerInput
  }

  export type ProfileUncheckedCreateWithoutCredentialsInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    gamesAsWhite?: GameUncheckedCreateNestedManyWithoutWhitePlayerInput
    gamesAsBlack?: GameUncheckedCreateNestedManyWithoutBlackPlayerInput
  }

  export type ProfileCreateOrConnectWithoutCredentialsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutCredentialsInput, ProfileUncheckedCreateWithoutCredentialsInput>
  }

  export type ProfileUpsertWithoutCredentialsInput = {
    update: XOR<ProfileUpdateWithoutCredentialsInput, ProfileUncheckedUpdateWithoutCredentialsInput>
    create: XOR<ProfileCreateWithoutCredentialsInput, ProfileUncheckedCreateWithoutCredentialsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutCredentialsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutCredentialsInput, ProfileUncheckedUpdateWithoutCredentialsInput>
  }

  export type ProfileUpdateWithoutCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gamesAsWhite?: GameUpdateManyWithoutWhitePlayerNestedInput
    gamesAsBlack?: GameUpdateManyWithoutBlackPlayerNestedInput
  }

  export type ProfileUncheckedUpdateWithoutCredentialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gamesAsWhite?: GameUncheckedUpdateManyWithoutWhitePlayerNestedInput
    gamesAsBlack?: GameUncheckedUpdateManyWithoutBlackPlayerNestedInput
  }

  export type GameMoveCreateWithoutGameInput = {
    id?: bigint | number
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite?: number | null
    timeLeftBlack?: number | null
    createdAt?: Date | string | null
  }

  export type GameMoveUncheckedCreateWithoutGameInput = {
    id?: bigint | number
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite?: number | null
    timeLeftBlack?: number | null
    createdAt?: Date | string | null
  }

  export type GameMoveCreateOrConnectWithoutGameInput = {
    where: GameMoveWhereUniqueInput
    create: XOR<GameMoveCreateWithoutGameInput, GameMoveUncheckedCreateWithoutGameInput>
  }

  export type GameMoveCreateManyGameInputEnvelope = {
    data: GameMoveCreateManyGameInput | GameMoveCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type ProfileCreateWithoutGamesAsWhiteInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    credentials?: CredentialsCreateNestedOneWithoutProfileInput
    gamesAsBlack?: GameCreateNestedManyWithoutBlackPlayerInput
  }

  export type ProfileUncheckedCreateWithoutGamesAsWhiteInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    credentials?: CredentialsUncheckedCreateNestedOneWithoutProfileInput
    gamesAsBlack?: GameUncheckedCreateNestedManyWithoutBlackPlayerInput
  }

  export type ProfileCreateOrConnectWithoutGamesAsWhiteInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutGamesAsWhiteInput, ProfileUncheckedCreateWithoutGamesAsWhiteInput>
  }

  export type ProfileCreateWithoutGamesAsBlackInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    credentials?: CredentialsCreateNestedOneWithoutProfileInput
    gamesAsWhite?: GameCreateNestedManyWithoutWhitePlayerInput
  }

  export type ProfileUncheckedCreateWithoutGamesAsBlackInput = {
    id?: string
    username: string
    rating?: number
    totalGames?: number
    wins?: number
    losses?: number
    draws?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    credentials?: CredentialsUncheckedCreateNestedOneWithoutProfileInput
    gamesAsWhite?: GameUncheckedCreateNestedManyWithoutWhitePlayerInput
  }

  export type ProfileCreateOrConnectWithoutGamesAsBlackInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutGamesAsBlackInput, ProfileUncheckedCreateWithoutGamesAsBlackInput>
  }

  export type GameMoveUpsertWithWhereUniqueWithoutGameInput = {
    where: GameMoveWhereUniqueInput
    update: XOR<GameMoveUpdateWithoutGameInput, GameMoveUncheckedUpdateWithoutGameInput>
    create: XOR<GameMoveCreateWithoutGameInput, GameMoveUncheckedCreateWithoutGameInput>
  }

  export type GameMoveUpdateWithWhereUniqueWithoutGameInput = {
    where: GameMoveWhereUniqueInput
    data: XOR<GameMoveUpdateWithoutGameInput, GameMoveUncheckedUpdateWithoutGameInput>
  }

  export type GameMoveUpdateManyWithWhereWithoutGameInput = {
    where: GameMoveScalarWhereInput
    data: XOR<GameMoveUpdateManyMutationInput, GameMoveUncheckedUpdateManyWithoutGameInput>
  }

  export type GameMoveScalarWhereInput = {
    AND?: GameMoveScalarWhereInput | GameMoveScalarWhereInput[]
    OR?: GameMoveScalarWhereInput[]
    NOT?: GameMoveScalarWhereInput | GameMoveScalarWhereInput[]
    id?: BigIntFilter<"GameMove"> | bigint | number
    gameId?: StringFilter<"GameMove"> | string
    moveNumber?: IntFilter<"GameMove"> | number
    moveSan?: StringFilter<"GameMove"> | string
    moveUci?: StringFilter<"GameMove"> | string
    fen?: StringFilter<"GameMove"> | string
    timeLeftWhite?: IntNullableFilter<"GameMove"> | number | null
    timeLeftBlack?: IntNullableFilter<"GameMove"> | number | null
    createdAt?: DateTimeNullableFilter<"GameMove"> | Date | string | null
  }

  export type ProfileUpsertWithoutGamesAsWhiteInput = {
    update: XOR<ProfileUpdateWithoutGamesAsWhiteInput, ProfileUncheckedUpdateWithoutGamesAsWhiteInput>
    create: XOR<ProfileCreateWithoutGamesAsWhiteInput, ProfileUncheckedCreateWithoutGamesAsWhiteInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutGamesAsWhiteInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutGamesAsWhiteInput, ProfileUncheckedUpdateWithoutGamesAsWhiteInput>
  }

  export type ProfileUpdateWithoutGamesAsWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: CredentialsUpdateOneWithoutProfileNestedInput
    gamesAsBlack?: GameUpdateManyWithoutBlackPlayerNestedInput
  }

  export type ProfileUncheckedUpdateWithoutGamesAsWhiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: CredentialsUncheckedUpdateOneWithoutProfileNestedInput
    gamesAsBlack?: GameUncheckedUpdateManyWithoutBlackPlayerNestedInput
  }

  export type ProfileUpsertWithoutGamesAsBlackInput = {
    update: XOR<ProfileUpdateWithoutGamesAsBlackInput, ProfileUncheckedUpdateWithoutGamesAsBlackInput>
    create: XOR<ProfileCreateWithoutGamesAsBlackInput, ProfileUncheckedCreateWithoutGamesAsBlackInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutGamesAsBlackInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutGamesAsBlackInput, ProfileUncheckedUpdateWithoutGamesAsBlackInput>
  }

  export type ProfileUpdateWithoutGamesAsBlackInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: CredentialsUpdateOneWithoutProfileNestedInput
    gamesAsWhite?: GameUpdateManyWithoutWhitePlayerNestedInput
  }

  export type ProfileUncheckedUpdateWithoutGamesAsBlackInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    totalGames?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    credentials?: CredentialsUncheckedUpdateOneWithoutProfileNestedInput
    gamesAsWhite?: GameUncheckedUpdateManyWithoutWhitePlayerNestedInput
  }

  export type GameCreateWithoutMovesInput = {
    id?: string
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
    whitePlayer?: ProfileCreateNestedOneWithoutGamesAsWhiteInput
    blackPlayer?: ProfileCreateNestedOneWithoutGamesAsBlackInput
  }

  export type GameUncheckedCreateWithoutMovesInput = {
    id?: string
    whitePlayerId?: string | null
    blackPlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type GameCreateOrConnectWithoutMovesInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutMovesInput, GameUncheckedCreateWithoutMovesInput>
  }

  export type GameUpsertWithoutMovesInput = {
    update: XOR<GameUpdateWithoutMovesInput, GameUncheckedUpdateWithoutMovesInput>
    create: XOR<GameCreateWithoutMovesInput, GameUncheckedCreateWithoutMovesInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutMovesInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutMovesInput, GameUncheckedUpdateWithoutMovesInput>
  }

  export type GameUpdateWithoutMovesInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    whitePlayer?: ProfileUpdateOneWithoutGamesAsWhiteNestedInput
    blackPlayer?: ProfileUpdateOneWithoutGamesAsBlackNestedInput
  }

  export type GameUncheckedUpdateWithoutMovesInput = {
    id?: StringFieldUpdateOperationsInput | string
    whitePlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    blackPlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameCreateManyWhitePlayerInput = {
    id?: string
    blackPlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type GameCreateManyBlackPlayerInput = {
    id?: string
    whitePlayerId?: string | null
    winner?: string | null
    resultReason?: string | null
    pgn?: string | null
    initialWhiteRating: number
    initialBlackRating: number
    whiteRatingChange?: number | null
    blackRatingChange?: number | null
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type GameUpdateWithoutWhitePlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moves?: GameMoveUpdateManyWithoutGameNestedInput
    blackPlayer?: ProfileUpdateOneWithoutGamesAsBlackNestedInput
  }

  export type GameUncheckedUpdateWithoutWhitePlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    blackPlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moves?: GameMoveUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutWhitePlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    blackPlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameUpdateWithoutBlackPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moves?: GameMoveUpdateManyWithoutGameNestedInput
    whitePlayer?: ProfileUpdateOneWithoutGamesAsWhiteNestedInput
  }

  export type GameUncheckedUpdateWithoutBlackPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    whitePlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moves?: GameMoveUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutBlackPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    whitePlayerId?: NullableStringFieldUpdateOperationsInput | string | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    resultReason?: NullableStringFieldUpdateOperationsInput | string | null
    pgn?: NullableStringFieldUpdateOperationsInput | string | null
    initialWhiteRating?: IntFieldUpdateOperationsInput | number
    initialBlackRating?: IntFieldUpdateOperationsInput | number
    whiteRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    blackRatingChange?: NullableIntFieldUpdateOperationsInput | number | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameMoveCreateManyGameInput = {
    id?: bigint | number
    moveNumber: number
    moveSan: string
    moveUci: string
    fen: string
    timeLeftWhite?: number | null
    timeLeftBlack?: number | null
    createdAt?: Date | string | null
  }

  export type GameMoveUpdateWithoutGameInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameMoveUncheckedUpdateWithoutGameInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameMoveUncheckedUpdateManyWithoutGameInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    moveNumber?: IntFieldUpdateOperationsInput | number
    moveSan?: StringFieldUpdateOperationsInput | string
    moveUci?: StringFieldUpdateOperationsInput | string
    fen?: StringFieldUpdateOperationsInput | string
    timeLeftWhite?: NullableIntFieldUpdateOperationsInput | number | null
    timeLeftBlack?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}