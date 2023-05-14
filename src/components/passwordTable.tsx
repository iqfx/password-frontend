import { Alert, AlertTitle, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const columns: GridColDef[] = [
  {
    field: "passwordName",
    headerName: "Name",
    width: 150,
    editable: false,
  },
  {
    field: "userName",
    headerName: "Username",
    width: 150,
    editable: false,
  },
  {
    field: "password",
    headerName: "Password",
    width: 110,
    editable: false,
  },

];
const rows = [
  { id: 1, passwordName: "Snow", userName: "Jon", password: "hjdshgh" },
  { id: 2, passwordName: "Lannister", userName: "Cersei", password: "hroeih" },
  { id: 3, passwordName: "Lannister", userName: "Jaime", password: "jkdsbvkd" },
  { id: 4, passwordName: "Stark", userName: "Arya", password: "FDSGGW12341" },
  { id: 5, passwordName: "Targaryen", userName: "Daenerys", password: "hfhuo23" },
  { id: 6, passwordName: "Melisandre", userName: null, password: "fqjehvjabqv" },
  { id: 7, passwordName: "Clifford", userName: "Ferrara", password: "dslbvgjdb" },
  { id: 8, passwordName: "Frances", userName: "Rossini", password: "sdkhgown" },
  { id: 9, passwordName: "Roxie", userName: "Harvey", password: "hfslkhvl" },
];
export default function PasswordTable() {
  const [copiedData, setCopiedData] = useState('');

  return (
    <div style={{}}>
      <Alert severity="info" sx={{ width: '100%', mt: 1 }}>
        <AlertTitle>Copied data:</AlertTitle>
        <code
          style={{
            display: 'block',
            maxHeight: 200,
            overflow: 'auto',
            whiteSpace: 'pre-line',
          }}
        >
          {copiedData}
        </code>
      </Alert>
    <Box sx={{ height: 400,width: "70%", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <DataGrid
        rows={rows}
        onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
