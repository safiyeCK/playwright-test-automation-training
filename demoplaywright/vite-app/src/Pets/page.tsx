
'use client';
import React, { useEffect, useState } from "react";
import { type Pet } from "./types/Pets";
import { GlobalFetch } from "../help/fetch";
import PetsForm from "./components/PetsForm";
import PetsTable from "./components/PetsTable";
import type { Person } from "../Persons/types/Person";

const API_HOST = "http://localhost:3000"; // Replace with Configuration.host

function Pets() {
  const [pageloaded, setPageloaded] = useState<boolean>(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<Pet>({
    Id: 0,
    name: "",
    age: 0,
    sex: "",
    needsAWalkOutside: false,
    ownerId: undefined,
  });

  const loadGrid = async () => {
    try {
      const response = await GlobalFetch(`${API_HOST}/items/pets`);
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      else {
        const data = await response.json();
        setPets(data);
      }
    } catch (error) {
      console.error("Error loading people:", error);
      alert("Failed to load pets.");
    }
    try {
      const response = await GlobalFetch(`${API_HOST}/items/person`);
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      else {
        const data = await response.json();
        const petPersons = data.filter((person: Person) => person.hasPet);
        setPersons(petPersons);
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
      const response = await GlobalFetch(`${API_HOST}/save/pets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      setFormVisible(false);
      setFormData({ Id: 0, name: "", age: 0, sex: "", needsAWalkOutside: false });
      loadGrid();
    } catch (error) {
      console.error("Error saving pets:", error);
      alert("Failed to save pets.");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
	  setPageloaded(false)
      const response = await GlobalFetch(`${API_HOST}/item/pets/${id}`);
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const pets = await response.json();
      setFormData(pets);
      setFormVisible(true);
    } catch (error) {
      console.error("Error updating pets:", error);
      alert("Failed to update pets.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await GlobalFetch(`${API_HOST}/delete/pets/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      loadGrid();

    } catch (error) {
      console.error("Error deleting pets:", error);
      alert("Failed to delete pets.");
    }
  };

  useEffect(() => { loadGrid(); }, []);

  return (
    <div className="container mt-5">
      {pageloaded && !formVisible && (
        <div className="loaded alert alert-danger" role="alert">
          pets are loaded
        </div>
      )}
      {formVisible ? (
        <PetsForm
          formData={formData}
          persons={persons}
          visible={formVisible}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setFormVisible(false)}
        />
      ) : (
        <PetsTable pets={pets} persons={persons} onUpdate={handleUpdate} onAdd={() => {
          setFormVisible(true);
          setFormData({ Id: 0, name: "", age: 0, sex: "", needsAWalkOutside: false });
        }} onDelete={handleDelete} />
      )}
    </div>
  );
}
export default Pets;