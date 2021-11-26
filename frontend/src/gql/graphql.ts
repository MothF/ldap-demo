/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Long type */
  Long: any;
  /** Built-in scalar representing a date-time with a UTC offset */
  OffsetDateTime: any;
  /** Use SPQR's SchemaPrinter to remove this from SDL */
  UNREPRESENTABLE: any;
};

export type LdapLogEventDto = {
  __typename?: 'LdapLogEventDto';
  date?: Maybe<Scalars['OffsetDateTime']>;
  id?: Maybe<Scalars['Long']>;
  level?: Maybe<LogLevel>;
  logger?: Maybe<Scalars['String']>;
  loggerSimpleName?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  thread?: Maybe<Scalars['String']>;
  throwableClass?: Maybe<Scalars['String']>;
  throwableMessage?: Maybe<Scalars['String']>;
};

export enum LogLevel {
  Debug = 'DEBUG',
  Error = 'ERROR',
  Fatal = 'FATAL',
  Info = 'INFO',
  Off = 'OFF',
  Trace = 'TRACE',
  Warn = 'WARN'
}

/** Query root */
export type Query = {
  __typename?: 'Query';
  ldapLogEventList?: Maybe<Array<Maybe<LdapLogEventDto>>>;
};
