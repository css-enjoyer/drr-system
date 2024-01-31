import { collection, getDocs} from 'firebase/firestore';
import { db } from './config';

export async function getReservations() {
    const querySnapshot = await getDocs(collection(db, "reservatio"));
    
    var logs;
    
    querySnapshot.forEach((doc) => {
        logs = doc.data()
    });

    return logs
}