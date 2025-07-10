import { NavLink } from "react-router-dom" 

import { useAuthentication } from "../hooks/useAuthentication"

import { useAuthValue } from "../context/AuthContext"

import styles from "./NavBar.module.css"

// o isActive é digamos uma função interna do navlink ou do react router
// com isso me permite que quando o link estiver ativo, eu possa fazer algo
// nesse caso eu posso chamar definir que quando tiver ativo eu possa  adicionar uma classe

const Navbar = () => {

  // entender isso aqui
  // a autenticacao é trazida com base no provider aqui 

  const {user} = useAuthValue();
  const { logout } = useAuthentication();

  return (
    <div className={styles.navbar}>
        <NavLink to="/" className={styles.brand}>
          Mini <span>Blog</span>
        </NavLink>
      <ul className={styles.links_list}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
           Home 
          </NavLink>
        </li>
        {!user && (
          <>
          <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : "")}> 
           Entrar
          </NavLink>
          </li>
          <li>
          <NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : "")}> 
           Cadastrar
          </NavLink>
          </li>
          </>
        )}
        {user && (
            <>
            <li>
            <NavLink to="/posts/create" className={({ isActive }) => (isActive ? styles.active : "")}> 
             Novo post
            </NavLink>
            </li>
            <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : "")}> 
             Dashboard
            </NavLink>
            </li>
            </>
        )}
        <li>
        <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : "")}> 
         Sobre
        </NavLink>
        </li>
        {user && (
          <li>
            <button onClick={logout}>Sair</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Navbar