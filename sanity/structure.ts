import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem("user").title("User"),
      S.documentTypeListItem("vehicle").title("Vehicle"),
      S.documentTypeListItem("brand").title("Brand"),
      S.documentTypeListItem("color").title("Color"),
      S.documentTypeListItem("fuel").title("Fuel"),
      S.documentTypeListItem("gearbox").title("Gerabox"),
      S.documentTypeListItem("model").title("Model"),
    ]);
