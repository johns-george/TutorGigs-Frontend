import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

/** Skeleton for a gig card (Explorer, Wishlist, MyGigs) */
export const GigCardSkeleton: React.FC = () => (
  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Box display="flex" gap={1} mt={2}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={50} height={24} />
      </Box>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Skeleton variant="rounded" width="100%" height={40} />
    </Box>
  </Card>
);

/** Skeleton for a profile page (StudentDetails, TeacherDetails) */
export const ProfileSkeleton: React.FC = () => (
  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
    <CardContent sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={3} mb={3}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box>
          <Skeleton variant="text" width={200} height={36} />
          <Skeleton variant="text" width={140} height={24} />
          <Skeleton variant="rounded" width={80} height={24} sx={{ mt: 1 }} />
        </Box>
      </Box>
      <Stack spacing={1.5}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="80%" />
      </Stack>
    </CardContent>
  </Card>
);

/** Skeleton for a bid/request list item */
export const BidCardSkeleton: React.FC = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={64} height={64} />
          <Box>
            <Skeleton variant="text" width={160} height={28} />
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </Box>
        <Skeleton variant="rounded" width={100} height={36} />
      </Box>
    </CardContent>
  </Card>
);

/** Skeleton for a chat list item */
export const ChatItemSkeleton: React.FC = () => (
  <Box display="flex" alignItems="center" gap={2} sx={{ py: 1.5, px: 2 }}>
    <Skeleton variant="circular" width={48} height={48} />
    <Box flex={1}>
      <Skeleton variant="text" width="50%" height={22} />
      <Skeleton variant="text" width="80%" height={18} />
    </Box>
  </Box>
);

/** Grid of gig card skeletons */
export const GigGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
    {Array.from({ length: count }).map((_, i) => (
      <GigCardSkeleton key={i} />
    ))}
  </Box>
);
