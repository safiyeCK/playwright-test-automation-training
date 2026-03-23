
import React from "react";
import { type Person } from "../types/Person";

interface Props {
    formData: Person;
    visible: boolean;
    setFormData: (data: Person) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const PersonForm: React.FC<Props> = ({ formData, visible, setFormData, onSubmit, onCancel }) => {
    if (!visible) return null;
    return (
        <div className="card p-4" >
            <form onSubmit={onSubmit}>
                <div className="row mb-3">
                    <label htmlFor="fullName" className="col-sm-2 col-form-label text-start">Full Name:</label>
                    <div className="col-sm-10">
                        <input
                            id="fullName"
                            type="text"
                            className="form-control"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                        <label className="form-check-label" htmlFor="hasPet">Has a pet:</label>
                    </div>
                    <div className="col-sm-10">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="hasPet"
                                checked={formData.hasPet}
                                onChange={(e) => setFormData({ ...formData, hasPet: e.target.checked })}
                            />

                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-success me-2">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </form >
        </div >
    )
};

export default PersonForm;
