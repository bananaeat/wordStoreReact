import React from 'react';

import 'bulma/css/bulma.css';

type Props = {
    currentPage: number;
    numberOfPages: number;
    setCurrentPage: (page : number) => void;
}

const WordListPagination = (props : Props) => {
    const pageRange = 10;
    const halfPageRange = Math.floor(pageRange / 2);
    if (props.numberOfPages <= 1) {
        return <div></div>;
    } else {
        return (
            <nav className="pagination m-1" role="navigation" aria-label="pagination">
                <a
                    className="pagination-previous"
                    onClick={(e) => {
                    e.preventDefault();
                    props.setCurrentPage(props.currentPage > 1
                        ? props.currentPage - 1
                        : 1);
                }}>上一页</a>
                <a
                    className="pagination-next"
                    onClick={(e) => {
                    e.preventDefault();
                    props.setCurrentPage(props.currentPage < props.numberOfPages
                        ? props.currentPage + 1
                        : props.numberOfPages);
                }}>下一页</a>
                {props.numberOfPages <= pageRange
                    ? (
                        <ul className="pagination-list">
                            {Array.from({
                                length: props.numberOfPages
                            }, (_, index) => index + 1).map((page : number) => {
                                return (
                                    <li key={`pagination-${page}`}>
                                        <a
                                            className={`pagination-link ${props.currentPage == page
                                            ? 'is-current'
                                            : ''}`}
                                            onClick={((e) => {
                                            e.preventDefault();
                                            props.setCurrentPage(page);
                                        })}>{page}</a>
                                    </li>
                                )
                            })}
                        </ul>
                    )
                    : (
                        <ul className="pagination-list">
                            {props.currentPage >= halfPageRange + 1 && (
                                <li>
                                    <a
                                        className={`pagination-link ${props.currentPage == 1
                                        ? 'is-current'
                                        : ''}`}
                                        onClick={((e) => {
                                        e.preventDefault();
                                        props.setCurrentPage(1);
                                    })}>{1}</a>
                                </li>
                            )}
                            {props.currentPage >= halfPageRange + 2 && (
                                <li>
                                    <span className="pagination-ellipsis">&hellip;</span>
                                </li>
                            )}
                            {Array.from({
                                length: props.numberOfPages
                            }, (_, index) => index + 1)
                                .slice(Math.max(props.currentPage - halfPageRange, 0), Math.min(props.currentPage + pageRange - halfPageRange - 1, props.numberOfPages))
                                .map((page : number) => {
                                    return (
                                        <li key={`pagination-${page}`}>
                                            <a
                                                className={`pagination-link ${props.currentPage == page
                                                ? 'is-current'
                                                : ''}`}
                                                onClick={((e) => {
                                                e.preventDefault();
                                                props.setCurrentPage(page);
                                            })}>{page}</a>
                                        </li>
                                    )
                                })}
                            {props.currentPage <= props.numberOfPages - halfPageRange - 1 && (
                                <li>
                                    <span className="pagination-ellipsis">&hellip;</span>
                                </li>
                            )}
                            {props.currentPage <= props.numberOfPages - halfPageRange && (
                                <li>
                                    <a
                                        className={`pagination-link ${props.currentPage == props.numberOfPages
                                        ? 'is-current'
                                        : ''}`}
                                        onClick={((e) => {
                                        e.preventDefault();
                                        props.setCurrentPage(props.numberOfPages);
                                    })}>{props.numberOfPages}</a>
                                </li>
                            )}

                        </ul>
                    )}
            </nav>
        )
    }

};

export default WordListPagination;