import { useState, useEffect } from "react";
import { getExercisesById } from "@/api"; // Adjust path as needed

const ExerciseDetailModal = ({ exerciseId, token, onClose }) => {
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndEnrichExercise = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch from your local API by ID
        const localExercise = await getExercisesById(exerciseId, token);

        // Step 2: Fetch metadata from ExerciseDB using the name
        const res = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(
            localExercise.name.toLowerCase()
          )}`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY || "",
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );

        const dbData = (await res.json())[0] || {};

        const enrichedExercise = {
          ...localExercise,
          gifUrl: dbData?.gifUrl || "/placeholder.svg",
          bodyPart: dbData?.bodyPart || "other",
          target: dbData?.target || "general",
          equipment: dbData?.equipment || "body weight",
          instructions: dbData?.instructions || [
            "Follow the animation",
            `Perform ${localExercise.name} with good form.`,
          ],
        };

        setExerciseDetails(enrichedExercise);
      } catch (error) {
        console.error("Failed to fetch and enrich exercise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndEnrichExercise();
  }, [exerciseId, token]);

  if (!exerciseDetails) return null;

  return (
    <div
      className="exercise-modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        {loading ? (
          <div className="modal-skeleton">{/* skeleton UI */}</div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">{exerciseDetails.name}</h2>
            </div>

            <div className="modal-content">
              <div className="modal-gif-container">
                <img
                  src={exerciseDetails.gifUrl}
                  alt={exerciseDetails.name}
                  className="modal-gif"
                />
              </div>

              <div className="modal-info">
                <div className="info-section details-section">
                  <h3>Exercise Details</h3>
                  <div className="exercise-details-grid">
                    <span className="detail-label">Target Muscle:</span>
                    <span className="detail-value">
                      {exerciseDetails.target}
                    </span>

                    <span className="detail-label">Body Part:</span>
                    <span className="detail-value">
                      {exerciseDetails.bodyPart}
                    </span>

                    <span className="detail-label">Equipment:</span>
                    <span className="detail-value">
                      {exerciseDetails.equipment}
                    </span>

                    <span className="detail-label">Sets:</span>
                    <span className="detail-value">{exerciseDetails.sets}</span>

                    <span className="detail-label">Reps:</span>
                    <span className="detail-value">{exerciseDetails.reps}</span>

                    <span className="detail-label">Rest:</span>
                    <span className="detail-value">
                      {exerciseDetails.rest} seconds
                    </span>
                  </div>
                </div>

                <div className="info-section instructions-section">
                  <h3>Instructions</h3>
                  <ol className="instructions-list">
                    {exerciseDetails.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
