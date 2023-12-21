import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export function stableSort<T>(array: QueryDocumentSnapshot<DocumentData, DocumentData>[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [{ ...el.data(), id: el.id }, index] as [T, number]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
