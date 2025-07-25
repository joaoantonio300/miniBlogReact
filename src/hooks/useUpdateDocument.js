import { useState, useEffect, useReducer } from "react";
import {db} from '../firebase/config';
import { updateDoc, doc } from "firebase/firestore";


// estado inicial do reducer

const initialState = {
    loading: null,
    error: null
}

const updateReducer = (state, action) => {

    switch(action.type) {

        case "LOADING":
            return { loading:true, error:null}
        case "UPDATED_DOC":
            return { loading: false, error: null}
        case "ERROR":
            return { loading: false, error: action.payload}
        default:
            return state;
    }

}

// procurar entender melhor 

export const useUpdateDocument = (docCollection) => {

    const [response, dispatch] = useReducer(updateReducer, initialState);

    //deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled) {
            dispatch(action);
        }
    };

        const updateDocument = async (id, data) => {

        checkCancelBeforeDispatch({type:"LOADING"});

        try {

            const docRef = await doc(db, docCollection, id);

            console.log(docRef);

            const updatedDocument = await updateDoc(docRef,data);

            console.log(updateDocument);


            checkCancelBeforeDispatch({
                type:"UPDATED_DOC",
                payload: updatedDocument,
            });
            
        } catch (error) {

            checkCancelBeforeDispatch({
                type:"ERROR",
                payload: error.message,
            });
        }

    }

    useEffect(() => {
        // return () => setCancelled(true);
    }, []);

    return {updateDocument, response};
}