
import React from "react";
import { type Pet } from "../types/Pets";
import { type Person } from "../../Persons/types/Person";

interface Props {
    formData: Pet;
    persons: Person[]
    visible: boolean;
    setFormData: (data: Pet) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const PetsForm: React.FC<Props> = ({ formData, persons, visible, setFormData, onSubmit, onCancel }) => {
    if (!visible) return null;
    return (
        <div className="card p-4" >
            <form onSubmit={onSubmit}>
                <div className="row mb-3">
                    <label htmlFor="Name" className="col-sm-2 col-form-label text-start">Name:</label>
                    <div className="col-sm-10">
                        <input
                            id="Name"
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="age" className="col-sm-2 col-form-label text-start">Age:</label>
                    <div className="col-sm-10">
                        <input
                            id="age"
                            type="number"
                            className="form-control flex-grow-1"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                            required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="sex" className="col-sm-2 col-form-label text-start">Sex:</label>
                    <div className="col-sm-10">
                        <select
                            id="sex"
                            className="form-select flex-grow-1"
                            value={formData.sex}
                            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-2 text-start">
                        <label className="form-check-label" htmlFor="needsWalk">Needs a walk outside everyday:</label>
                    </div>
                    <div className="col-sm-10">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="needsWalk"
                                checked={formData.needsAWalkOutside}
                                onChange={(e) => setFormData({ ...formData, needsAWalkOutside: e.target.checked })}
                            />

                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="ownerId" className="col-sm-2 col-form-label text-start">
                        Owner:
                    </label>
                    <div className="col-sm-10">
                        <select
                            id="ownerId"
                            className="form-select"
                            value={formData.ownerId ?? ""} // empty when undefined
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    ownerId: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            required
                        >
                            <option value="">Select a person…</option>
                            {persons.map((p) => (
                                <option key={p.Id} value={p.Id}>
                                    {/* Fullname: First + Last */}
                                    {p.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-success me-2">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </form >
        </div >
    )
};

export default PetsForm;
