
import React from "react";
import { type Pet } from "../types/Pets";
import { type Person } from "../../Persons/types/Person";
interface Props {
    pets: Pet[];
    persons: Person[];
    onUpdate: (id: number) => void;
    onAdd: () => void;
    onDelete: (id: number) => void;
}

const getOwnerFullName = (ownerId: number | undefined, persons: Person[]): string => {
    if (!ownerId) return "";
    const owner = persons.find(p => p.Id === ownerId);
    if (!owner) return "";
    return owner.fullName.trim();
};


const PetsTable: React.FC<Props> = ({ pets, persons, onUpdate, onAdd, onDelete }) => (
    <div>
        <h2>Pets Grid</h2>
        <table className="table table-bordered">
            <thead className="table-light">
                <tr>
                    <th className="d-md-table-cell fullname">Name</th>
                    <th className="d-md-table-cell age">Age</th>
                    <th className="d-md-table-cell sex">Sex</th>
                    <th className="d-md-table-cell haspet">Needs a walk outside</th>
                    <th scope="col" className="d-md-table-cell owner">Owner</th>
                    <th className="d-md-table-cell update">Update</th>
                    <th className="d-md-table-cell delete">delete</th>
                </tr>
            </thead>
            <tbody>
                {pets.map((pet) => (
                    <tr className={"row" + pet.Id} key={pet.Id}>
                        <td className="d-md-table-cell fullname">{pet.name}</td>
                        <td className="d-md-table-cell age">{pet.age}</td>
                        <td className="d-md-table-cell sex">{pet.sex}</td>
                        <td className="d-md-table-cell needsawalkoutside">{pet.needsAWalkOutside ? "Yes" : "No"}</td>

                        <td className="d-md-table-cell owner" title="Pet owner full name">
                            {getOwnerFullName(pet.ownerId, persons) || <span className="text-muted">—</span>}
                        </td>

                        <td className="d-md-table-cell">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onUpdate(pet.Id)}
                            >
                                Update
                            </button>
                        </td>
                        <td className="d-md-table-cell">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onDelete(pet.Id)}
                            >
                                delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button className="btn btn-primary mb-3" onClick={onAdd}>
            Add Pet
        </button>
    </div>
);

export default PetsTable;
