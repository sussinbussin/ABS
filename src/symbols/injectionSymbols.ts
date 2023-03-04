import type { InjectionKey } from "vue";
import type PocketBase from 'pocketbase';

export const pbSymbol: InjectionKey<PocketBase> = Symbol("pb")
