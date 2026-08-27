import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const faqSections = [
  {
    title: 'Getting Started',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign Up" on the landing page. Choose whether you are a Student or Tutor, fill in your details (name, username, email, password), and complete your profile. You will be logged in automatically after registration.',
      },
      {
        q: 'What is the difference between a Student and a Tutor?',
        a: 'Tutors can create gigs (listings for their tutoring services), view and manage bids from students, and accept or reject requests. Students can browse gigs, place bids on tutors, manage their wishlist, and message tutors directly.',
      },
      {
        q: 'Can I switch my role after signing up?',
        a: 'No. Your role (Student or Tutor) is set during registration and cannot be changed. If you need both roles, you would need to create two separate accounts with different usernames.',
      },
    ],
  },
  {
    title: 'For Students',
    items: [
      {
        q: 'How do I find a tutor?',
        a: 'Go to the Explorer page to browse all available gigs. You can filter by subject, grade level, and price range. Click on a gig to see the tutor\'s profile, reviews from other students, and details about what they teach.',
      },
      {
        q: 'How do I place a bid?',
        a: 'Open any gig and click "Place Bid." Enter your proposed price and submit. You can only place one bid per gig. If you change your mind, you can withdraw your bid before the tutor responds.',
      },
      {
        q: 'What happens after a tutor accepts my bid?',
        a: 'Once a tutor accepts your bid, its status changes to ACCEPTED. You can then start a chat conversation with the tutor to discuss scheduling and details. The bid can be marked as COMPLETED when the tutoring is finished.',
      },
      {
        q: 'How do I save a gig for later?',
        a: 'Click the heart icon on any gig to add it to your Wishlist. Access your wishlist from the sidebar or footer to review saved gigs later.',
      },
    ],
  },
  {
    title: 'For Tutors',
    items: [
      {
        q: 'How do I create a gig?',
        a: 'Go to "Create Gig" from your dashboard or the navbar. Fill in the subject, description, grade level, syllabus topics, and your pricing. Your gig will appear on the Explorer page for students to browse.',
      },
      {
        q: 'How do I manage incoming bids?',
        a: 'Go to "Requests" from your dashboard to see all pending bids on your gigs. You can accept, reject, or ignore each bid. When you accept a bid, a chat is automatically created with the student.',
      },
      {
        q: 'Can I edit or delete my gig?',
        a: 'Yes. Go to "My Gigs" to see all your listings. You can edit the subject, description, grade, syllabus, and price. You can also delete a gig, which will also remove all associated bids and wishlist entries.',
      },
      {
        q: 'How do I complete a tutoring engagement?',
        a: 'Once you have delivered the tutoring service, go to the bid in your Requests and mark it as COMPLETED. This lets the student know the session is finished and they can leave a rating.',
      },
    ],
  },
  {
    title: 'Messaging and Chat',
    items: [
      {
        q: 'How do I start a conversation?',
        a: 'Click the "Message" button on any tutor\'s profile page to start a private chat. If a chat already exists with that tutor, it will open the existing conversation.',
      },
      {
        q: 'Can I create group chats?',
        a: 'Yes. Group chats can be created for collaborative learning. Group chat members can be added after creation.',
      },
      {
        q: 'Are my messages private?',
        a: 'Private chats are visible only to the two participants. Group chats are visible to all members of the group. Messages are stored securely and are not shared with third parties.',
      },
    ],
  },
  {
    title: 'Ratings and Reviews',
    items: [
      {
        q: 'How do I rate a tutor?',
        a: 'After a tutoring engagement is marked as COMPLETED, you can submit a rating (1-5 stars) and an optional comment. Ratings help other students find quality tutors.',
      },
      {
        q: 'Can I see a tutor\'s ratings before bidding?',
        a: 'Yes. Each tutor\'s profile page shows their average rating and individual reviews from other students. The Explorer page also displays the average rating on each gig card.',
      },
    ],
  },
  {
    title: 'Account and Security',
    items: [
      {
        q: 'How is my password protected?',
        a: 'Your password is encrypted on your device using RSA-OAEP-256 before being sent to our servers. It is then BCrypt-hashed before storage. We never store or have access to your plaintext password.',
      },
      {
        q: 'I forgot my password. What do I do?',
        a: 'Click "Forgot Password?" on the login page and enter your registered email. You will receive a reset link valid for 1 hour. Follow the link to set a new password.',
      },
      {
        q: 'I forgot my username.',
        a: 'Click "Forgot Username?" on the login page and enter your registered email. Your username will be sent to your email address.',
      },
      {
        q: 'How do I update my profile?',
        a: 'Go to your Dashboard (Student or Teacher) and click "Edit Profile." You can update your name, bio, subjects, experience, grade, and profile picture.',
      },
    ],
  },
];

const HelpCenter: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Help Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Find answers to common questions about using TutorGigs.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
        Can't find what you're looking for? Contact us at{' '}
        <Link href="mailto:support@tutorgigs.com">support@tutorgigs.com</Link>.
      </Typography>

      {faqSections.map((section) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {section.title}
          </Typography>
          {section.items.map((item) => (
            <Accordion key={item.q} disableGutters>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Container>
  );
};

export default HelpCenter;
