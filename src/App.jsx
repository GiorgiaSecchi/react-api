import { useState, useEffect } from "react";

const defaultFormData = {
  titolo: "",
  immagine: "",
  contenuto: "",
  tags: [],
  categoria: "",
  isPublic: false,
};

function App() {
  // Stato iniziale Array "articles" (vuoto)
  const [articles, setArticles] = useState([]);

  // unico oggetto per gestire tutti dati del form
  const [formData, setFormData] = useState(defaultFormData);

  // funzione unica per gestire l'evento onChange del form
  const handleFormData = (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    const newformData = {
      ...formData,
      [event.target.name]: value,
    };

    setFormData(newformData);
    // console.log(newformData);
  };

  //// useEffect mostra alert quando so clicca su checkbox per pubblicare articolo
  //// useEffect(() => {
  ////   if (formData.isPublic) {
  ////     alert("L'articolo verrà pubblicato una volta caricato!");
  ////   }
  //// }, [formData.isPublic]);

  const fetchArticles = () => {
    fetch("http://localhost:3000/posts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setArticles(data.posts);
      })
      .catch((error) =>
        console.error("Errore nel caricamento degli articoli:", error)
      );
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // gestisce l'invio nuovi titoli dal form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.titolo || !formData.contenuto) {
      alert("Le sezioni titolo e contenuto sono obbligatorie!");
      return;
    }

    // console.log(`L'articolo "${formData.titolo}" è stato aggiunto!`);

    fetch("http://localhost:3000/posts", {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        // aggiunge il nuovo titolo all'array "articles" clonato
        const newArticle = [...articles, data];
        setArticles(newArticle);
        // reset value input
        setFormData(defaultFormData);
      });
  };

  // gestisce eliminazione di un titolo
  const handleRemoveArticle = (id) => {
    fetch("http://localhost:3000/posts/" + id, {
      method: "DELETE",
    })
      .then((res) => res)
      .then(() => {
        fetchArticles();
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // // gestisce eliminazione di un titolo
  // const handleRemoveArticle = (removeIndex) => {
  //   const removedArticle = articles[removeIndex];
  //   const newArticle = articles.filter((article, index) => {
  //     return index !== removeIndex;
  //   });
  //   setArticles(newArticle);
  //   console.log(`L'articolo "${removedArticle}" è stato eliminato.`);
  // };

  return (
    <>
      <div className="container text-start ">
        <h1 className="mt-5 mb-4">ARTICOLI</h1>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="titleInput" className="form-label d-block">
              Titolo
            </label>
            <input
              className="form-control p-2"
              id="titleInput"
              type="text"
              placeholder="Inserisci titolo articolo..."
              name="titolo"
              value={formData.titolo}
              onChange={handleFormData}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="imageInput" className="form-label">
              URL Immagine
            </label>
            <input
              className="form-control"
              id="imageInput"
              type="text"
              placeholder="Inserisci URL immagine..."
              name="immagine"
              value={formData.immagine}
              onChange={handleFormData}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="contentInput" className="form-label">
              Contenuto
            </label>
            <textarea
              className="form-control"
              id="contentInput"
              rows="3"
              name="contenuto"
              value={formData.contenuto}
              onChange={handleFormData}
            ></textarea>
          </div>

          <select
            className="form-select mt-4"
            name="categoria"
            value={formData.categoria}
            onChange={handleFormData}
          >
            <option defaultValue>Seleziona la categoria...</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>

          <div className="form-check mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleFormData}
            />
            <label className="form-check-label" htmlFor="flexCheckPublic">
              Pubblica
            </label>
          </div>

          <button className="btn btn-primary mt-4">Carica</button>
        </form>

        <hr />

        {/* LIST ARTICLES */}
        <ul className="text-start list-group mb-5">
          {articles.map((article, index) => (
            <li
              key={index}
              className="list-group-item d-flex flex-column align-items-start py-4 shadow"
            >
              <h3>{article.titolo}</h3>
              {article.immagine ? (
                <img
                  className="img-fluid"
                  src={`http://localhost:3000${article.immagine}`}
                  alt=""
                />
              ) : (
                ""
              )}
              <p className="fst-italic mt-3">{article.contenuto}</p>
              <div>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill text-bg-warning me-3"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p>{article.categoria}</p>
              <p>Pubblicato: {article.isPublic === true ? "Si" : "No"}</p>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemoveArticle(article.id)}
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
