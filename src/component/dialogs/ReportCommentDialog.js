import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import { Flag } from 'lucide-react';
import { toast } from 'react-toastify';

const ReportCommentDialog = ({ isOpen, onClose, onSubmit, commentId }) => {
  const [reportReason, setReportReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const CommentReportReason = {
    INAPPROPRIATE: 'Inappropriate comment content',
    HARASSMENT: 'Harassment or bullying',
    HATE_SPEECH: 'Hate speech/discrimination',
    SPAM: 'Spam or advertising',
    MISINFORMATION: 'False or misleading information',
    OFF_TOPIC: 'Off-topic/irrelevant',
    PERSONAL_ATTACK: 'Personal attack',
    TROLLING: 'Trolling/disruptive behavior',
    IMPERSONATION: 'Impersonating others',
    ADULT_CONTENT: 'Adult/NSFW content',
    VIOLENCE: 'Violence/threats',
    PERSONAL_INFO: 'Sharing personal information',
    OTHER: 'Other reasons'
  };

  const handleSubmit = () => {
    if (!reportReason) {
      toast.error('Please select a reason');
      return;
    }

    if (reportReason === 'OTHER' && !additionalInfo.trim()) {
      toast.error('Please provide additional information for other reason');
      return;
    }

    // Gọi callback onSubmit với data
    onSubmit({
      commentId,
      reason: reportReason,
      additionalInfo: reportReason === 'OTHER' ? additionalInfo : (additionalInfo || undefined)
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="max-w-md w-full"
    PaperProps={{
      sx: {
        width: '100%',
        maxWidth: '500px',
        m: 2,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    }}
    >
      <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
        <Flag className="w-5 h-5" />
        Report Comment
      </DialogTitle>
      <DialogContent className="mt-4">
        <FormControl fullWidth className="mb-4">
          <InputLabel id="report-reason-label">Reason for Report</InputLabel>
          <Select
            labelId="report-reason-label"
            value={reportReason}
            label="Reason for Report"
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full"
          >
            {Object.entries(CommentReportReason).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {reportReason === 'OTHER' && (
          <TextField
            label="Additional Information"
            required
            multiline
            rows={4}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full mt-4"
            placeholder="Please provide details about your report..."
          />
        )}
      </DialogContent>
      <DialogActions className="flex justify-end gap-2 p-4">
        <Button
          variant="outlined"
          onClick={onClose}
          className="text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportCommentDialog;