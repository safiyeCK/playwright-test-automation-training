
'use client';
import React, { useEffect, useState } from "react";
import PersonTable from "./components/PersonTable";
import PersonForm from "./components/PersonForm";
import { type Person } from "./types/Person";
import { GlobalFetch } from "../help/fetch";

const API_HOST = "http://localhost:3000"; // Replace with Configuration.host

function Persons() {
  const [pageloaded, setPageloaded] = useState<boolean>(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<Person>({
    Id: 0,
    fullName: "",
    age: 0,
    sex: "",
    hasPet: false,
  });

  const loadGrid = async () => {
    try {
      const response = await GlobalFetch(`${API_HOST}/items/person`);
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      else {
        const data = await response.json();
        setPersons(data);
      }
    } catch (error) {
      console.error("Error loading people:", error);
      alert("Failed to load person.");
    }
    setPageloaded(true);
    setTimeout(() => setPageloaded(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
	  setPageloaded(false)
      const response = await GlobalFetch(`${API_HOST}/save/person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      setFormVisible(false);
      setFormData({ Id: 0, fullName: "", age: 0, sex: "", hasPet: false });
      loadGrid();
    } catch (error) {
      console.error("Error saving person:", error);
      alert("Failed to save person.");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
	  setPageloaded(false)
      const response = await GlobalFetch(`${API_HOST}/item/person/${id}`);
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const person = await response.json();
      setFormData(person);
      setFormVisible(true);
    } catch (error) {
      console.error("Error updating person:", error);
      alert("Failed to update person.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await GlobalFetch(`${API_HOST}/delete/person/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      loadGrid();
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("Failed to delete person.");
    }
  };

  useEffect(() => { loadGrid(); }, []);

  return (
    <div className="container mt-5">
      {pageloaded && (
        <div className="loaded alert alert-danger" role="alert">
          Persons are loaded
        </div>
      )}
      {formVisible ? (
        <PersonForm
          formData={formData}
          visible={formVisible}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setFormVisible(false)}
        />
      ) : (
        <PersonTable persons={persons} onUpdate={handleUpdate} onAdd={() => {
          setFormVisible(true);
          setFormData({ Id: 0, fullName: "", age: 0, sex: "", hasPet: false });
        }} onDelete={handleDelete} />
      )}
    </div>
  );
}
export default Persons;