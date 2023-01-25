import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar as fullStar,
  faStarHalfAlt,
} from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

interface IProps {
  value: number
  text: string
}

const Rating: FC<IProps> = ({ value, text }) => {
  return (
    <div className="rating">
      <span>
        <FontAwesomeIcon
          icon={value >= 1 ? fullStar : value >= 0.5 ? faStarHalfAlt : faStar}
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={value >= 2 ? fullStar : value >= 1.5 ? faStarHalfAlt : faStar}
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={value >= 3 ? fullStar : value >= 2.5 ? faStarHalfAlt : faStar}
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={value >= 4 ? fullStar : value >= 3.5 ? faStarHalfAlt : faStar}
        />
      </span>
      <span>
        <FontAwesomeIcon
          icon={value >= 5 ? fullStar : value >= 4.5 ? faStarHalfAlt : faStar}
        />
      </span>
      {text && <span>{text}</span>}
    </div>
  )
}

export default Rating
