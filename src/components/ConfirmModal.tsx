import React from 'react';
import { Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Xác nhận',
  content = 'Bạn có chắc chắn?',
  okText = 'Đồng ý',
  cancelText = 'Hủy',
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      zIndex={9999}
      centered
      destroyOnClose
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;
