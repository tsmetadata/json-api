export type NonArray<T> = T extends (infer U)[] ? U : T;
