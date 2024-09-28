import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import "../styles/read_article.css";

function ReadArticle() {

    const { id } = useParams(); // Get the title from the URL
    const [article , setArticle] = useState(null)
    const token = localStorage.getItem('access');  // Assume token is stored in localStorage after login
    //console.log(id)
    const [user, setUser] = useState(null);  // Initialize users as an empty array
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors
    const [content, setContent] = useState("");
    const [comments , setComments] = useState([]);
    const [displayCount, setDisplayCount] = useState(5);

    // Get user Content cause we will need it in case of commenting
    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetch_Username_photo = async () => {
            try {
                // calling api.get with 'api/usernameAndPhoto/' path and the token authorization to gain access to the id of the current user and send it to the article
                const response = await api.get('api/usernameAndPhoto/', {headers: {Authorization: `Bearer ${token}`,},});

                // saving the response data
                const usersData = response.data;
                setUser(usersData);
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);  // Log error
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
    
        fetch_Username_photo();  // Call the function 
        
    }, [token]);

    // Get Article content
    //////////////////////////////////////////////////////////
    useEffect(() => {
        if (id) { 
            console.log(id)
            const fetchArticles = async () => {
                try {
                    const response = await api.get(`api/articles/1/`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { article_id: id }
                    });
                    setArticle(response.data);
                    //console.log(response.data)
                } catch (error) {
                    console.error('Error fetching articles:', error);
                }
            };
            fetchArticles();
        }
    }, [token]);


    // Get Article's comments
    ///////////////////////////////////////////////////////////////
    useEffect(() => {
        if (article && article.id) {  // Ensure article is loaded and has an ID
            const fetchComments = async () => {
                try {
                    const response = await api.get(`api/comments/${article.id}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    //console.log(response.data);
                    // Sort comments by creation date (newest first)
                    const sortedComments = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setComments(sortedComments);
                } catch (error) {
                    console.error('Error posting comment:', error);
                    alert("Failed to create comment.");
                }
            };
            fetchComments();
        }
    }, [token, article, content]);  
    

    // Posting a comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        ///////////////////////////////////
        // Create comment in a formdata //
        setContent("")
        const formData = new FormData();
        formData.append("author", user.id);
        formData.append("content", content);
        //console.log(formData)
        try {
            const response = await api.post(`api/comments/${article.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                alert("Comment created successfully!");
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert("Failed to create comment.");
        }
    };

    // Deleting comment only if current user is the creator
    
    const deleteComment = async (id) =>{
        console.log(id)
        try {
            const response = await api.delete(`api/comments/${article.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { comment_id: id }
            });
            console.log(response)
            setContent("")
        }catch{
            console.error('Error when deleting comment:', error);
        }
    }

    const handleDelete = (id) => {
        if(id){
            deleteComment(id)
        }else {
            console.error('no id')
        }
    }

    if (!article) {
        return <div>Loading...</div>;
    }

    const handleLoadMore = () => {
        setDisplayCount(displayCount + 5); // Increase the number of displayed comments by 10
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="top-bar">
                <Link to="/home" className="top-bar-link">Home page</Link>
                <Link to="/jobs" className="top-bar-link">Jobs</Link>
                <Link to="/messages" className="top-bar-link">Messages</Link>
                <Link to="/mynetwork" className="top-bar-link">My Network</Link>
                <Link to="/notifications" className="top-bar-link">Notifications</Link>
                <Link to="/profile" className="top-bar-link">Profile</Link>
                <Link to="/settings" className="top-bar-link">Settings</Link>
            </div>
            <br />
            <div className="article-page">
                <Link to="/home" className='Return'>Go back</Link>
                <h1>{article.title}</h1>
                {!(article.image === 'http://127.0.0.1:8000/media/null') && <img src={article.image} alt={article.title} />}
                <p>{article.content}</p>
                <p>{article.likes.length} likes</p>
                <p>The author of this article is user {article.author}</p>
                <div className='Comment-section'>
                    <h2>Comments:</h2>
                    {comments.length > 0 ? (
                        comments.slice(0, displayCount).map(comment => (
                            <div className="comment-list-date" key={comment.id}>
                                <div className="comment-list">
                                    <p className="username">{comment.sender}:</p>
                                    <p>{comment.content}</p>
                                    {(comment.sender_id === user.id) && <button onClick={() => handleDelete(comment.id)}>Delete</button>}
                                </div>
                                <p className='comment-date'>{new Date(comment.created_at).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments found</p>
                    )}
                    {displayCount < comments.length && (
                        <button className="load-more" onClick={handleLoadMore}>Load More</button>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className='create-comment'>
                            <label>Add Comment</label>
                            <div className='comment-content'>
                                <textarea 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    required 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter key is pressed
                                            e.preventDefault(); // Prevent new line
                                            handleSubmit(e); // Call the submit handler
                                            setContent("");
                                        }
                                    }}
                                    rows="3" // Set a default height for the textarea
                                />
                                <button type="submit">Post</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReadArticle;
