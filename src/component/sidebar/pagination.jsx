const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handleClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <ul className="default-pagination lab-ul pb-5 pt-4 justify-content-center d-flex flex-wrap">
            <li className={currentPage === 1 ? "disabled" : ""}>
                <a href="#" onClick={(e) => { e.preventDefault(); handleClick(currentPage - 1); }}>
                    <i className="icofont-rounded-left"></i>
                </a>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page}>
                    <a
                        href="#"
                        className={page === currentPage ? "active" : ""}
                        onClick={(e) => { e.preventDefault(); handleClick(page); }}
                    >
                        {page.toString().padStart(2, '0')}
                    </a>
                </li>
            ))}
            <li className={currentPage === totalPages ? "disabled" : ""}>
                <a href="#" onClick={(e) => { e.preventDefault(); handleClick(currentPage + 1); }}>
                    <i className="icofont-rounded-right"></i>
                </a>
            </li>
        </ul>
    );
};

export default Pagination;
