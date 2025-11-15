import { collection, doc, setDoc } from 'firebase/firestore'
import { firestore } from './firebase'
import { UserRole } from './user-roles'
import { MassageCategory } from './massage-types'

export interface PartnerData {
  uid: string
  email: string
  fullName: string
  phone: string
  role: UserRole
  professionalTitle?: string
  aboutMe?: string
  servicesOffered?: MassageCategory[]
  primaryServiceCity?: string
  serviceAreas?: string[]
  pricing?: {
    [key in MassageCategory]?: number
  }
  availability?: {
    [key: string]: {
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }
  profilePictureUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export const partnerService = {
  async createPartner(data: PartnerData): Promise<void> {
    if (!firestore) {
      throw new Error('Firestore not initialized')
    }

    const partnerRef = doc(collection(firestore, 'partners'), data.uid)
    
    await setDoc(partnerRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  },

  async updatePartner(uid: string, data: Partial<PartnerData>): Promise<void> {
    if (!firestore) {
      throw new Error('Firestore not initialized')
    }

    const partnerRef = doc(collection(firestore, 'partners'), uid)
    
    await setDoc(
      partnerRef,
      {
        ...data,
        updatedAt: new Date()
      },
      { merge: true }
    )
  }
}

