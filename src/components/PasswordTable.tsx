import { Alert, AlertTitle, Box, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import EditPasswords from "@/components/EditModal";
import DeleteModal from "./DeleteModal";
import { useUser } from "@auth0/nextjs-auth0/client";
const columns: GridColDef[] = [
  {
    field: "passwordName",
    headerName: "Name",
    flex: 1,
    editable: false,
  },
  {
    field: "userName",
    headerName: "Username",
    flex: 1,
    editable: false,
  },
  {
    field: "password",
    headerName: "Password",
    flex: 1,
    editable: false,
  },
  {
    field: "edit",
    headerName: "Edit",
    sortable: false,
    flex: 1,
    renderCell: (params) => {
      const [parameters, setParameters] = useState(params);

      return (
        <EditPasswords password={parameters} setParameters={setParameters} />
      );
    },
  },
  {
    field: "delete",
    headerName: "Delete",
    sortable: false,
    flex: 1,
    renderCell: (params) => {
      return <DeleteModal password={params} />;
    },
  },
];
const rows = [
  { id: 1, passwordName: "Snow", userName: "Jon", password: "hjdshgh" },
  { id: 2, passwordName: "Lannister", userName: "Cersei", password: "hroeih" },
  { id: 3, passwordName: "Lannister", userName: "Jaime", password: "jkdsbvkd" },
  { id: 4, passwordName: "Stark", userName: "Arya", password: "FDSGGW12341" },
  {
    id: 5,
    passwordName: "Targaryen",
    userName: "Daenerys",
    password: "hfhuo23",
  },
  {
    id: 6,
    passwordName: "Melisandre",
    userName: null,
    password: "fqjehvjabqv",
  },
  {
    id: 7,
    passwordName: "Clifford",
    userName: "Ferrara",
    password: "dslbvgjdb",
  },
  { id: 8, passwordName: "Frances", userName: "Rossini", password: "sdkhgown" },
  { id: 9, passwordName: "Roxie", userName: "Harvey", password: "hfslkhvl" },
];
export default function PasswordTable() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  const [copiedData, setCopiedData] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = (data: string) => {
    setCopiedData(data);
    setOpen(true);
  };
  function DataGridTitle() {
    return (
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Welcome {user?.name}</Typography>
      </Box>
    );
  }
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => {
            handleClose();
          }}
          severity="info"
        >
          <AlertTitle>Copied data:</AlertTitle>
          <code
            style={{
              display: "block",
              maxHeight: 200,
              overflow: "auto",
              whiteSpace: "pre-line",
            }}
          >
            {copiedData}
          </code>
        </Alert>
      </Snackbar>

      <Box
        sx={{
          height: 400,
          width: "70%",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DataGrid
          rows={rows}
          components={{ Toolbar: DataGridTitle }}
          onClipboardCopy={(copiedString) => handleOpen(copiedString)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
}
