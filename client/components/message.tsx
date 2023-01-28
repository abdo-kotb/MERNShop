import { FC, ReactNode } from 'react'
import { Alert, AlertProps } from 'react-bootstrap'

interface IProps {
  variant?: AlertProps['variant']
  children: ReactNode
}

const Message: FC<IProps> = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{children}</Alert>
}

export default Message
