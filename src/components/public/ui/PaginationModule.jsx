import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import style from '../../../app/Style';

export default function PaginationModule({ currentPage, totalPages, onPageChange }) {
  
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <div className={style.pagination.container}>
      <Stack spacing={2} alignItems="center">
        <Pagination 
          className={style.pagination.pagination}
          count={totalPages} 
          shape="rounded" 
          page={currentPage}
          onChange={handleChange}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          color="primary"
          sx={style.pagination.muiOverrides}
        />
      </Stack>
    </div>
  );
}
