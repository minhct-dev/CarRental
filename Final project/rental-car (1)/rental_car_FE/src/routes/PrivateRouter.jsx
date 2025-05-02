import { useSelector } from 'react-redux'
import NotPermisson from '../components/err/NotPermisson'
const PrivateRouter = ({children}) => {
    const login = useSelector((state) => state.auth.login)
    if(login){
        return children
    }
    else{
        return <NotPermisson></NotPermisson>
    }
}

export default PrivateRouter