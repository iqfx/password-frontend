import { Alert, AlertTitle, Box, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";
import EditPasswords from "@/components/EditModal";
import DeleteModal from "./DeleteModal";
import { useUser } from "@auth0/nextjs-auth0/client";
import AddPasswordModal from "./AddPasswordModal";

export default function PasswordTable() {
  const { user, error, isLoading } = useUser();
  const [copiedData, setCopiedData] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  let fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/password");
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const columns: GridColDef[] = [
    {
      field: "name",
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
        const [parameters] = useState(params);

        return <EditPasswords password={parameters} fetchData={fetchData} />;
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return <DeleteModal password={params} fetchData={fetchData} />;
      },
    },
  ];

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
        <Typography variant="h5">Welcome, {user?.name}</Typography>
      </Box>
    );
  }
  const handleClose = () => setOpen(false);
  return (
    <div>
      <AddPasswordModal fetchData={fetchData} />
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
          rows={data}
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
