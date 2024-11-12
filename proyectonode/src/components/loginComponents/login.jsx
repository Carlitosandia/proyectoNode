import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import clienteAxios from '../../config/axios';
//Dependencies for styles
import StylesCard from '../stylesCard.module.css';
import Styles from './login.module.css';

const Login = () => {
    const Navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const displayWarning = (status, title, information) => {
        Swal.fire({
            icon: `${status}`,
            title: `${title}`,
            text: `${information}`
        });
        return;
    }

    const submitLogin = async (e) => {
        //Prevent the default action
        e.preventDefault();
        //Validate the form
        if (email.trim() === '') {
            displayWarning('error', 'Falta de colocar el email');
            return;
        }
        if (password.trim() === '') {
            displayWarning('error', 'Falta de colocar una contraseña')
            return;
        }
        const data = {
            email,
            password
        }
        //Send the data to the API
        const response = await clienteAxios.post('./admin/login', data)
        .then(response => {
            if (response.data.code === 200 ){
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', email);
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesion exitoso',
                    text: 'Bienvenido'
                }).then(Navigate('/home'));
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al iniciar sesion'
                });
            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al iniciar sesion'
            });
        });
    }
    return (
        <div>
            <div className={Styles.card}>
                <div className={StylesCard.cardBody}>
                    <h2>Iniciar Sesion</h2>
                    <form
                        onSubmit={submitLogin}
                    >
                        <div className={StylesCard.formGroup}>
                            <input
                                type="text"
                                className={StylesCard.formInput}
                                placeholder="Correo Electronico"
                                name="correo"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={StylesCard.formGroup}>
                            <input
                                type="password"
                                className={StylesCard.formInput}
                                placeholder="Contraseña"
                                name="contraseña"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <input
                            type="submit"
                            className={StylesCard.btnSubmit}
                            value="Ingresar"
                        />
                    </form>
                </div>
                <div className="containerForgot">
                    <Link to="/recoverPassword" className={Styles.btnForgot}>¿Olvidaste tu contraseña?</Link>
                </div>
            </div>
        </div>
    )
};

export default Login;