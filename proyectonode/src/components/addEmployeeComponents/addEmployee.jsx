// Modal.js
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Styles from './addEmployee.module.css';
import clienteAxios from '../../config/axios';

const AddEmployee = ({ isOpen, onClose }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href('/');
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const submitAddEmployee = async e => {
        e.preventDefault();
        const data = {
            name,
            email,
            position,
            salary,
            password
        };
        const response = await clienteAxios.post('./admin/addEmployee', data, token)
            .then(response => {
                if (response.data.code === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Empleado agregado correctamente'
                    });
                    onClose();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al agregar el empleado'
                    });
                }
            }).catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al agregar el empleado'
                });
            });
    }

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
                    <form onSubmit={submitAddEmployee}>
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
                            value="Agregar"
                            disabled={!isFormValid}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
