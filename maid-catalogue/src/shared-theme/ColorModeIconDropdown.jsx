import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';

export default function ColorModeIconDropdown({ size = 'small' }) {
  return (
    <IconButton size={size} color="inherit">
      <Brightness4Icon />
    </IconButton>
  );
}