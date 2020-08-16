import React, { useEffect, useState } from 'react';
import './Pagination.css';
import { useMessage } from '../../hooks/useMessage';

export const Pagination = ({ currentPage, pageCount, setPage }) => {
  const message = useMessage();

  const nextPageHandler = () => {
    if (currentPage < pageCount) {
      setPage(currentPage + 1);
    }
  };

  const previousPageHandler = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const [nextDisabled, setNextDisabled] = useState(false);
  const [previousDisabled, setPreviousDisabled] = useState(false);

  useEffect(() => {
    if (currentPage === 1) {
      setPreviousDisabled(true);
    } else {
      setPreviousDisabled(false);
    }

    if (currentPage === pageCount) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [currentPage, pageCount]);

  const handleCurrentPageChange = e => {
    if (e.charCode === 13) {
      const value = parseInt(e.target.value);

      if (value >= 1 && value <= pageCount) {
        setPage(value);
      }
    }
  };

  return (
    <div className='pagination'>
      <button
        className='pagination__btn'
        onClick={previousPageHandler}
        disabled={previousDisabled}
      >
        <i className='fas fa-arrow-left'></i>
      </button>
      <div className='pagination__current'>
        <span className='pagination__text'>Current page:</span>
        <input
          className='pagination__input'
          placeholder={currentPage}
          onKeyPress={handleCurrentPageChange}
        />
      </div>
      <div className='pagination__all'>
        <span className='pagination__text'>Last page:</span>{' '}
        <span className='pagination__counter'>{pageCount}</span>
      </div>
      <button
        className='pagination__btn'
        onClick={nextPageHandler}
        disabled={nextDisabled}
      >
        <i className='fas fa-arrow-right'></i>
      </button>
    </div>
  );
};
