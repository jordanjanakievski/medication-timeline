import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Paper,
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Tooltip,
} from "@mui/material";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import ViewListIcon from "@mui/icons-material/ViewList";
import { fetchPrescriptions } from "./api";
import type { Prescription } from "./api";
import TimelineChart from "./components/TimelineChart";
import MedicationTable from "./components/MedicationTable";
import "./App.css";

function App() {
  const [patientId, setPatientId] = useState<string>("patient_1");
  const [medications, setMedications] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");

  const hasDataIssues = medications.some((m) => !m.start_date);

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

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "timeline" | "table",
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minWidth: "1200px" }}>
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

        {/* View Toggle */}
        {!loading && !error && medications.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              aria-label="view mode"
            >
              <ToggleButton value="timeline" aria-label="timeline view">
                <Tooltip
                  title={
                    hasDataIssues
                      ? "Some records are missing dates and may not appear"
                      : "Timeline View"
                  }
                >
                  <Badge
                    color="warning"
                    variant="dot"
                    invisible={!hasDataIssues}
                    sx={{ "& .MuiBadge-badge": { right: -3, top: 3 } }}
                  >
                    <ViewTimelineIcon />
                  </Badge>
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <Tooltip title="Table View">
                  <ViewListIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {viewMode === "timeline" ? (
          <TimelineChart medications={medications} />
        ) : (
          <MedicationTable medications={medications} />
        )}
      </Box>
    </Container>
  );
}

export default App;
