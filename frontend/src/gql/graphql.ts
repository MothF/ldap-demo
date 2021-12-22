/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** BigDecimal */
  BigDecimal: any;
  /** BigInteger */
  BigInteger: any;
  /** Byte */
  Byte: any;
  /** Char */
  Char: any;
  /** Date */
  Date: any;
  /** DateTime */
  DateTime: any;
  /** LocalDate */
  LocalDate: any;
  /** LocalDateTime */
  LocalDateTime: any;
  /** LocalTime */
  LocalTime: any;
  /** Long */
  Long: any;
  /** OffsetDateTime */
  OffsetDateTime: any;
  /** OffsetTime */
  OffsetTime: any;
  /** Short */
  Short: any;
  /** Time */
  Time: any;
  /** UUID */
  UUID: any;
  /** Void */
  Void: any;
};

export type ConnectionSettingsDto = {
  __typename?: "ConnectionSettingsDto";
  baseDn: Scalars["String"];
  connectionDomainName: Scalars["String"];
  connectionPassword: Scalars["String"];
  urls: Array<Scalars["String"]>;
};

export type ConnectionSettingsDtoInput = {
  baseDn: Scalars["String"];
  connectionDomainName: Scalars["String"];
  connectionPassword: Scalars["String"];
  urls: Array<Scalars["String"]>;
};

export type LdapLogEventDto = {
  __typename?: "LdapLogEventDto";
  date: Scalars["OffsetDateTime"];
  id: Scalars["Long"];
  level: LogLevel;
  logger: Scalars["String"];
  loggerSimpleName: Scalars["String"];
  message: Scalars["String"];
  thread: Scalars["String"];
  throwableClass?: Maybe<Scalars["String"]>;
  throwableMessage?: Maybe<Scalars["String"]>;
};

export enum LogLevel {
  Debug = "DEBUG",
  Error = "ERROR",
  Fatal = "FATAL",
  Info = "INFO",
  Off = "OFF",
  Trace = "TRACE",
  Warn = "WARN",
}

export type MatchingRuleDto = {
  __typename?: "MatchingRuleDto";
  description?: Maybe<Scalars["String"]>;
  entityAttribute: Scalars["String"];
  id?: Maybe<Scalars["Long"]>;
  ldapAttribute: Scalars["String"];
};

export type MatchingRuleDtoInput = {
  description?: InputMaybe<Scalars["String"]>;
  entityAttribute: Scalars["String"];
  id?: InputMaybe<Scalars["Long"]>;
  ldapAttribute: Scalars["String"];
};

/** Mutation root */
export type Mutation = {
  __typename?: "Mutation";
  deleteMatchingRule: Scalars["Boolean"];
  updateConnectionSettings: ConnectionSettingsDto;
  updateMatchingRule: MatchingRuleDto;
};

/** Mutation root */
export type MutationDeleteMatchingRuleArgs = {
  id: Scalars["Long"];
};

/** Mutation root */
export type MutationUpdateConnectionSettingsArgs = {
  connectionSettings: ConnectionSettingsDtoInput;
};

/** Mutation root */
export type MutationUpdateMatchingRuleArgs = {
  matchingRule: MatchingRuleDtoInput;
};

/** Query root */
export type Query = {
  __typename?: "Query";
  connectionSettings: ConnectionSettingsDto;
  findMatchingRule: MatchingRuleDto;
  ldapLogEventList: Array<LdapLogEventDto>;
  listMatchingRules: Array<MatchingRuleDto>;
};

/** Query root */
export type QueryFindMatchingRuleArgs = {
  id: Scalars["Long"];
};
