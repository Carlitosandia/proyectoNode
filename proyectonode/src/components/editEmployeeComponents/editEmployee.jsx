import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Styles from '../addEmployeeComponents/addEmployee.module.css';
import clienteAxios from '../../config/axios';

const EditEmployee = ({ isOpen, onClose, employee }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }

    // Define los estados para los campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Actualiza los valores de los campos cuando el empleado cambia
    useEffect(() => {
        if (employee) {
            setName(employee.name || ''); // Inicializa con el nombre del empleado o una cadena vacía
            setEmail(employee.email || '');
            setPosition(employee.position || '');
            setSalary(employee.salary || '');
            setPassword(''); // Opcional: mantener el campo de contraseña vacío
        }
    }, [employee]);

    const submitEditEmployee = async e => {
        e.preventDefault();
        const data = {
            name,
            email,
            position,
            salary,
            password
        };
        
        clienteAxios.put(`./admin/editEmployee/${employee.id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Empleado actualizado correctamente'
            });
            onClose();
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al actualizar el empleado'
            });
        });
    };

    // Valida el formulario para habilitar o deshabilitar el botón de envío
    useEffect(() => {
        if (name.trim() !== '' && email.trim() !== '' && position.trim() !== '' && salary.trim() !== '' && password.trim() !== '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [name, email, position, salary, password]);

    if (!isOpen) return null;

    return (
        <div className={Styles.overlay}>
            <div className={Styles.modal}>
                <button className={Styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={Styles.content}>
                    <form onSubmit={submitEditEmployee}>
                        <div className={Styles.formGroup}>
                            <label htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                placeholder='Nombre'
                                className={Styles.formInput}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor="email">Correo</label>
                            <input
                                type="email"
                                placeholder='Correo'
                                className={Styles.formInput}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor="position">Puesto</label>
                            <input
                                type="text"
                                placeholder='Puesto'
                                className={Styles.formInput}
                                value={position}
                                onChange={e => setPosition(e.target.value)}
                            />
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor="salary">Salario</label>
                            <input
                                type="number"
                                placeholder='Salario'
                                className={Styles.formInput}
                                value={salary}
                                onChange={e => setSalary(e.target.value)}
                            />
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                placeholder='Contraseña'
                                className={Styles.formInput}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <input
                            type="submit"
                            className={`${Styles.btnSubmit} ${!isFormValid ? Styles.disabled : ''}`}
                            value="Guardar Cambios"
                            disabled={!isFormValid}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;
