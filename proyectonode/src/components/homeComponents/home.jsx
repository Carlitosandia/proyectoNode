import React, { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import AddEmployee from "../addEmployeeComponents/addEmployee";
import EditEmployee from "../editEmployeeComponents/editEmployee";
import Styles from "./home.module.css";
import Swal from "sweetalert2";

const Home = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }

    const [isModalOpen, setIsModalOpen] = useState(false); // Controla el modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controla el modal de edición
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Estado para el empleado seleccionado
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setSelectedEmployee(employee); // Asigna el empleado seleccionado
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedEmployee(null); // Resetea el empleado seleccionado
    };

    const deleteEmployee = (employeeId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                clienteAxios.delete(`./admin/deleteEmployee/${employeeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(() => {
                    Swal.fire(
                        'Eliminado',
                        'El empleado ha sido eliminado.',
                        'success'
                    );
                    // Filtra el empleado eliminado de la lista sin recargar la página
                    setEmployees(employees.filter(employee => employee.id !== employeeId));
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al eliminar el empleado'
                    });
                });
            }
        });
    };

    useEffect(() => {
        clienteAxios.get('./admin/getEmployees', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setEmployees(response.data.employees);
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los empleados'
            });
        });
    }, []);

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    return (
        <div>
            <h1 className={Styles.title}>Administrador</h1>
            <input
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={Styles.searchInput}
            />
            {filteredEmployees.length > 0 ? (
                <div>
                <table className={Styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Puesto</th>
                            <th>Salario</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.position}</td>
                                <td>{employee.salary}</td>
                                <td>
                                    <button
                                        className={Styles.btnSubmitEdit}
                                        onClick={() => openEditModal(employee)} // Abre el modal de edición
                                    >
                                        Editar
                                    </button>
                                </td>
                                <td>
                                    <button
                                    className={Styles.btnSubmitDelete}
                                     onClick={() => deleteEmployee(employee.id)}
                                     >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <input type="button" value="Agregar Empleado" onClick={openModal} />
                </div>
            ) : (
                <div className="div">
                    <h2 className={Styles.title}>No hay empleados registrados en la base de datos</h2>
                    <input type="button" value="Agregar Empleado" onClick={openModal} />
                </div>
            )}
            <AddEmployee isOpen={isModalOpen} onClose={closeModal} />
            <EditEmployee isOpen={isEditModalOpen} onClose={closeModal} employee={selectedEmployee} />
        </div>
    );
};

export default Home;
