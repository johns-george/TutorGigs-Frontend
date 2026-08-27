import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: August 27, 2026
      </Typography>

      <Box sx={{ '& h6': { mt: 4, mb: 2 }, '& p': { mb: 2 }, '& ul': { mb: 2, pl: 4 } }}>
        <Typography variant="h6">1. Information We Collect</Typography>
        <Typography variant="body1">
          When you create a TutorGigs account, we collect your full name, username, email address,
          mobile number, date of birth, and role (Student or Tutor). We also store your password
          in encrypted and hashed form — we never store plaintext passwords.
        </Typography>
        <Typography variant="body1">
          Additionally, we collect data you generate while using the platform: gigs you post,
          bids you place, messages you send through chat, ratings you submit, and profile
          information you choose to display.
        </Typography>

        <Typography variant="h6">2. How We Use Your Information</Typography>
        <Typography variant="body1">We use your information to:</Typography>
        <ul>
          <li>Authenticate your identity and manage your account</li>
          <li>Match students with tutors based on subject, grade, and availability</li>
          <li>Enable real-time chat between students and tutors</li>
          <li>Process bids, ratings, and wishlists</li>
          <li>Send password reset emails and account-related notifications</li>
          <li>Improve and maintain the platform</li>
        </ul>

        <Typography variant="h6">3. Data Storage and Security</Typography>
        <Typography variant="body1">
          Your data is stored in a PostgreSQL database hosted on Neon (AWS). Passwords are encrypted
          on the client side using RSA-OAEP-256 before transmission, then BCrypt-hashed on the server
          before storage. All API communication should occur over HTTPS in production.
        </Typography>
        <Typography variant="body1">
          JWT access tokens expire after 15 minutes. Refresh tokens expire after 7 days. You can
          log out at any time, which invalidates your current access token.
        </Typography>

        <Typography variant="h6">4. Data Sharing</Typography>
        <Typography variant="body1">
          We do not sell or share your personal information with third parties for marketing purposes.
          Your profile information (name, bio, subjects, profile image) is visible to other
          authenticated users on the platform for the purpose of tutor-student matching.
        </Typography>
        <Typography variant="body1">
          Your email address and mobile number are not displayed to other users.
        </Typography>

        <Typography variant="h6">5. Your Rights</Typography>
        <Typography variant="body1">You have the right to:</Typography>
        <ul>
          <li>Access and update your profile information at any time</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw bids and remove items from your wishlist</li>
          <li>Log out and revoke your session</li>
        </ul>

        <Typography variant="h6">6. Data Retention</Typography>
        <Typography variant="body1">
          We retain your account data for as long as your account is active. If you delete your
          account, your personal information is removed. However, messages in chat conversations
          and anonymous ratings may persist in aggregated or anonymized form.
        </Typography>

        <Typography variant="h6">7. Cookies and Local Storage</Typography>
        <Typography variant="body1">
          TutorGigs uses browser local storage to persist your authentication tokens (access token
          and refresh token) so you stay logged in between sessions. No third-party tracking
          cookies are used.
        </Typography>

        <Typography variant="h6">8. Children's Privacy</Typography>
        <Typography variant="body1">
          TutorGigs is not intended for users under the age of 13. We do not knowingly collect
          personal information from children under 13.
        </Typography>

        <Typography variant="h6">9. Changes to This Policy</Typography>
        <Typography variant="body1">
          We may update this Privacy Policy from time to time. Changes will be reflected on this
          page with an updated date. Continued use of the platform after changes constitutes
          acceptance of the updated policy.
        </Typography>

        <Typography variant="h6">10. Contact Us</Typography>
        <Typography variant="body1">
          If you have questions about this Privacy Policy, contact us at{' '}
          <Link href="mailto:support@tutorgigs.com">support@tutorgigs.com</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
