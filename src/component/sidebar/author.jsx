const Author = ({ author }) => {
    if (!author) return null;

    return (
        <div className="author d-flex align-items-center gap-3 p-3 border rounded">
            {/* Left: Author Image */}
            <div className="author-thumb flex-shrink-0">
                <img
                    src={author.image}
                    alt={author.name}
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                />
            </div>

            {/* Right: Author Details */}
            <div className="author-content">
                <h6 className="mb-1">{author.name}</h6>
                <span className="d-block mb-2 text-muted">{author.degi}</span>
                <p className="mb-2">{author.desc}</p>

                <ul className="lab-ul social-icons list-unstyled d-flex gap-2 m-0">
                    {author.socialList?.map((item, i) => (
                        <li key={i}>
                            <a
                                href={item.link}
                                className={item.className}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className={item.iconName}></i>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Author;
