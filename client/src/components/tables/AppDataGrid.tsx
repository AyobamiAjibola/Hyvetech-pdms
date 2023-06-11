import React from 'react';

import { Box, LinearProgress } from '@mui/material';
import { DataGrid, GridColumns, GridOverlay, GridSortModel, GridToolbar } from '@mui/x-data-grid';
import CustomSquarePagination from './CustomSquarePagination';

interface IProps {
  rows: readonly any[];
  columns: GridColumns;
  showToolbar?: boolean;
  sortModel?: GridSortModel;
  loading?: boolean;
  onSortModel?: any;

  [p: string]: any;
}

function AppDataGrid(props: IProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        {...props}
        loading={props.loading}
        pagination
        autoHeight
        pageSize={50}
        rowsPerPageOptions={[50]}
        components={{
          Pagination: CustomSquarePagination,
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: props.showToolbar ? GridToolbar : null,
        }}
        rows={props.rows}
        columns={props.columns}
        sortModel={props.sortModel}
        onSortModelChange={model => {
          if (props.sortModel && props.onSortModel) props.onSortModel(model);
        }}
        disableSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        componentsProps={{
          toolbar: {
            autoComplete: 'off',
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  );
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default AppDataGrid;
