import { User } from '../contexts/AuthContext';

// Dummy users for testing
export const dummyUsers: User[] = [
  {
    id: '1',
    username: 'john_student',
    fullName: 'John Smith',
    email: 'john@example.com',
    mobile: '+1234567890',
    role: 'student',
    bio: 'Passionate student looking to excel in academics.',
    dateOfBirth: '2005-06-15',
    class: 'Grade 12',
  },
  {
    id: '2',
    username: 'sarah_teacher',
    fullName: 'Sarah Johnson',
    email: 'sarah@example.com',
    mobile: '+1234567891',
    role: 'teacher',
    bio: 'Experienced mathematics teacher with 8+ years of teaching experience.',
    dateOfBirth: '1985-03-22',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    class: 'Grades 9-12',
    experiences: '8 years teaching experience, Masters in Mathematics',
    revenueEarned: 15000,
  },
];

export interface Gig {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  liked: boolean;
  amount: number;
  syllabus: string;
  class: string;
  description: string;
  rating: number;
  studentsAccepted: number;
  createdAt: string;
}

export const dummyGigs: Gig[] = [
  {
    id: '1',
    teacherId: '2',
    teacherName: 'Sarah Johnson',
    subject: 'Mathematics',
    amount: 500,
    liked: false,
    syllabus: 'CBSE',
    class: 'Grade 12',
    description: 'Comprehensive mathematics tutoring covering algebra, calculus, and geometry. Perfect for students preparing for board exams.',
    rating: 4.8,
    studentsAccepted: 12,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    teacherId: '2',
    teacherName: 'Sarah joby',
    liked: true,
    subject: 'joby',
    amount: 600,
    syllabus: 'CBSE',
    class: 'Grade 11',
    description: 'Advanced physics concepts made simple. Hands-on experiments and problem-solving techniques.',
    rating: 4.9,
    studentsAccepted: 8,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    teacherId: '3',
    teacherName: 'Mike Wilson',
    subject: 'English',
    liked: true,
    amount: 400,
    syllabus: 'ICSE',
    class: 'Grade 10',
    description: 'English literature and language skills development. Focus on creative writing and comprehension.',
    rating: 4.6,
    studentsAccepted: 15,
    createdAt: '2024-01-12',
  },
  {
    id: '4',
    teacherId: '4',
    teacherName: 'Azmi Kaka',
    subject: 'Maths',
    amount: 400,
    liked: true,
    syllabus: 'ICSE',
    class: 'Grade 10',
    description: 'English literature and language skills development. Focus on creative writing and comprehension.',
    rating: 4.6,
    studentsAccepted: 15,
    createdAt: '2024-01-12',
  },
];

export interface Bid {
  id: string;
  studentId: string;
  studentName: string;
  gigId: string;
  gigTitle: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  class: string;
  syllabus: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const dummyBids: Bid[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    gigId: '1',
    gigTitle: 'Mathematics Tutoring',
    teacherId: '2',
    teacherName: 'Sarah Johnson',
    subject: 'Mathematics',
    class: 'Grade 12',
    syllabus: 'CBSE',
    amount: 450,
    status: 'pending',
    createdAt: '2024-01-16',
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Smith',
    gigId: '2',
    gigTitle: 'Physics Advanced',
    teacherId: '2',
    teacherName: 'Sarah Johnson',
    subject: 'Physics',
    class: 'Grade 11',
    syllabus: 'CBSE',
    amount: 550,
    status: 'accepted',
    createdAt: '2024-01-14',
  },
];

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const dummyChats: ChatConversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    participantNames: ['John Smith', 'Sarah Johnson'],
    lastMessage: 'Thanks for the physics session today!',
    lastMessageTime: '2024-01-16T10:30:00Z',
    unreadCount: 2,
  },
];

export const dummyMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    message: 'Hi Sarah, I have a question about calculus.',
    timestamp: '2024-01-16T09:00:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    message: 'Sure John! What would you like to know?',
    timestamp: '2024-01-16T09:05:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    message: 'Thanks for the physics session today!',
    timestamp: '2024-01-16T10:30:00Z',
    read: false,
  },
];