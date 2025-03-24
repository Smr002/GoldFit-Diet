const BodyPartIcons = ({ type }) => {
    // Map the icon type to the appropriate SVG URL
    const getIconUrl = (iconType) => {
      switch (iconType) {
        case "favorites":
          return null // We'll use a custom SVG for favorites
        case "cardio":
          return null // We'll use a custom SVG for cardio
        case "chest":
          return "https://my.lyfta.app/icons/muscles/ic_chip_chest_b.svg"
        case "back":
          return "https://my.lyfta.app/icons/muscles/ic_chip_back_b.svg"
        case "upper-legs":
          return "https://my.lyfta.app/icons/muscles/chip_quadriceps_b.svg"
        case "shoulders":
          return "https://my.lyfta.app/icons/muscles/ic_chip_shoulders_b.svg"
        case "upper-arms":
          return "https://my.lyfta.app/icons/muscles/chip_biceps_b.svg"
        case "waist":
          return "https://my.lyfta.app/icons/muscles/chip_abs_b.svg"
        case "lower-legs":
          return "https://my.lyfta.app/icons/muscles/ic_chip_calves_b.svg"
        case "lower-arms":
          return "https://my.lyfta.app/icons/muscles/ic_chip_forearms_b.svg"
        case "neck":
          return "https://my.lyfta.app/icons/muscles/ic_chip_neck_b.svg"
        case "filters":
          return null // We'll use a custom SVG for filters
        default:
          return null
      }
    }
  
    // For icons that don't have external SVGs, we'll use custom SVGs
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
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              stroke="black"
              strokeWidth="2"
              fill="#FF4D4D"
            />
          </svg>
        )
      case "filters":
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        )
      default:
        const iconUrl = getIconUrl(type)
        if (iconUrl) {
          return <img src={iconUrl || "/placeholder.svg"} alt={type} width="40" height="40" />
        }
        return null
    }
  }
  
  export default BodyPartIcons
  
  