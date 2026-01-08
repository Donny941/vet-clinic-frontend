import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { animalsAPI } from "../services/api";
import Navbar from "./Navbar";

function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    coatColor: "",
    birthDate: "",
    hasMicrochip: false,
    microchipNumber: "",
    ownerName: "",
    ownerSurname: "",
    ownerTaxCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    loadAnimals();
  }, [navigate]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalsAPI.getAll();
      setAnimals(data);
      setError("");
    } catch (err) {
      setError("Errore nel caricamento degli animali");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Sei sicuro di voler eliminare ${name}?`)) {
      return;
    }

    try {
      await animalsAPI.delete(id);
      setAnimals(animals.filter((a) => a.id !== id));
    } catch (err) {
      alert("Errore nell'eliminazione");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newAnimal = await animalsAPI.create(formData);
      setAnimals([...animals, newAnimal]);
      setShowModal(false);
      setFormData({
        name: "",
        type: "",
        coatColor: "",
        birthDate: "",
        hasMicrochip: false,
        microchipNumber: "",
        ownerName: "",
        ownerSurname: "",
        ownerTaxCode: "",
      });
    } catch (err) {
      alert("Errore nella creazione dell'animale");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light container">
      {/* Navbar */}
      <Navbar user={user} />

      {/* Main Content */}
      <div className="container-fluid py-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                📋 Lista Animali
                <span className="badge bg-primary ms-2">{animals.length}</span>
              </h4>
              <div>
                <button className="btn btn-success me-2" onClick={() => setShowModal(true)}>
                  ➕ Nuovo Animale
                </button>
                <button className="btn btn-outline-primary" onClick={loadAnimals}>
                  🔄 Ricarica
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {animals.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5 mb-3">Nessun animale registrato</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  ➕ Aggiungi il primo animale
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Colore</th>
                      <th>Data Nascita</th>
                      <th>Microchip</th>
                      <th>Proprietario</th>
                      <th>Codice Fiscale</th>
                      <th>Registrazione</th>
                      <th className="text-center">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal) => (
                      <tr key={animal.id}>
                        <td className="fw-semibold">#{animal.id}</td>
                        <td>
                          <strong>{animal.name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">{animal.type}</span>
                        </td>
                        <td>{animal.coatColor || "-"}</td>
                        <td>{animal.birthDate ? <small>{new Date(animal.birthDate).toLocaleDateString("it-IT")}</small> : "-"}</td>
                        <td>
                          {animal.hasMicrochip ? (
                            <div>
                              <span className="badge bg-success">✓ Sì</span>
                              <div className="small text-muted">{animal.microchipNumber}</div>
                            </div>
                          ) : (
                            <span className="badge bg-secondary">✗ No</span>
                          )}
                        </td>
                        <td>
                          {animal.ownerName} {animal.ownerSurname}
                        </td>
                        <td>
                          <code>{animal.ownerTaxCode}</code>
                        </td>
                        <td>
                          <small className="text-muted">{new Date(animal.registrationDate).toLocaleDateString("it-IT")}</small>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleDelete(animal.id, animal.name)} className="btn btn-sm btn-outline-danger" title="Elimina">
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Nuovo Animale */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">➕ Nuovo Animale</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      {/* Dati Animale */}
                      <div className="col-12">
                        <h6 className="border-bottom pb-2">🐾 Dati Animale</h6>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Nome *</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Tipo *</label>
                        <select className="form-select" name="type" value={formData.type} onChange={handleInputChange} required>
                          <option value="">Seleziona tipo</option>
                          <option value="Cane">Cane</option>
                          <option value="Gatto">Gatto</option>
                          <option value="Coniglio">Coniglio</option>
                          <option value="Uccello">Uccello</option>
                          <option value="Altro">Altro</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Colore Mantello</label>
                        <input type="text" className="form-control" name="coatColor" value={formData.coatColor} onChange={handleInputChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Data di Nascita</label>
                        <input type="date" className="form-control" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
                      </div>

                      {/* Microchip */}
                      <div className="col-12">
                        <h6 className="border-bottom pb-2 mt-3">💉 Microchip</h6>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="hasMicrochip"
                            name="hasMicrochip"
                            checked={formData.hasMicrochip}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="hasMicrochip">
                            L'animale ha il microchip
                          </label>
                        </div>
                      </div>

                      {formData.hasMicrochip && (
                        <div className="col-12">
                          <label className="form-label">Numero Microchip</label>
                          <input
                            type="text"
                            className="form-control"
                            name="microchipNumber"
                            value={formData.microchipNumber}
                            onChange={handleInputChange}
                            maxLength="20"
                          />
                        </div>
                      )}

                      {/* Dati Proprietario */}
                      <div className="col-12">
                        <h6 className="border-bottom pb-2 mt-3">👤 Dati Proprietario</h6>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Nome *</label>
                        <input type="text" className="form-control" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Cognome *</label>
                        <input type="text" className="form-control" name="ownerSurname" value={formData.ownerSurname} onChange={handleInputChange} required />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Codice Fiscale *</label>
                        <input
                          type="text"
                          className="form-control text-uppercase"
                          name="ownerTaxCode"
                          value={formData.ownerTaxCode}
                          onChange={handleInputChange}
                          maxLength="16"
                          required
                          style={{ fontFamily: "monospace" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
                      Annulla
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Salvataggio...
                        </>
                      ) : (
                        "💾 Salva Animale"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
