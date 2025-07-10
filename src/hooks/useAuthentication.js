// mesmo nao fazendo uso do "db" eu preciso exportar as confs do meu banco no firebase
import {db, auth} from "../firebase/config"

// lembrar que sempre que eu for referncia ao firebase eu tenho que chamar o arquivo aonde eu armazenei as conf dele
// como o arquivo ai encima
//ok
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
}  from "firebase/auth";

import {useState, useEffect} from 'react'
 
export const useAuthentication = () => {
    // ok
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    // cleanup
    // deal with memory leak
    // menos sapoha aqui 
    const [cancelled, setCancelled] = useState(false);

    // checkando se foi cancelado
    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    // criando usuario
     
    const createUser = async (data) => {

    // everything before the try are just validations
        checkIfIsCancelled()

        setLoading(true)
        setError(null);

        try {
    // aqui eu puxo o user de uma função que é importada do firebase
    // a primeira coisa é passar a auth, junto com o email e password que foi a forma que nosso banco está estruturado
    
            const {user} = await createUserWithEmailAndPassword(
                auth, 
                data.email,
                data.password
            )

    // para salvar outras informações como nome, precisamos atualizar o usuário criado;
            await updateProfile(user, {
                displayName: data.displayName
            })

            setLoading(false)

            return user

        } catch (error) {

            // procurar como funciona mais a questão dos tratamentos de erros aqui 
            console.log(error.message)
            console.log(typeof error.message)

            let systemErrorMessage

            if(error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres"
            } else if(error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado"
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde";
            }

            setLoading(false)
            setError(systemErrorMessage)

        }

    }

    // logout - sign out
    const logout = () => {

        checkIfIsCancelled();

        signOut(auth);

    }

    // login - sign in 
    const login = async(data) => {

        checkIfIsCancelled()

        setLoading(true)
        setError(false)

        try {

            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false)
             
        } catch (error) {

            let systemErrorMessage;

            if (error.code.includes("invalid-credential")) {
                systemErrorMessage = "Usuário ou senha incorretos"
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde";
            }

            console.log(error.message)
            console.log(typeof error.message)

            setError(systemErrorMessage);
            setLoading(false) 
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {
        auth, 
        createUser,
        error, 
        loading,
        logout,
        login 
    };
};