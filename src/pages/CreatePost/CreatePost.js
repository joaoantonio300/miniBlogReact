import styles from './CreatePost.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocument';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");

  const {user} = useAuthValue();

  const {insertDocument, response} = useInsertDocument("posts");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setFormError("");

    // validate image URL
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.");
    }

    // criar o array de tags
    // o split ele separa cada elemento com ",", o map mapeia cada um e define:
    // para cada tag, use trim(tirar espaços em branco) e para toLowerCase(deixar minusculo)
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    // checar todos os valores
    if(!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os campos!")
    }

    // aqui eu indico que se tiver um formError eu não quero que ele prossiga com o cadastro
    if(formError) return 

    await insertDocument({
      title, 
      image, 
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    })

    //redirect to home page
    navigate("/");

  };

  return (
    <div className={styles.create_post}>
       <h2>Criar post</h2>
       <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
       <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input 
          type="text"
           name="title" 
           required 
           placeholder='Pense num bom título' 
           onChange={(e) => setTitle(e.target.value)}/>
        </label>
        <label>
          <span>URL da imagem:</span>
          <input 
          type="text"
           name="image" 
           required 
           placeholder='Insira uma imagem que represente seu post' 
           onChange={(e) => setImage(e.target.value)}/>
        </label>
        <label>
          <span>Conteúdo:</span>
          <textarea 
           name="body"
           required placeholder='Insira o conteúdo do post' 
           onChange={(e) => {setBody(e.target.value) }}
           value={body}
           ></textarea>
        </label>
        <label>
          <span>Tags:</span>
          <input 
          type="text"
           name="tags" 
           required 
           placeholder='Insira as tags separadas por vírgula' 
           onChange={(e) => setTags(e.target.value)}/>
        </label>
        {!response.loading && <button className="btn">Cadastrar</button>}
            {response.loading && (<button disabled className="btn">Aguarde...</button>)}
            {response.error && <p className="error">{response.error}</p>}
            {formError && <p className="error">{formError}</p>}
       </form>
   </div>
  );
};

export default CreatePost