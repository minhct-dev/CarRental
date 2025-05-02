
import { useSelector } from 'react-redux';
import BookingListCarOwner from './BookingList';
import RequestList from './../../driver/requestList/RequestList';


const RootBooking = () => {
    const profile = useSelector((state) => state.auth.profile);

    if(profile.roles.includes("driver")){
        return <RequestList></RequestList>
    }
    if(profile.roles.includes("carOwner")){
        return <BookingListCarOwner></BookingListCarOwner>
    }
 
 
}

export default RootBooking