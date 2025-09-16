import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Skeleton,
} from '@mui/material';

/**
 * Performance-optimized vertical skeleton component matching MaidCard exactly
 * Features: GPU-accelerated shimmer, vertical layout, exact dimensions
 */
export default function MaidCardVerticalSkeleton() {
  return (
    <Card
      sx={{
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(12, 25, 27, 0.12)',
        position: 'relative',
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        // Performance optimizations
        contain: 'layout',
        willChange: 'opacity',
        // Shimmer keyframes animation
        '@keyframes shimmer': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(100%)'
          }
        },
        '& .shimmer-element': {
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.200',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            transform: 'translateX(-100%)',
            animation: 'shimmer 1.5s infinite ease-in-out',
            willChange: 'transform'
          }
        }
      }}
    >
      {/* Image Section - Top */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: 200,
        overflow: 'hidden'
      }}>
        {/* Image skeleton with shimmer */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="shimmer-element"
          sx={{
            bgcolor: 'grey.200',
          }}
        />

        {/* Status badge skeleton */}
        <Box sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 2,
        }}>
          <Skeleton
            variant="rounded"
            width={60}
            height={20}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.300',
              borderRadius: '12px'
            }}
          />
        </Box>

        {/* Lock icon placeholder (centered) */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            className="shimmer-element"
            sx={{ bgcolor: 'grey.300' }}
          />
        </Box>
      </Box>

      {/* Content Section - Bottom */}
      <CardContent sx={{
        p: 2,
        pb: '16px !important',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {/* Name + Flag row */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          {/* Name skeleton */}
          <Skeleton
            variant="text"
            width="70%"
            height={24}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.300',
              flex: 1
            }}
          />
          {/* Flag skeleton */}
          <Skeleton
            variant="rectangular"
            width={20}
            height={15}
            className="shimmer-element"
            sx={{ bgcolor: 'grey.300', borderRadius: '2px' }}
          />
        </Box>

        {/* Country skeleton */}
        <Skeleton
          variant="text"
          width="45%"
          height={16}
          className="shimmer-element"
          sx={{ bgcolor: 'grey.200' }}
        />

        {/* Age, Experience row */}
        <Box sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}>
          <Skeleton
            variant="text"
            width={40}
            height={16}
            className="shimmer-element"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Box sx={{
            width: '1px',
            height: '16px',
            backgroundColor: 'grey.300',
          }} />
          <Skeleton
            variant="text"
            width={60}
            height={16}
            className="shimmer-element"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>

        {/* Skills Row */}
        <Box sx={{
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
        }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rounded"
              width={24}
              height={24}
              className="shimmer-element"
              sx={{
                bgcolor: 'grey.200',
                borderRadius: '4px'
              }}
            />
          ))}
          <Skeleton
            variant="text"
            width={20}
            height={16}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.200',
              alignSelf: 'center'
            }}
          />
        </Box>

        {/* Salary skeleton */}
        <Skeleton
          variant="text"
          width="50%"
          height={24}
          className="shimmer-element"
          sx={{
            bgcolor: '#25D36620',
            '&::after': {
              background: 'linear-gradient(90deg, transparent, rgba(37,211,102,0.3), transparent)'
            }
          }}
        />

        {/* Buttons */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mt: 1
        }}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={36}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.200',
              borderRadius: '8px'
            }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={36}
            className="shimmer-element"
            sx={{
              bgcolor: 'grey.300',
              borderRadius: '8px'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}