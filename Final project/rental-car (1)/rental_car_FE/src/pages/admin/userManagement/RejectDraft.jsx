import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  TextField,
  Typography,
  OutlinedInput
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const REJECTION_REASONS = [
  'Invalid driving license',
  'Invalid detailed address',
  'Invalid phone number',
  'Invalid citizen ID',
  'Other reason'
];

const RejectionDialog = ({ open, handleClose, onReject, draftId }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  const handleReasonChange = (event) => {
    const value = event.target.value;
    setSelectedReasons(value);
  };

  const handleOtherReasonChange = (event) => {
    const text = event.target.value;
    if (text.length <= MAX_CHARS) {
      setOtherReason(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = () => {
    let finalReasons = [...selectedReasons];
    
    if (selectedReasons.includes('Other reason') && otherReason.trim()) {
      finalReasons = finalReasons.filter(reason => reason !== 'Other reason');
      finalReasons.push(` ${otherReason.trim()}`);
    }
    
    onReject(draftId, finalReasons);
    handleClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedReasons([]);
    setOtherReason('');
    setCharCount(0);
  };

  const showOtherReasonField = selectedReasons.includes('Other reason');

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        handleClose();
        resetForm();
      }}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: 'blur(10px)' }} // Thêm hiệu ứng mờ cho nền
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#EDE7F6', // Tông màu tím nhạt
        color: '#4A148C', // Màu chữ tím đậm
        fontWeight: 'bold',
        borderBottom: '1px solid #D1C4E9'
      }}>
        <WarningAmberIcon sx={{ mr: 1, color: '#FF9800' }} />
        Reject Draft Confirmation
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, backgroundColor: '#FFFFFF' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please select the reason(s) for rejecting this draft. This information will be provided to the user.
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="rejection-reasons-label">Rejection Reasons</InputLabel>
          <Select
            labelId="rejection-reasons-label"
            id="rejection-reasons"
            multiple
            value={selectedReasons}
            onChange={handleReasonChange}
            input={<OutlinedInput label="Rejection Reasons" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip 
                    key={value} 
                    label={value} 
                    sx={{ 
                      bgcolor: value === 'Other reason' ? '#D1C4E9' : '#E0E0E0',
                      '&:hover': { bgcolor: value === 'Other reason' ? '#B39DDB' : '#D5D5D5' },
                      transition: 'background-color 0.3s ease' // Hiệu ứng chuyển màu mượt mà
                    }}
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {REJECTION_REASONS.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {showOtherReasonField && (
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Specify other reason"
              multiline
              rows={4}
              fullWidth
              value={otherReason}
              onChange={handleOtherReasonChange}
              placeholder="Please specify the reason for rejection (maximum 500 characters)"
              variant="outlined"
              inputProps={{ maxLength: MAX_CHARS }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F3E5F5' } }} // Nền ô nhập
            />
            <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'flex-end', color: charCount > MAX_CHARS * 0.8 ? '#f44336' : 'text.secondary' }}>
              {charCount}/{MAX_CHARS} characters
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between', backgroundColor: '#EDE7F6' }}>
        <Button 
          onClick={() => {
            handleClose();
            resetForm();
          }}
          variant="outlined"
          startIcon={<CloseIcon />}
          sx={{ color: '#4A148C', borderColor: '#4A148C' }} // Màu nút hủy
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="error"
          disabled={selectedReasons.length === 0 || (showOtherReasonField && otherReason.trim() === '')}
          sx={{ backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' }}}
        >
          Confirm Rejection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionDialog;
