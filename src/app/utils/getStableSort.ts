import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { IMusic, Order } from "../global";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: QueryDocumentSnapshot<DocumentData, DocumentData>[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [{ ...el.data(), id: el.id }, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function getStableSort<T extends Record<Key, string | number>, Key extends keyof T>(
  data: QueryDocumentSnapshot<DocumentData, DocumentData>[],
  order: Order,
  orderBy: keyof IMusic,
  page: number,
  rowsPerPage: number
) {
  const comparator = getComparator(order, orderBy);
  const sortedData = stableSort(data, comparator);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return sortedData.slice(startIndex, endIndex) as IMusic[];
}
