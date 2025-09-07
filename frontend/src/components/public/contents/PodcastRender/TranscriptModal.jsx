// components/modals/TranscriptModal.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import style from '../../../../app/Style';

export default function TranscriptModal({ isOpen, onClose, transcript, title }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className={style.Modal.Dialog}>
            <div className={style.Modal.BGDim} aria-hidden="true" />
            <div className={style.Modal.ContentContainer}>
                <Dialog.Panel className={style.Modal.DialogPanel}>
                    <div className={style.Modal.HeaderContainer}>
                        <Dialog.Title className={style.Modal.Title}>{title || "Transcript"}</Dialog.Title>
                        <button onClick={onClose} className={style.Modal.XButton}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className={style.Modal.TextArea}>
                        {transcript || "No transcript available."}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
