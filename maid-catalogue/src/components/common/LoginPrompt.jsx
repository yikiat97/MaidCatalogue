import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

const LoginPrompt = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleOpenChange = (newOpen) => {
    // If dialog is being closed, redirect to home
    if (!newOpen) {
      navigate('/');
    } else {
      // If dialog is being opened, call the parent's onOpenChange
      onOpenChange?.(newOpen);
    }
  };

  return (
    <>
      {/* Custom styles for the dialog overlay */}
      <style>{`
        [data-radix-dialog-overlay][data-state="open"] {
          background-color: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
      `}</style>
      <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            )}
          >
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                Login Required
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 text-center leading-relaxed">
                MOM regulations require users to be logged in before accessing this page. You can register for a free account if needed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 sm:justify-center">
              <Button onClick={handleLogin} variant="primary" size="medium" className="w-full sm:w-auto min-w-[140px]">
                Go to Login
              </Button>
            </DialogFooter>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </>
  );
};

export default LoginPrompt;

