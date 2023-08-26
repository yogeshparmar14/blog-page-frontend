import React, { useEffect, useState } from 'react';
import Title from './Title';
import Image from './Image';
import Description from './Description';
import './styles.css'
const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    getAllBlog()
  }, [])
  const handleEditClick = (index) => {
    const blog = blogs[index];
    setEditingIndex(index);
    setEditedTitle(blog.title);
    setEditedImageUrl(blog.imageUrl);
    setEditedDescription(blog.discription);
  };

  const handleSaveEdit = async() => {
    if (editingIndex !== null) {
      let token = localStorage.getItem('token')
      const response = await fetch(`https://blog-page-eta.vercel.app/admin/update/${blogs[editingIndex]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept':'application/json',
          'Origin':'http://localhost:3000',
          "Access-Control-Allow-Origin": "*",
          'authorization':`Bearer ${token}`
        },
        body: JSON.stringify({
          title:editedTitle,
          imageUrl:editedImageUrl,
          discription:editedDescription
        })
      })
      const result = await response.json();
      if (result.status === 200) {
        getAllBlog()
      }
      // setOpenPopUp(false)
      setEditingIndex(null);
      setEditedTitle('');
      setEditedImageUrl('');
      setEditedDescription('');
    }
  };

  const handleCloseEdit = () => {
    setEditingIndex(null);
    setEditedTitle('');
    setEditedImageUrl('');
    setEditedDescription('');
  };

  const getAllBlog = () => {
    let token = localStorage.getItem('token')
    fetch(
      "https://blog-page-eta.vercel.app/admin/get-all-blogs", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Origin':'http://localhost:3000',
        "Access-Control-Allow-Origin": "*",
        'authorization':`Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((json) => {
        setBlogs(json);
      })
  }

  const addBlog =async (newBlog) => {
    // setBlogs([...blogs, newBlog]);
    let token = localStorage.getItem('token')
    const response = await fetch('https://blog-page-eta.vercel.app/admin/add-blog', {
      method: 'POST',
      body: JSON.stringify(newBlog),
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Origin':'http://localhost:3000',
        "Access-Control-Allow-Origin": "*",
        'authorization':`Bearer ${token}`
      }
    });
    const result = await response.json();
    if (result.status === 200) {
      getAllBlog()
    }

  };



  const deleteBlog =async (id) => {
    let token = localStorage.getItem('token')
    const response = await fetch(`https://blog-page-eta.vercel.app/admin/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
          'Accept':'application/json',
          'Origin':'http://localhost:3000',
          "Access-Control-Allow-Origin": "*",
        'authorization':`Bearer ${token}`
      },
    })
    const result = await response.json();
    if (result.status === 200) {
      getAllBlog()
    }
  };

  const handleLike = async(index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index].likes += 1;
    setBlogs(updatedBlogs);
    let token = localStorage.getItem('token')
    const response = await fetch(`https://blog-page-eta.vercel.app/admin/update/${blogs[index]._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Origin':'http://localhost:3000',
        "Access-Control-Allow-Origin": "*",
        'authorization':`Bearer ${token}`
      },
      body: JSON.stringify({
        like:blogs[index].like+1,
      })
    })
    const result = await response.json();
    if (result.status === 200) {
      getAllBlog()
    }

  };

  const handleShare = (title, description) => {
    const subject = encodeURIComponent(`Check out this blog post: ${title}`);
    const body = encodeURIComponent(`I thought you might enjoy reading this blog:\n\n${title}\n\n${description}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="blog-container">
      <div className="add-blog-form">
        <h2>Add New Blog</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newBlog = {
              title: e.target.title.value,
              imageUrl: e.target.imageUrl.value,
              description: e.target.description.value,
            };
            addBlog(newBlog);
            e.target.reset();
          }}
        >
          <input type="text" name="title" placeholder="Title" required />
          <input type="text" name="imageUrl" placeholder="Image URL" required />
          <textarea name="description" placeholder="Description" required />
          <button type="submit">Add Blog</button>
        </form>
      </div>

      <div className="blogs-list">
        {blogs.map((blog, index) => (
          <div key={index} className="blog">
            <Image imageUrl={blog.imageUrl} altText={blog.title} />
            <Title title={blog.title} />
            <Description description={blog.discription} />
            <div className="blog-buttons">
              <button className="like" onClick={() => handleLike(index)}>
                Like ({blog.like})
              </button>
              <button className="share" onClick={() => handleShare(blog.title, blog.description)}>
                Share
              </button>
              <button className="delete" onClick={() => deleteBlog(blog._id)}>
                Delete
              </button>
              <button className="edit" onClick={() => handleEditClick(index)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingIndex !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Blog</h2>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              type="text"
              value={editedImageUrl}
              onChange={(e) => setEditedImageUrl(e.target.value)}
              placeholder="Image URL"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description"
            />
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCloseEdit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
