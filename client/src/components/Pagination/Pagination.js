import React, { useEffect, useState } from 'react';
import { useMessage } from '../../hooks/useMessage';
import './Pagination.css';

export const Pagination = ({ currentPage, pagesCount, setPage }) => {
  const message = useMessage();

  const nextPageHandler = () => {
    if (currentPage < pagesCount) {
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

    if (currentPage >= pagesCount) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [currentPage, pagesCount]);

  const handleCurrentPageChange = e => {
    if (e.charCode === 13) {
      const value = parseInt(e.target.value);

      if (value >= 1 && value <= pagesCount) {
        setPage(value);
      } else {
        message(`Write page from 1 to ${pagesCount}!`);
        e.target.value = '';
      }
    }
  };

  return (
    <div
      className='pagination-wrapper'
      style={pagesCount === 0 ? { display: 'none' } : null}
    >
      <div className='pagination'>
        <button
          className='pagination__btn'
          onClick={previousPageHandler}
          disabled={previousDisabled}
        >
          {currentPage > 1 ? (
            <i className='fas fa-arrow-left'></i>
          ) : (
            <i className='fas fa-minus'></i>
          )}
        </button>
        <div className='pagination__text'>
          {currentPage} / {pagesCount === 0 ? 1 : pagesCount}
        </div>
        <button
          className='pagination__btn'
          onClick={nextPageHandler}
          disabled={nextDisabled}
        >
          {currentPage < pagesCount ? (
            <i className='fas fa-arrow-right'></i>
          ) : (
            <i className='fas fa-minus'></i>
          )}
        </button>
      </div>
      <div className='pagination__current'>
        <span className='pagination__text'>Write page to go:</span>
        <input
          className='pagination__input'
          onKeyPress={handleCurrentPageChange}
        />
      </div>
    </div>
  );
};
