import { IMusic, Order } from "@/app/global";
import {
  AlertColor,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { stableSort } from "./getStableSort";
import { collection, doc, getDoc, increment, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/app/services/firebase";
import { useCookies } from "react-cookie";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TableToolbar from "./TableToolbar";
import CustomTableHead from "./CustomTableHead";
import ResultMessage from "../ResultMessage";

interface VotingListProps {
  djId: string;
}

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

export default function VotingList({ djId }: VotingListProps) {
  const [cookies, setCookie] = useCookies([`${djId}_votes`]);
  const [data, setData] = useState<IMusic[]>([] as IMusic[]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IMusic>("title");
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", severity: "info" as AlertColor });

  let loading = false;

  let currentVotes = cookies[`${djId}_votes`] || [];

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof IMusic) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const visibleRows = useMemo(
    () => stableSort(data, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    event.preventDefault();

    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex >= 0) {
      newSelected = selected.filter((itemId) => itemId !== id);
    }
    setSelected(newSelected);
  };

  const updateCookie = (musicId: string, voted: boolean) => {
    const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));

    if (voted) {
      const index = currentVotes.indexOf(musicId);
      if (index !== -1) {
        currentVotes.splice(index, 1);
        setCookie(`${djId}_votes`, currentVotes, { expires: nextDay });
      }
    } else {
      if (!currentVotes.includes(musicId)) {
        currentVotes.push(musicId);
        setCookie(`${djId}_votes`, currentVotes, { expires: nextDay });
      }
    }
  };

  const handleVoteClick = async (event: React.MouseEvent<unknown>, data: IMusic) => {
    event?.stopPropagation();
    loading = true;

    try {
      const voted = currentVotes.includes(data.id);
      const musicRef = doc(db, "musics", data.id);
      const musicSnapshot = await getDoc(musicRef);
      const currentVotesCount = musicSnapshot?.data()?.votes;
      await updateDoc(musicRef, { votes: increment(voted ? (currentVotesCount <= 0 ? 0 : -1) : 1) });
      setSnackbarState({ open: true, message: "Success!", severity: "success" });
      updateCookie(data.id, voted);
    } catch (error: any) {
      setSnackbarState({ open: true, message: error.code, severity: "error" });
      console.error(error);
    } finally {
      loading = false;
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (djId) {
      const q = query(collection(db, "musics"), where("user", "==", djId));

      onSnapshot(q, (querySnapshot) => {
        let musicsArray: IMusic[] = [];

        querySnapshot.forEach((doc) => {
          musicsArray.push({ ...doc.data(), id: doc.id } as IMusic);
        });

        setData(musicsArray);
      });
    }
  }, [djId]);

  return (
    <Box sx={{ width: "100%" }} id="votingListContainer">
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} djId={djId} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <CustomTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>{"EMPTY"}</TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.title}
                      </TableCell>
                      <TableCell align="right">{row.genre}</TableCell>
                      <TableCell align="right">{row.duration}</TableCell>
                      <TableCell align="right">{row.votes}</TableCell>
                      <TableCell align="right">
                        {
                          <IconButton
                            onClick={(event) => handleVoteClick(event, row)}
                            className={currentVotes.includes(row.id) ? "voteButton voted" : "voteButton"}
                          >
                            <ThumbUpIcon style={{ color: currentVotes.includes(row.id) ? "blue" : undefined }} />
                          </IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ResultMessage state={snackbarState} setState={setSnackbarState} />
    </Box>
  );
}
