import api from "./axios";


export const getFosterParentsPending= async()=>{
    const response = await api.get(`/FosterParent/status`) ;
    return response.data;
}

export const getInventoryQuantityonHand= async()=>{
    const response = await api.get(`/Inventory/quantityonhand`) ;
    return response.data;
}

export const getAnimalConditionSeverity= async()=>{
    const response = await api.get(`/AnimalCondition/severity`) ;
    console.log(response.data);
    return response.data;
}