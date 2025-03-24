const BodyPartIcons = ({ type }) => {
    switch (type) {
      case "favorites":
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        )
      case "cardio":
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.34 11a10 10 0 0 1 17.32 0M3.34 13a10 10 0 0 0 17.32 0M12 6.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM12 21.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
              stroke="black"
              strokeWidth="2"
            />
            <path d="M7 14.5h10v-5H7v5z" fill="#FF4D4D" stroke="black" strokeWidth="1" />
          </svg>
        )
      case "chest":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Chest muscles */}
            <path
              d="M35 40 C35 35 40 30 50 30 C60 30 65 35 65 40 C65 50 60 55 50 60 C40 55 35 50 35 40"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Chest
            </text>
          </svg>
        )
      case "back":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Back muscles */}
            <path
              d="M30 30 C40 25 60 25 70 30 C75 40 75 60 70 70 C60 75 40 75 30 70 C25 60 25 40 30 30"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Back
            </text>
          </svg>
        )
      case "thighs":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Thigh muscles */}
            <path
              d="M35 85 C35 80 40 75 50 75 C60 75 65 80 65 85 L65 115 C65 120 60 125 50 125 C40 125 35 120 35 115 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Thighs
            </text>
          </svg>
        )
      case "shoulders":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Shoulder muscles */}
            <path
              d="M25 35 C25 30 30 25 35 25 C40 25 45 30 45 35 C45 40 40 45 35 45 C30 45 25 40 25 35"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
            <path
              d="M55 35 C55 30 60 25 65 25 C70 25 75 30 75 35 C75 40 70 45 65 45 C60 45 55 40 55 35"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Shoulders
            </text>
          </svg>
        )
      case "upper-arms":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Upper arm muscles */}
            <path
              d="M20 45 C20 40 25 35 30 35 C35 35 40 40 40 45 L40 65 C40 70 35 75 30 75 C25 75 20 70 20 65 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
            <path
              d="M60 45 C60 40 65 35 70 35 C75 35 80 40 80 45 L80 65 C80 70 75 75 70 75 C65 75 60 70 60 65 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Upper
            </text>
          </svg>
        )
      case "hips":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Hip muscles */}
            <path
              d="M30 70 C30 65 35 60 40 60 L60 60 C65 60 70 65 70 70 C70 75 65 80 60 80 L40 80 C35 80 30 75 30 70"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Hips
            </text>
          </svg>
        )
      case "waist":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Waist muscles */}
            <path
              d="M35 55 C35 50 40 45 50 45 C60 45 65 50 65 55 C65 60 60 65 50 65 C40 65 35 60 35 55"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Waist
            </text>
          </svg>
        )
      case "calves":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Calf muscles */}
            <path
              d="M40 115 C40 110 45 105 50 105 C55 105 60 110 60 115 L60 135 C60 140 55 145 50 145 C45 145 40 140 40 135 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Calves
            </text>
          </svg>
        )
      case "forearms":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Forearm muscles */}
            <path
              d="M25 65 C25 60 30 55 35 55 C40 55 45 60 45 65 L45 85 C45 90 40 95 35 95 C30 95 25 90 25 85 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
            <path
              d="M55 65 C55 60 60 55 65 55 C70 55 75 60 75 65 L75 85 C75 90 70 95 65 95 C60 95 55 90 55 85 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Forearms
            </text>
          </svg>
        )
      case "neck":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Neck muscles */}
            <path
              d="M40 20 C40 15 45 10 50 10 C55 10 60 15 60 20 L60 30 C60 35 55 40 50 40 C45 40 40 35 40 30 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Neck
            </text>
          </svg>
        )
      case "biceps":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Bicep muscles */}
            <path
              d="M25 45 C25 40 30 35 35 35 C40 35 45 40 45 45 L45 65 C45 70 40 75 35 75 C30 75 25 70 25 65 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Biceps
            </text>
          </svg>
        )
      case "triceps":
        return (
          <svg width="40" height="60" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body outline */}
            <path
              d="M50 10 C40 10 30 15 25 25 C20 35 20 45 20 55 C20 65 20 75 25 85 C30 95 35 105 40 115 C45 125 45 135 45 145 L55 145 C55 135 55 125 60 115 C65 105 70 95 75 85 C80 75 80 65 80 55 C80 45 80 35 75 25 C70 15 60 10 50 10"
              stroke="#D0D0D0"
              strokeWidth="2"
              fill="#F5F5F5"
            />
  
            {/* Tricep muscles */}
            <path
              d="M55 45 C55 40 60 35 65 35 C70 35 75 40 75 45 L75 65 C75 70 70 75 65 75 C60 75 55 70 55 65 Z"
              fill="#FF4D4D"
              stroke="#FF4D4D"
              strokeWidth="1"
            />
  
            {/* Label */}
            <text x="50" y="155" textAnchor="middle" fontSize="14" fontFamily="Arial">
              Triceps
            </text>
          </svg>
        )
      case "filters":
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        )
      default:
        return null
    }
  }
  
  export default BodyPartIcons
  
  