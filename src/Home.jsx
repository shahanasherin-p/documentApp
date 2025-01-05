import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import './home.css'; 

function Home() {
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const dbRef = collection(db, 'documents');
                const docSnap = await getDocs(dbRef);
                const docs = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDocuments(docs);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };
        fetchDocuments();
    }, [documents]);

    const createNewDocument = async () => {
        const title = window.prompt("Enter a title for the new document:");
        if (title) {
            try {
                const docRef = await addDoc(collection(db, 'documents'), { title, content: '' });
            } catch (error) {
                console.error("Error creating document:", error);
                alert("Error creating document: " + error.message);
            }
        }
    };

    const deleteDocument = async (id) => {
        try {
            await deleteDoc(doc(db, 'documents', id));
            setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Error deleting document: " + error.message);
        }
    };

    return (
        <div className="home-container">
            <h1 className="home-title">All Documents</h1>
            <button className="create-button" onClick={createNewDocument}>Create New Document</button>
            <div className="document-list">
                {documents.map((doc) => (
                    <div key={doc.id} className="document-card">
                        <Link to={`/editor/${doc.id}`} className="document-link">
                            <h2>{doc.title || "Untitled Document"}</h2>
                        </Link>
                        <div className="document-content" dangerouslySetInnerHTML={{ __html: doc.content || "No content available" }} />
                        <button className="delete-button" onClick={() => deleteDocument(doc.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
