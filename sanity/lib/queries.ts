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