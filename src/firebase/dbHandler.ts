import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { getStorage, ref } from "firebase/storage";

// Disregard warnings when adding new fields in Firebase, takes time to reflect -isaac

export async function getReservations() {
    const querySnapshot = await getDocs(collection(db, "reservation-logs"));

    const logs = new Array(querySnapshot.size)
    let data;
    querySnapshot.forEach((doc) => {
        data = doc.data()
        logs.push(data)
    });

    return logs
}



// const storage = getStorage();
// const pathReference = ref(storage, 'images/stars.jpg');
// const gsReference = ref(storage, 'gs://bucket/images/stars.jpg');
// const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');

// fetch is firing twice, to fix
export interface Branch {
    branchId: number;
    branchName: string;
    thumbnail: string;
}
export async function getBranches(): Promise<Branch[]> {
    const branches: Branch[] = [];

    const querySnapshot = await getDocs(collection(db, "branches"));
    querySnapshot.forEach(doc => {
        const branchData = doc.data();
        const branch: Branch = {
            branchId: branchData.branchId,
            branchName: branchData.branchName,
            thumbnail: branchData.thumbnail,
            branchTitle: branchData.branchTitle,
            branchLoc: branchData.branchLoc
        };
        console.log(branchData.branchName);
        branches.push(branch);
        console.table(branches);
    });

    return branches;
}