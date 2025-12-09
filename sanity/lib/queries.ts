import { defineQuery } from "next-sanity"

export const VEHICLE_QUERY = defineQuery(`
  *[_type == "vehicle"]{
  _id,
  brand,
  model,
  price,
  year,
  kilometers,
  fuel,
  gearbox,
  engineSize,
  powerKW,
  doors,
  seats,
  color,
  description,
  views,
  images[]{
    asset->{
      url,  
      metadata { dimensions }
    }
  },
  user->{
    _id,
    name,
    email
  }
}
`)

export const VEHICLE_BY_ID_QUERY = defineQuery(`
  *[_type == "vehicle" && _id == $id][0]{
  _id,
  brand,
  model,
  price,
  year,
  kilometers,
  fuel,
  gearbox,
  engineSize,
  powerKW,
  doors,
  seats,
  color,
  description,
  images[]{asset->{url}},
  user->{_id, name},
  views
}`);
