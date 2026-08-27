import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: August 27, 2026
      </Typography>

      <Box sx={{ '& h6': { mt: 4, mb: 2 }, '& p': { mb: 2 }, '& ul': { mb: 2, pl: 4 } }}>
        <Typography variant="h6">1. Acceptance of Terms</Typography>
        <Typography variant="body1">
          By accessing or using TutorGigs, you agree to be bound by these Terms of Service.
          If you do not agree to these terms, you may not use the platform.
        </Typography>

        <Typography variant="h6">2. Account Registration</Typography>
        <Typography variant="body1">
          You must provide accurate and complete information when creating an account. You are
          responsible for maintaining the confidentiality of your credentials. You may register
          as either a Student or a Tutor — your role determines which features you can access.
        </Typography>
        <Typography variant="body1">
          One person may not maintain multiple accounts. Usernames must be unique and cannot
          be changed after registration.
        </Typography>

        <Typography variant="h6">3. Roles and Responsibilities</Typography>
        <Typography variant="body1">
          <strong>Tutors</strong> may create gigs specifying subjects they teach, grade levels,
          syllabus coverage, and pricing. Tutors are responsible for delivering quality
          instruction as described in their gigs.
        </Typography>
        <Typography variant="body1">
          <strong>Students</strong> may browse gigs, place bids with proposed pricing, and
          communicate with tutors through the platform's messaging system. Students are expected
          to honor accepted engagements.
        </Typography>

        <Typography variant="h6">4. Bidding and Pricing</Typography>
        <Typography variant="body1">
          Students place bids on gigs with a proposed price. Tutors may accept, reject, or
          ignore bids. A student may only have one active bid per gig at a time. Once a tutor
          accepts a bid, both parties are expected to honor the agreed terms.
        </Typography>
        <Typography variant="body1">
          TutorGigs does not currently process payments. All financial arrangements are between
          the student and tutor directly. The platform is not responsible for payment disputes.
        </Typography>

        <Typography variant="h6">5. Content and Conduct</Typography>
        <Typography variant="body1">You agree not to:</Typography>
        <ul>
          <li>Post misleading or fraudulent gig descriptions</li>
          <li>Use the platform for spam, harassment, or illegal activities</li>
          <li>Impersonate another user or misrepresent your qualifications</li>
          <li>Circumvent the platform to arrange sessions outside TutorGigs</li>
          <li>Share inappropriate, offensive, or harmful content in messages</li>
        </ul>

        <Typography variant="h6">6. Ratings and Reviews</Typography>
        <Typography variant="body1">
          Students may rate tutors after a completed engagement. Ratings should be honest and
          based on actual experience. Tutors may not solicit or pressure students for favorable
          ratings. Rating manipulation or abuse may result in account suspension.
        </Typography>

        <Typography variant="h6">7. Intellectual Property</Typography>
        <Typography variant="body1">
          Tutors retain ownership of their original teaching materials. By posting content on
          TutorGigs, you grant the platform a non-exclusive license to display and distribute
          that content within the platform. You may not copy or redistribute another user's
          content without permission.
        </Typography>

        <Typography variant="h6">8. Account Termination</Typography>
        <Typography variant="body1">
          You may delete your account at any time from your dashboard. We reserve the right to
          suspend or terminate accounts that violate these terms, engage in fraudulent activity,
          or harm other users. Upon deletion, your personal data is removed from our active
          systems.
        </Typography>

        <Typography variant="h6">9. Limitation of Liability</Typography>
        <Typography variant="body1">
          TutorGigs is a marketplace that connects students and tutors. We are not a party to
          any agreement between students and tutors. We do not guarantee the quality, safety,
          or legality of tutoring services offered through the platform. Use of the platform is
          at your own risk.
        </Typography>

        <Typography variant="h6">10. Changes to These Terms</Typography>
        <Typography variant="body1">
          We may modify these Terms of Service at any time. Significant changes will be
          communicated through the platform. Your continued use after changes take effect
          constitutes acceptance of the updated terms.
        </Typography>

        <Typography variant="h6">11. Contact</Typography>
        <Typography variant="body1">
          Questions about these terms? Reach us at{' '}
          <Link href="mailto:support@tutorgigs.com">support@tutorgigs.com</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;
