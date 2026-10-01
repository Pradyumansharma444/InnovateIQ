import React from 'react';
import { FreeAccessModal } from './FreeAccessModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoogleAuthModal: React.FC<Props> = (props) => {
  return <FreeAccessModal {...props} />;
};

export { FreeAccessModal };
