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
    brand->{_id, name},
    model->{_id, name},
    price,
    year,
    kilometers,
    fuel->{_id, name},
    gearbox->{_id, name},
    engineSize,
    powerKW,
    doors,
    seats,
    color->{_id, name},
    description,
    images[]{asset->{url}},
    user->{_id, name},
    views
  }
`);


export const VEHICLE_FILTER_QUERY = defineQuery(`
*[
  _type == "vehicle" && 
  (!defined($brand) || brand match $brand + "*") &&
  (!defined($model) || model match $model + "*") &&
  (!defined($fuel) || fuel == $fuel) &&
  (!defined($gearbox) || gearbox == $gearbox) &&
  (!defined($color) || color == $color) &&
  (!defined($minPrice) || price >= $minPrice) &&
  (!defined($maxPrice) || price <= $maxPrice) &&
  (!defined($minYear) || year >= $minYear) &&
  (!defined($maxYear) || year <= $maxYear)
]{
  _id,
  brand,
  model,
  price,
  year,
  kilometers,
  fuel,
  gearbox,
  color,
  powerKW,
  images[]{asset->{url}}
}
`);

