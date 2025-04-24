import { useEffect, useState, type FC } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import VALIDATE from '@features/auth/mutations/Validate'
import PASSWORD from '@features/auth/mutations/Password'
import Load from '@components/common/Load'

const Password: FC = () => {
    const { id, token } = useParams()
    const [validate] = useMutation(VALIDATE)
    const [isValidating, setIsValidating] = useState(true)
    useEffect(() => {
        (async () => {
            try {
                const { data } = await validate({
                    variables: {
                        id,
                        token
                    }
                })
                if (!data.validate) location.href = '/invalid'
                else setIsValidating(false)
            } catch (e) {
                alert(e)
            }
        })()
    }, [])
    if (isValidating) return <Load />
    return (
        <h1>
            😭😭😭😭😭😭😭😭😭😭😭😭
        </h1>
    )
}
export default Password