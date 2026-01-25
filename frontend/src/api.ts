import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Prescription {
  id: string;
  patient_id: string;
  group_id: string | null;
  medication_name: string;
  dosage: string;
  route: string;
  start_date: string; // YYYY-MM-DD
  end_date: string | null; // YYYY-MM-DD or null
  frequency: string;
  prescribing_doctor?: string;
  notes?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const fetchPrescriptions = async (
  patientId: string,
): Promise<Prescription[]> => {
  try {
    const response = await axios.get<PaginatedResponse<Prescription>>(
      `${API_URL}/api/prescriptions/`,
      {
        params: { patient_id: patientId },
      },
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw error;
  }
};
