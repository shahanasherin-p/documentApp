import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from './firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import './editor.css';

function Editor() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      try {
        if (id !== 'new') {
          const docRef = doc(db, 'documents', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setContent(data.content || '');
          } else {
            alert('Document not found');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error loading document:', error);
        alert('Failed to load document');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id, navigate]);

  const saveDocument = async () => {
    // Basic validation
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!content.trim()) {
      alert('Document content cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      if (id === 'new') {
        // Create a new document
        const docRef = await addDoc(collection(db, 'documents'), {
          title,
          content,
          createdAt: new Date()
        });
        alert("New document created successfully!");
        navigate(`/edit/${docRef.id}`);
      } else {
        // Update existing document
        const docRef = doc(db, 'documents', id);
        await setDoc(docRef, { 
          title, 
          content,
          updatedAt: new Date()
        }, { merge: true });
        alert("Document updated successfully!");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error saving document: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editor-container">
      <input 
        type="text" 
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter document title"
        required
      />
      <ReactQuill 
        ref={quillRef} 
        value={content} 
        onChange={setContent} 
        placeholder="Start writing your document..."
      />
      <div className="editor-actions">
        <button 
          className="button save-button" 
          onClick={saveDocument}
          disabled={isLoading}
        >
          {id === 'new' ? 'Create' : 'Save'}
        </button>
        <button 
          className="button cancel-button" 
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Editor;