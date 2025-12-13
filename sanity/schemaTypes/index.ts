import { type SchemaTypeDefinition } from 'sanity'

import {user} from "@/sanity/schemaTypes/user";
import { vehicle, } from '@/sanity/schemaTypes/vehicle';
import {brand} from "@/sanity/schemaTypes/brand";
import {color} from "@/sanity/schemaTypes/color";
import {fuel} from "@/sanity/schemaTypes/fuel";
import {gearbox} from "@/sanity/schemaTypes/gearbox";
import {model} from "@/sanity/schemaTypes/model";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    user,
    vehicle,
    brand,
    color,
    fuel,
    gearbox,
    model
  ],
}
