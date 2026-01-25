import React, { useMemo } from "react";
import { Box, Typography, Tooltip, Paper } from "@mui/material";
import type { Prescription } from "../api";
import {
  differenceInDays,
  parseISO,
  min,
  max,
  addDays,
  format,
} from "date-fns";

interface TimelineChartProps {
  medications: Prescription[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ medications }) => {
  const groupedMeds = useMemo(() => {
    const groups: {
      [key: string]: {
        prescriptions: Prescription[];
        dosages: Set<string>;
      };
    } = {};

    if (medications.length === 0) {
      return {};
    }

    medications.forEach((med) => {
      const key = med.medication_name;
      if (!groups[key]) {
        groups[key] = { prescriptions: [], dosages: new Set() };
      }
      groups[key].prescriptions.push(med);
      groups[key].dosages.add(med.dosage);
    });
    return groups;
  }, [medications]);

  const dateRange = useMemo(() => {
    const validMedications = medications.filter((m) => m.start_date);

    if (validMedications.length === 0) {
      const today = new Date();
      return {
        minDate: addDays(today, -30),
        maxDate: addDays(today, 30),
        totalDays: 60,
      };
    }

    const allDates = validMedications.flatMap((m) => {
      const start = parseISO(m.start_date as string); // Cast to string as we filtered for non-null
      const end = m.end_date ? parseISO(m.end_date) : new Date();
      return [start, end];
    });

    allDates.push(new Date());

    const earliest = min(allDates);
    const latest = max(allDates);

    const paddedMin = addDays(earliest, -30);
    const paddedMax = addDays(latest, 30);

    return {
      minDate: paddedMin,
      maxDate: paddedMax,
      totalDays: differenceInDays(paddedMax, paddedMin),
    };
  }, [medications]);

  if (Object.keys(groupedMeds).length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          No medications found for this patient (or none with valid start dates
          for timeline).
        </Typography>
      </Box>
    );
  }

  const getPositionPct = (date: Date) => {
    const diff = differenceInDays(date, dateRange.minDate);
    return (diff / dateRange.totalDays) * 100;
  };

  const todayPct = getPositionPct(new Date());

  return (
    <Paper sx={{ mt: 4, p: 2, overflow: "hidden" }} elevation={3}>
      {/* Header Row: Legend / Dates */}
      <Box
        sx={{
          display: "flex",
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Medication History</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "info.main",
                borderRadius: "2px",
              }}
            />
            <Typography variant="caption">Medication Period</Typography>
          </Box>{" "}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{ width: 2, height: 12, bgcolor: "red", borderRadius: "50%" }}
            />
            <Typography variant="caption">Today</Typography>
          </Box>
        </Box>
      </Box>

      {/* Chart Container */}
      <Box
        sx={{
          display: "flex",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
        }}
      >
        {/* Left Columns: Name + Dosage */}
        <Box
          sx={{
            minWidth: "320px",
            maxWidth: "320px",
            borderRight: "1px solid #e0e0e0",
            bgcolor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header for Left Columns */}
          <Box
            sx={{
              height: "40px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: "200px",
                display: "flex",
                alignItems: "center",
                px: 2,
                fontWeight: "bold",
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              Medication
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                px: 1,
                fontWeight: "bold",
                color: "text.secondary",
                fontSize: "0.875rem",
                borderLeft: "1px solid #e0e0e0",
              }}
            >
              Dosage
            </Box>
          </Box>
          {/* Rows */}
          {Object.entries(groupedMeds).map(([name, group]) => (
            <Box
              key={name}
              sx={{
                height: "60px",
                borderBottom: "1px solid #eee",
                position: "relative",
                width: "100%",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Box
                sx={{
                  width: "200px",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500 }}
                  noWrap
                  title={name}
                >
                  {name}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  borderLeft: "1px solid #eee",
                  overflow: "hidden",
                }}
              >
                <Typography variant="caption" noWrap>
                  {Array.from(group.dosages).join(", ")}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Column: Timeline */}
        <Box
          sx={{
            flexGrow: 1,
            overflowX: "auto",
            position: "relative",
          }}
        >
          {/* Date Axis (Top) */}
          <Box
            sx={{
              height: "40px",
              borderBottom: "1px solid #e0e0e0",
              position: "relative",
              width: "100%",
              minWidth: "800px",
            }}
          >
            {/* Render some date markers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const pct = (i / 11) * 100;
              const d = addDays(
                dateRange.minDate,
                dateRange.totalDays * (i / 11),
              );
              return (
                <Typography
                  key={i}
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: `${pct}%`,
                    transform: "translateX(-50%)",
                    top: "10px",
                    color: "text.secondary",
                  }}
                >
                  {format(d, "MMM yyyy")}
                </Typography>
              );
            })}
          </Box>

          {/* Timeline Body */}
          <Box sx={{ position: "relative", minWidth: "800px" }}>
            {/* Today Line */}
            <Box
              sx={{
                position: "absolute",
                left: `${todayPct}%`,
                top: 0,
                bottom: 0,
                width: "2px",
                bgcolor: "red",
                zIndex: 10,
                pointerEvents: "none",
              }}
            />

            {/* Rows */}
            {Object.entries(groupedMeds).map(([name, group]) => (
              <Box
                key={name}
                sx={{
                  height: "60px",
                  borderBottom: "1px solid #eee",
                  position: "relative",
                  width: "100%",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                {/* Render bars for this medication */}
                {group.prescriptions.map((med) => {
                  // Only render if start_date is available for timeline placement
                  if (!med.start_date) return null;

                  const start = parseISO(med.start_date);
                  const end = med.end_date
                    ? parseISO(med.end_date)
                    : new Date();

                  const leftPct = getPositionPct(start);
                  const widthPct = Math.max(getPositionPct(end) - leftPct, 0.5);

                  return (
                    <Tooltip
                      key={med.id}
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {med.medication_name} ({med.dosage})
                          </Typography>
                          <Typography variant="body2">
                            {med.start_date} — {med.end_date || "Ongoing"}
                          </Typography>
                          {med.prescribing_doctor && (
                            <Typography variant="body2">
                              Prescriber: {med.prescribing_doctor}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            {med.frequency}
                          </Typography>
                          {med.notes && (
                            <Typography variant="caption">
                              {med.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          top: "15px",
                          height: "30px",
                          bgcolor: "info.main",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          px: 0.5,
                          cursor: "pointer",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          boxShadow: 1,
                          "&:hover": {
                            bgcolor: "info.dark",
                          },
                        }}
                      >
                        {/* Dosage text is now in its own column, removed from here */}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default TimelineChart;
