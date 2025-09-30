import { useEffect, useState } from "react";
import axios from "axios";
import Rating from "./rating";

const Comment = ({ courseId, refresh }) => {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        if (!courseId) return;
        axios.get(`http://localhost:5000/api/comments/${courseId}`)
            .then(res => setComments(res.data))
            .catch(() => setComments([]));
    }, [courseId, refresh]);
    return (
        <div className="comments">
            <h4 className="title-border">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h4>
            <ul className="comment-list">
                {comments.map((val, i) => (
                    <li className="comment" key={val._id || i}>
                        <div className="com-thumb">
                            {val.imgUrl ? (
                                <img src={val.imgUrl} alt={val.name} />
                            ) : (
                                <div style={{width:40,height:40,borderRadius:'50%',background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5em',color:'#888'}}>
                                    {val.name ? val.name.charAt(0).toUpperCase() : '?'}
                                </div>
                            )}
                        </div>
                        <div className="com-content">
                            <div className="com-title">
                                <div className="com-title-meta">
                                    <h6>{val.name}</h6>
                                    <span>{new Date(val.date).toLocaleString()}</span>
                                </div>
                                <span style={{ color: '#ff9800', fontSize: '1.2em' }}>{'★'.repeat(val.rating)}{'☆'.repeat(5-val.rating)}</span>
                            </div>
                            <p>{val.message}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Comment;