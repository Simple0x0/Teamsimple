import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import DatePicker from 'react-datepicker';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import style from '../../../app/Style';
import TagSelector from './selectors/TagSelector';
import CategorySelector from './selectors/CategorySelector';

export default function ContentMDEditor({
  contentType = 'Content',
  mode = 'new',
  initialContent = '',
  initialTags = [],
  initialCategory = null,
  onSaveDraft,
  onPublish,
  onSchedule,
  actions = ['draft', 'publish', 'schedule'],
  onContentChange,
  onTagsChange,
  onCategoriesChange,
  onActive,

}) {
  const [value, setValue] = useState(initialContent);
  const [viewMode, setViewMode] = useState('edit');
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null); // Use Date object
  const s = style.contentMDEditor;

  useEffect(() => {
    onContentChange?.(value);
  }, [value]);

  useEffect(() => {
    onTagsChange?.(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    onCategoriesChange?.(selectedCategory);
  }, [selectedCategory]);

  const handleScheduleSubmit = () => {
    if (!scheduleDate) {
      alert("Please select a schedule date.");
      return;
    }

    onSchedule?.(value, scheduleDate.toISOString()); // You can format this as needed
    setShowScheduleModal(false);
    setScheduleDate(null);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>
          {mode === 'new' ? 'Write' : 'Edit'} {contentType}
        </h2>
        <div className={s.viewToggle}>
          {['edit', 'preview', 'live'].map((modeOption) => (
            <button
              key={modeOption}
              onClick={() => setViewMode(modeOption)}
              className={viewMode === modeOption ? s.active : s.inactive}
            >
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div data-color-mode="dark">
        <MDEditor value={value} onChange={setValue} height={500} preview={viewMode} />
      </div>

      <div className={s.controls}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <TagSelector
            selected={selectedTags}
            onChange={setSelectedTags}
            allowAdd={true}
          />
          <CategorySelector
            selected={selectedCategory}
            onChange={setSelectedCategory}
            allowAdd={true}
          />
        </div>

        <div className={s.buttons}>
          {actions.includes('draft') && (
            <button onClick={() => onSaveDraft(value)} className={s.draftBtn}>
              Save as Draft
            </button>
          )}
          {actions.includes('publish') && (
            <button onClick={() => onPublish(value)} className={s.publishBtn}>
              Publish
            </button>
          )}
          {actions.includes('schedule') && (
            <button onClick={() => setShowScheduleModal(true)} className={s.scheduleBtn}>
              Schedule
            </button>
          )}
          {actions.includes('active') && (
            <button onClick={() => onActive(true)} className={s.activeBtn}>
              Publish as Active
            </button>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <Transition appear show={showScheduleModal} as={Fragment}>
        <Dialog
          as="div"
          className={style.Modal.Dialog}
          onClose={() => {
            setShowScheduleModal(false);
            setScheduleDate(null);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter={style.Modal.Enter}
            enterFrom={style.Modal.EnterFrom}
            enterTo={style.Modal.EnterTo}
            leave={style.Modal.Leave}
            leaveFrom={style.Modal.LeaveFrom}
            leaveTo={style.Modal.LeaveTo}
          >
            <div className={style.Modal.BGDim} />
          </Transition.Child>

          <div className={style.Modal.ContentContainer}>
            <Transition.Child
              as={Fragment}
              enter={style.Modal.Enter}
              enterFrom={style.Modal.EnterScaleFrom}
              enterTo={style.Modal.EnterScaleTo}
              leave={style.Modal.Leave}
              leaveFrom={style.Modal.LeaveScaleFrom}
              leaveTo={style.Modal.LeaveScaleTo}
            >
              <Dialog.Panel className={style.Modal.SmallDialogPanel}>
                {/* Header */}
                <div className={style.Modal.HeaderContainer}>
                  <Dialog.Title className={style.Modal.Title}>
                    Select Schedule Date
                  </Dialog.Title>
                  <button
                    className={style.Modal.XButton}
                    onClick={() => {
                      setShowScheduleModal(false);
                      setScheduleDate(null);
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Info Text */}
                <p className={style.Modal.InfoText}>
                  Choose when you want this content to be published.
                </p>

                {/* Date Picker */}
                <div className="mb-4">
                  <DatePicker
                    selected={scheduleDate}
                    onChange={(date) => setScheduleDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    minDate={new Date()}
                    className={style.Modal.ReasonInput}
                    autoComplete="off"
                  />
                </div>

                {/* Action Buttons */}
                <div className={style.Modal.ButtonRow}>
                  <button
                    className={style.Modal.CancelButton}
                    onClick={() => {
                      setShowScheduleModal(false);
                      setScheduleDate(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={style.Modal.ConfirmButton}
                    onClick={handleScheduleSubmit}
                    disabled={!scheduleDate}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
