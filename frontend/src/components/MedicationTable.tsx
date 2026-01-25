import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { parseISO, isAfter, startOfDay } from "date-fns";
import type { Prescription } from "../api";

interface MedicationTableProps {
  medications: Prescription[];
}

const MedicationTable: React.FC<MedicationTableProps> = ({ medications }) => {
  if (medications.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No medications found for this patient.
        </Typography>
      </Box>
    );
  }

  const getStatus = (med: Prescription) => {
    if (!med.end_date) return "Active";
    const end = parseISO(med.end_date);
    const today = startOfDay(new Date());
    if (isAfter(end, today) || end.getTime() === today.getTime()) {
      return "Active";
    }
    return "Ended";
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }} elevation={3}>
      <Table sx={{ minWidth: 650 }} aria-label="medication table">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Medication Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Dosage</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Route</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Frequency</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Prescriber</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medications.map((med) => {
            const status = getStatus(med);

            return (
              <TableRow
                key={med.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {med.medication_name}
                </TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.route}</TableCell>
                <TableCell>{med.frequency}</TableCell>
                <TableCell>{med.prescribing_doctor}</TableCell>
                <TableCell>
                  {med.start_date || (
                    <Typography variant="caption" color="error">
                      Unknown
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {med.end_date || (
                    <Typography variant="caption" fontStyle="italic">
                      Ongoing
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={status}
                    color={status === "Active" ? "success" : "default"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MedicationTable;
