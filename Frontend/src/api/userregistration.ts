import api from "./axios";

// User creation response
interface RegistrationData {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    fosterHomeId: string;
}

interface UserResponse {
    id: number;
    message: string;
    user: RegistrationData;
}


interface FosterParentPayload {
    userId: number;
    fosterHomeId: string;
}

interface AvailabilityPayload {
    availability: number;
    capacity: number;
    fosterHomeId: string;
    occupiedSlots: number;
}

export const registerParent = async (data: RegistrationData) => {
    try {
        if (data.fosterHomeId != '') {
            const AvailabilityPayload = await api.get(`/FosterHome/${data.fosterHomeId}/availability`);
            console.log('AvailabilityPayload', AvailabilityPayload.data.availability);
            if (AvailabilityPayload.data.availability > 0) {
                const userResponse = await api.post<UserResponse>("/User", data);
                console.log('userResponse', userResponse)
                const userId = userResponse.data.id;
                if (!userId) {
                    throw new Error("Failed to get userid after user registration");
                }
                const fosterParentPayload: FosterParentPayload & { status: string } = {
                    userId,
                    fosterHomeId: data.fosterHomeId,
                    status: "Pending",
                };
                const fosterParentResponse = await api.post("/FosterParent", fosterParentPayload);
                console.log("FosterParent record created:", fosterParentResponse.data);
                return userResponse.data;
            }
            else {
                return false;
            }
        }
        else {
            const userResponse = await api.post<UserResponse>("/User", data);
            console.log('userResponse', userResponse)
            const userId = userResponse.data.id;
            if (!userId) {
                throw new Error("Failed to get userid after user registration");
            }

        }



    } catch (error: any) {
        console.error("Registration error:", error);
    }
};


export interface FosterHome {
    id: string;
    homeName: string;
}

export const getFosterHomes = async (): Promise<FosterHome[]> => {
    try {
        const response = await api.get<FosterHome[]>("/FosterHome");

        return response.data ?? [];
    } catch (error: any) {
        console.error("Fetch foster homes error:", error);
        throw error.response?.data || {
            success: false,
            error: error.message || "Failed to fetch foster homes",
        };
    }
};