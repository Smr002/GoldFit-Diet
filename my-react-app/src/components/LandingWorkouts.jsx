import React, { useState, useEffect, useRef } from "react";
import fullbody from "../assets/fullbodyblast.jpg";
import corecrusher from "../assets/corecrusher.jpeg";
import hiit from "../assets/hiitcardio.jpg";
import lowerbody from "../assets/lowerbody.webp";
import upperbody from "../assets/upperbody.jpg";

const Workouts = ({setModalOpen}) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const workouts = [
    {
      id: 1,
      title: "Full Body Blast",
      description: "Complete body workout targeting all major muscle groups",
      image: fullbody,
      duration: "45 min",
      difficulty: "Intermediate",
      exercises: [
        { name: "Squats", sets: 3, reps: 12 },
        { name: "Push-ups", sets: 3, reps: 10 },
        { name: "Lunges", sets: 3, reps: 12 },
        { name: "Plank", sets: 3, reps: "45 sec" },
        { name: "Burpees", sets: 3, reps: 10 },
      ],
    },
    {
      id: 2,
      title: "Core Crusher",
      description: "Intense core workout for defined abs and stronger back",
      image: corecrusher,
      duration: "30 min",
      difficulty: "Beginner",
      exercises: [
        { name: "Crunches", sets: 3, reps: 15 },
        { name: "Russian Twists", sets: 3, reps: 20 },
        { name: "Leg Raises", sets: 3, reps: 12 },
        { name: "Mountain Climbers", sets: 3, reps: "30 sec" },
        { name: "Plank Variations", sets: 3, reps: "45 sec" },
      ],
    },
    {
      id: 3,
      title: "Upper Body Focus",
      description: "Build strength and definition in arms, chest and shoulders",
      image: upperbody,
      duration: "40 min",
      difficulty: "Intermediate",
      exercises: [
        { name: "Bench Press", sets: 4, reps: 8 },
        { name: "Pull-ups", sets: 3, reps: "Max" },
        { name: "Shoulder Press", sets: 3, reps: 10 },
        { name: "Bicep Curls", sets: 3, reps: 12 },
        { name: "Tricep Dips", sets: 3, reps: 12 },
      ],
    },
    {
      id: 4,
      title: "Lower Body Power",
      description: "Strengthen legs, glutes and improve overall stability",
      image: lowerbody,
      duration: "35 min",
      difficulty: "Advanced",
      exercises: [
        { name: "Deadlifts", sets: 4, reps: 8 },
        { name: "Hip Thrusts", sets: 3, reps: 12 },
        { name: "Bulgarian Split Squats", sets: 3, reps: 10 },
        { name: "Calf Raises", sets: 3, reps: 15 },
        { name: "Leg Press", sets: 3, reps: 12 },
      ],
    },
    {
      id: 5,
      title: "HIIT Cardio",
      description: "High intensity intervals to maximize calorie burn",
      image: hiit,
      duration: "25 min",
      difficulty: "All Levels",
      exercises: [
        { name: "Jumping Jacks", sets: 1, reps: "30 sec" },
        { name: "High Knees", sets: 1, reps: "30 sec" },
        { name: "Burpees", sets: 1, reps: "30 sec" },
        { name: "Mountain Climbers", sets: 1, reps: "30 sec" },
        { name: "Rest", sets: 1, reps: "15 sec" },
      ],
    },
  ];

  const extendedWorkouts = [...workouts, ...workouts, ...workouts];

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("workouts-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pauseAnimation = () => setIsAnimating(false);
  const resumeAnimation = () => setIsAnimating(true);

  const openWorkoutModal = (workout) => {
    setActiveWorkout(workout);
    document.body.style.overflow = "hidden";
  };

  const closeWorkoutModal = () => {
    setActiveWorkout(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section id="workouts" className="section section-gradient">
      <div
        id="workouts-section"
        className={`workouts-content section-content fade-in ${
          isVisible ? "visible" : ""
        }`}
      >
        <h2>Our Workouts</h2>
        <div className="section-divider"></div>
        <p className="workouts-description">
          Discover our expertly designed workout programs crafted to help you
          reach your fitness goals. Click on any workout to see the detailed
          exercise plan.
        </p>

        {/* Workouts Carousel */}
        <div
          className="workout-carousel-container"
          onMouseEnter={pauseAnimation}
          onMouseLeave={resumeAnimation}
          ref={carouselRef}
        >
          <div className={`workout-carousel ${isAnimating ? "animating" : ""}`}>
            {extendedWorkouts.map((workout, index) => (
              <div
                className="workout-card"
                key={`${workout.id}-${index}`}
                onClick={() => openWorkoutModal(workout)}
              >
                <div className="workout-image">
                  <img src={workout.image} alt={workout.title} />
                  <div className="workout-difficulty">{workout.difficulty}</div>
                </div>
                <div className="workout-info">
                  <h3>{workout.title}</h3>
                  <p>{workout.description}</p>
                  <div className="workout-meta">
                    <span className="workout-duration">{workout.duration}</span>
                    <span className="workout-details-btn">View Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workout Detail Modal */}
      {activeWorkout && (
        <div className="workout-modal-overlay" onClick={closeWorkoutModal}>
          <div className="workout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeWorkoutModal}>
              ×
            </button>
            <div className="modal-header">
              <h3>{activeWorkout.title}</h3>
              <div className="modal-meta">
                <span className="modal-difficulty">
                  {activeWorkout.difficulty}
                </span>
                <span className="modal-duration">{activeWorkout.duration}</span>
              </div>
            </div>
            <p className="modal-description">{activeWorkout.description}</p>
            <div className="modal-exercises">
              <h4>Exercise Plan</h4>
              <table className="exercises-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {activeWorkout.exercises.map((exercise, index) => {
                    let visibilityClass = "";
                    if (index === 2) visibilityClass = "semi-visible";
                    else if (index > 2) visibilityClass = "almost-hidden";

                    return (
                      <tr key={index} className={visibilityClass}>
                        <td>{exercise.name}</td>
                        <td>{exercise.sets}</td>
                        <td>{exercise.reps}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button onClick={() => setModalOpen(true)} className="start-workout-btn">Start Workout</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Workouts;
