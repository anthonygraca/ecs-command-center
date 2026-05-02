import { useState } from "react";

interface CreateEventFormProps {
    onSubmitted: (event: { id: number; title: string; approval_status: string }) => void;
}

const CreateEventForm = ({ onSubmitted }: CreateEventFormProps) => {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!title || title.trim().length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }
        if (!startTime) {
            newErrors.startTime = "Start date and time is required";
        }
        if (!endTime) {
            newErrors.endTime = "End date and time is required";
        }
        if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
            newErrors.endTime = "End time must be after start time";
        }
        if (!location || location.trim().length === 0) {
            newErrors.location = "Location is required";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch("/api/events/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    start_time: startTime,
                    end_time: endTime,
                    location: location.trim(),
                    description: description.trim(),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                onSubmitted(data);
                // reset form after successful submission
                setTitle("");
                setStartTime("");
                setEndTime("");
                setLocation("");
                setDescription("");
            } else {
                setErrors({ submit: "Failed to create event. Please try again." });
            }
        } catch {
            setErrors({ submit: "Failed to create event. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid var(--color-border)",
        fontSize: "0.9em",
        boxSizing: "border-box" as const,
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
    };

    const labelStyle = {
        fontSize: "0.85em",
        fontWeight: "600" as const,
        marginBottom: "6px",
        display: "block" as const,
    };

    const errorStyle = {
        fontSize: "0.78em",
        color: "#dc3545",
        marginTop: "4px",
    };

    return (
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "20px", backgroundColor: "var(--color-bg-elevated)" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "1.2em" }}>Create New Event</h2>
            <p style={{ margin: "0 0 20px", fontSize: "0.85em", color: "var(--color-text-secondary)" }}>
                Fill in the details to schedule your event
            </p>

            {/* title */}
            <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Event Title *</label>
                <input
                    type="text"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                />
                {errors.title && <p style={errorStyle}>{errors.title}</p>}
                <p style={{ fontSize: "0.75em", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                    Minimum 5 characters required
                </p>
            </div>

            {/* start and end time side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                    <label style={labelStyle}>Start Date & Time *</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={inputStyle}
                    />
                    {errors.startTime && <p style={errorStyle}>{errors.startTime}</p>}
                </div>
                <div>
                    <label style={labelStyle}>End Date & Time *</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={inputStyle}
                    />
                    {errors.endTime && <p style={errorStyle}>{errors.endTime}</p>}
                </div>
            </div>

            {/* location */}
            <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Location *</label>
                <input
                    type="text"
                    placeholder="Enter event location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={inputStyle}
                />
                {errors.location && <p style={errorStyle}>{errors.location}</p>}
            </div>

            {/* description */}
            <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Description</label>
                <textarea
                    placeholder="Add event description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                />
            </div>

            {errors.submit && (
                <p style={{ ...errorStyle, marginBottom: "12px" }}>{errors.submit}</p>
            )}

            {/* buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: "10px 24px",
                        backgroundColor: loading ? "#555" : "var(--color-bg-elevated)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "0.9em",
                        cursor: loading ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    {loading && (
                        <span style={{
                            width: "14px",
                            height: "14px",
                            border: "2px solid var(--color-text-secondary)",
                            borderTop: "2px solid var(--color-text)",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spin 0.8s linear infinite",
                        }} />
                    )}
                    {loading ? "Submitting..." : "Create Event"}
                </button>
                <button
                    onClick={() => {
                        setTitle("");
                        setStartTime("");
                        setEndTime("");
                        setLocation("");
                        setDescription("");
                        setErrors({});
                    }}
                    disabled={loading}
                    style={{
                        padding: "10px 24px",
                        backgroundColor: "transparent",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "0.9em",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CreateEventForm;