import { useState, useEffect } from 'react';

const ExerciseDetailModal = ({ exercise, onClose }) => {
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching exercise details
    // In a real app, you would make an API call here
    const simulateFetch = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data that would come from your API
      const mockDetails = {
        id: exercise.id,
        name: exercise.name,
        gifUrl: `/assets/exercise-${Math.floor(Math.random() * 5) + 1}.gif`,
        target: ['Core', 'Abs', 'Lower back'][Math.floor(Math.random() * 3)],
        bodyPart: ['Waist', 'Back', 'Chest'][Math.floor(Math.random() * 3)],
        equipment: ['Body weight', 'Dumbbell', 'Barbell'][Math.floor(Math.random() * 3)],
        instructions: [
          "Stand with feet hip-width apart",
          `Perform the ${exercise.name} with proper form`,
          "Keep your core engaged throughout the movement",
          "Breathe steadily and don't hold your breath",
          "Return to starting position in a controlled manner"
        ]
      };
      
      setExerciseDetails(mockDetails);
      setLoading(false);
    };
    
    simulateFetch();
  }, [exercise.id, exercise.name]);

  return (
    <div className="exercise-modal-overlay" onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}>
      <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        {loading ? (
          <div className="modal-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
            </div>
            <div className="skeleton-gif"></div>
            <div className="skeleton-content">
              <div className="skeleton-section">
                <div className="skeleton-section-header"></div>
                <div className="skeleton-details">
                  <div className="skeleton-detail-row"></div>
                  <div className="skeleton-detail-row"></div>
                  <div className="skeleton-detail-row"></div>
                </div>
              </div>
              <div className="skeleton-section">
                <div className="skeleton-section-header"></div>
                <div className="skeleton-instructions">
                  <div className="skeleton-instruction-line"></div>
                  <div className="skeleton-instruction-line"></div>
                  <div className="skeleton-instruction-line"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">{exerciseDetails.name}</h2>
            </div>
            
            <div className="modal-content">
              <div className="modal-gif-container">
                <img
                  src={exerciseDetails.gifUrl || "/assets/fullbody.jpg"}
                  alt={exerciseDetails.name}
                  className="modal-gif"
                />
              </div>
              
              <div className="modal-info">
                <div className="info-section details-section">
                  <h3>Exercise Details</h3>
                  <div className="exercise-details-grid">
                    <span className="detail-label">Target Muscle:</span>
                    <span className="detail-value">{exerciseDetails.target}</span>
                    
                    <span className="detail-label">Body Part:</span>
                    <span className="detail-value">{exerciseDetails.bodyPart}</span>
                    
                    <span className="detail-label">Equipment:</span>
                    <span className="detail-value">{exerciseDetails.equipment}</span>
                    
                    <span className="detail-label">Sets:</span>
                    <span className="detail-value">{exercise.sets}</span>
                    
                    <span className="detail-label">Reps:</span>
                    <span className="detail-value">{exercise.reps}</span>
                    
                    <span className="detail-label">Rest:</span>
                    <span className="detail-value">{exercise.rest} seconds</span>
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
