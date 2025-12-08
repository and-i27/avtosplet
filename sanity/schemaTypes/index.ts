import { type SchemaTypeDefinition } from 'sanity'

import {user} from "@/sanity/schemaTypes/user";
import { vehicle, } from '@/sanity/schemaTypes/vehicle';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    user,
    vehicle
  ],
}
