import { collection, getDocs} from 'firebase/firestore';
import { db } from './config';

export async function getReservations() {
    const querySnapshot = await getDocs(collection(db, "reservation-logs"));
    
    var logs = new Array(querySnapshot.size)
    var data;
    querySnapshot.forEach((doc) => {
        data = doc.data()
        logs.push(data)
    });

    return logs
}