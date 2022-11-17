import * as React from 'react';

import { useGridApiContext } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

function CustomSquarePagination() {
  const apiRef = useGridApiContext();
  const { state } = apiRef.current;

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={state.pagination.page + 1}
      count={state.pagination.pageCount}
      renderItem={props2 => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default CustomSquarePagination;
