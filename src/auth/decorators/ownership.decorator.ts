import { SetMetadata } from '@nestjs/common';

export const RESOURCE_TYPE_KEY = 'resourceType';
export const RequireOwnership = (resourceType: string) => SetMetadata(RESOURCE_TYPE_KEY, resourceType);

