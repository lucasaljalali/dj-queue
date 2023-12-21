import { IMusic, Order } from "@/app/global";
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

interface TableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IMusic) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof IMusic | "vote";
  label: string;
  numeric: boolean;
}

export default function CustomTableHead(props: TableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof IMusic) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const headCells: readonly HeadCell[] = [
    {
      id: "title",
      numeric: false,
      disablePadding: true,
      label: "Title",
    },
    {
      id: "vote",
      numeric: true,
      disablePadding: false,
      label: "Vote",
    },
    {
      id: "votes",
      numeric: true,
      disablePadding: false,
      label: "Total Votes",
    },
    {
      id: "genre",
      numeric: false,
      disablePadding: false,
      label: "Genre",
    },
    // {
    //   id: "duration",
    //   numeric: true,
    //   disablePadding: false,
    //   label: "Duration (min)",
    // },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === "title" ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={headCell.id !== "vote" ? createSortHandler(headCell.id) : undefined}
              hideSortIcon={headCell.id === "vote"}
              style={{ cursor: headCell.id === "vote" ? "default" : undefined }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
