import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { fetchPrescriptions } from "./api";
import type { Prescription } from "./api";
import TimelineChart from "./components/TimelineChart";
import "./App.css";

function App() {
  const [patientId, setPatientId] = useState<string>("patient_1");
  const [medications, setMedications] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!patientId) {
        setMedications([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchPrescriptions(patientId);
        setMedications(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch prescriptions");
        setMedications([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, minWidth: '1200px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Medication Timeline
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          label="Patient ID"
          variant="outlined"
          fullWidth
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          helperText="Try 'patient_1', 'patient_2', or 'patient_3'"
        />
      </Paper>

      <Box sx={{ position: "relative", minHeight: "200px" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body1" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TimelineChart medications={medications} />
      </Box>
    </Container>
  );
}

export default App;
