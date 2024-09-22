import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api"; 
import "../styles/Note.css"; 

function PostArticle() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState(null);
    const [publicArticle, setPublicArticle] = useState(true);  // Default to public
    const token = localStorage.getItem('access');
    const navigate = useNavigate();
    const [user, setUser] = useState([]);  // Initialize users as an empty array
    const [loading, setLoading] = useState(true);  // State to handle loading
    const [error, setError] = useState(null);  // State to handle errors

    useEffect(() => {
        const fetchUsernamePhoto = async () => {
            try {
                const response = await api.get('api/usernameAndPhoto/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const usersData = response.data[0];
                setUser(usersData);
                console.log(user)
                setLoading(false);  // Stop loading
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
                setLoading(false);  // Stop loading
            }
        };
        fetchUsernamePhoto();  // Call the function
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("photo", photo);
        formData.append("public", publicArticle);
        console.log(user)
        console.log(formData)
        try {
            const response = await api.post(`api/articles/${user.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'  // Important for file uploads
                },
            });
            if (response.status === 201) {
                alert("Article created successfully!");
                navigate("/home");  // Redirect to home after submission
            }
        } catch (error) {
            console.error('Error posting article:', error);
            alert("Failed to create article.");
        }
    };

    return (
        <div className="post-article">
            <h1>Post an Article</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Upload Photo:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setPhoto(e.target.files[0])} 
                    />
                </div>
                <div>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={publicArticle} 
                            onChange={() => setPublicArticle(!publicArticle)} 
                        />
                        Public Article
                    </label>
                </div>
                <button type="submit">Post Article</button>
            </form>
        </div>
    );
}

export default PostArticle;
