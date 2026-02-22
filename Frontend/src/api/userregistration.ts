import api from "./axios";

export interface RegistrationData {
    username: string;
    firstname: string;
    lastname: string;
    phone: number;  // Phone as number
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

export const registerParent = async (data: Omit<RegistrationData, 'phone'> & { phone: string | number }) => {
    try {
        // Convert phone string to number before sending
        const registrationData: RegistrationData = {
            ...data,
            phone: parseInt(data.phone.toString(), 10),  // Convert to number
        };
        
        console.log("Sending data:", registrationData);
        const response = await api.post<ApiResponse>("/User", registrationData);
        return response.data;
    } catch (error: any) {
        console.error("Registration error:", error);
        throw error.response?.data || { 
            success: false, 
            error: error.message || "Registration failed" 
        };
    }
};