import { MetadataStore } from 'breeze-client';

export interface IRegistrationHelper {
    register(meta: MetadataStore): void;
}