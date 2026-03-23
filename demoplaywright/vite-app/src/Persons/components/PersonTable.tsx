
import React from "react";
import { type Person } from "../types/Person";

interface Props {
    persons: Person[];
    onUpdate: (id: number) => void;
    onAdd: () => void;
    onDelete: (id: number) => void;
}

const PersonTable: React.FC<Props> = ({ persons, onUpdate, onAdd, onDelete }) => (
    <div>
        <h2>Person Grid</h2>
        <table className="table table-bordered">
            <thead className="table-light">
                <tr>
                    <th className="d-md-table-cell fullname">Full Name</th>
                    <th className="d-md-table-cell age">Age</th>
                    <th className="d-md-table-cell sex">Sex</th>
                    <th className="d-md-table-cell haspet">Has Pet</th>
                    <th className="d-md-table-cell update">Update</th>
                    <th className="d-md-table-cell delete">delete</th>
                </tr>
            </thead>
            <tbody>
                {persons.map((person) => (
                    <tr className={"row" + person.Id} key={person.Id}>
                        <td className="d-md-table-cell fullname">{person.fullName}</td>
                        <td className="d-md-table-cell age">{person.age}</td>
                        <td className="d-md-table-cell sex">{person.sex}</td>
                        <td className="d-md-table-cell haspet">{person.hasPet ? "Yes" : "No"}</td>
                        <td className="d-md-table-cell">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onUpdate(person.Id)}
                            >
                                Update
                            </button>
                        </td>
                        <td className="d-md-table-cell">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onDelete(person.Id)}
                            >
                                delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button className="btn btn-primary mb-3" onClick={onAdd}>
            Add Person
        </button>
    </div>
);

export default PersonTable;
