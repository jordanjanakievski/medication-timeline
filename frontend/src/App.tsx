import { useState, useEffect, useMemo } from 'react';
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
  Button,
  FormControl, InputLabel, Select, MenuItem // Added for sorting
} from '@mui/material';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import ViewListIcon from '@mui/icons-material/ViewList';
import { fetchPrescriptions } from './api';
import type { Prescription } from './api';
import TimelineChart from './components/TimelineChart';
import MedicationTable from './components/MedicationTable';
import './App.css';

function App() {
  const [patientId, setPatientId] = useState<string>("patient_1");
  const [draftPatientId, setDraftPatientId] = useState<string>("patient_1");
  const [medications, setMedications] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [sortBy, setSortBy] = useState<'startDate' | 'alphabetical'>('startDate'); // New state for sorting

  // Check for data issues (missing start_date)
  const hasDataIssues = medications.some(m => !m.start_date);

  useEffect(() => {
    if (!patientId) {
      setMedications([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    const loadData = async () => {
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
    newView: 'timeline' | 'table',
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleSortChange = (event: any) => { // Use 'any' for event type from Select for simplicity
    setSortBy(event.target.value as 'startDate' | 'alphabetical');
  };

  const handleSearchClick = () => {
    setPatientId(draftPatientId);
  };

  // Memoized sorted medications
  const sortedMedications = useMemo(() => {
    const sorted = [...medications]; // Create a shallow copy to avoid mutating state
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.medication_name.localeCompare(b.medication_name));
    } else if (sortBy === 'startDate') {
      sorted.sort((a, b) => {
        // Handle null start_date by pushing them to the end
        if (!a.start_date && !b.start_date) return 0;
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      });
    }
    return sorted;
  }, [medications, sortBy]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, minWidth: "1200px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Medication Timeline
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}> {/* Aligns input box and button */}
            <TextField 
                label="Patient ID" 
                variant="outlined" 
                fullWidth
                value={draftPatientId} 
                onChange={(e) => setDraftPatientId(e.target.value)} 
                onKeyPress={(e) => { 
                    if (e.key === 'Enter') {
                        handleSearchClick();
                    }
                }}
            />
            <Button 
                variant="contained" 
                onClick={handleSearchClick}
                sx={{ height: '56px' }} 
            >
                Search
            </Button>
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 1, ml: 1.5, color: "text.secondary" }}>
            Type patient ID and click search (e.g., 'patient_1')
        </Typography>
      </Paper>

      <Box sx={{ position: "relative", minHeight: "200px" }}>
        {loading && (
          <Box 
            sx={{ 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              transform: "translate(-50%, -50%)",
              zIndex: 1 
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

        {/* Controls: Sorting and View Toggle */}
        {!loading && !error && medications.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            {/* Sort Control */}
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by-select"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="startDate">Start Date</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
              </Select>
            </FormControl>

            {/* View Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              aria-label="view mode"
            >
              <ToggleButton value="timeline" aria-label="timeline view">
                <Tooltip title={hasDataIssues ? "Some records are missing dates and may not appear" : "Timeline View"}>
                  <Badge 
                    color="warning" 
                    variant="dot" 
                    invisible={!hasDataIssues}
                    sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}
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
          <TimelineChart medications={sortedMedications} />
        ) : (
          <MedicationTable medications={sortedMedications} />
        )}
      </Box>
    </Container>
  );
}

export default App;
