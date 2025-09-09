import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker'; // assumes installed
import 'react-datepicker/dist/react-datepicker.css';
import style from '../../../app/Style';
import ContributorSelector from './selectors/ContributorSelector';

export default function ContentMeta({ contentType = '', meta = {}, onChange, mode = 'new', fields = {}, statusinput= [], modeinput, eventTypeinput, registrationTypeinput, paymentTypeinput, progressStatusinput }) {
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const handleChange = (field, value) => {
    const updatedMeta = { ...meta, [field]: value };
    if ((field === 'Title' || field === 'MachineName') && fields.slug && !isSlugEdited && mode === 'new') {
      const slugSource = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      updatedMeta['Slug'] = slugSource;
    }

    if (field === 'Slug') {
      setIsSlugEdited(true);
    }

    onChange(updatedMeta);
  };

  const handleContributorsChange = (contributors) => {
    const ContributorIDs = contributors.map(c => c.id).join(',');
    const Contributors = contributors.map(c => c.name).join(',');
    onChange({ ...meta, ContributorIDs, Contributors });
  };

  const contributorsParsed = useMemo(() => {
    const ids = (meta.ContributorIDs || '').split(',').map(id => parseInt(id)).filter(Boolean);
    const names = (meta.Contributors || '').split(',');
    return ids.map((id, i) => ({ id, name: names[i]?.trim() || `Contributor ${id}` }));
  }, [meta.ContributorIDs, meta.Contributors]);

  const s = style.blogMeta;

  const renderInput = (label, field, placeholder = '', fullWidth = false) => (
    <div className={fullWidth ? 'col-span-2' : 'col-span-1'}>
      <label className={s.label}>{label}</label>
      <input
        className={s.input}
        type="text"
        value={meta[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        readOnly={field === 'Slug' && !isSlugEdited}
      />
    </div>
  );

  const renderTextarea = (label, field, placeholder = '') => (
    <div className="col-span-2">
      <label className={s.label}>{label}</label>
      <textarea
        className={s.textarea}
        value={meta[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (label, field, options = []) => {
  const defaultValue = options[0]?.value || '';

    //  if (!meta[field] && defaultValue) {
    //    handleChange(field, defaultValue);
    //  }

    return (
      <div className="col-span-1">
        <label className={s.label}>{label}</label>
        <select
          className={s.select}
          value={meta[field] || defaultValue}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderDatePicker = (label, field) => (
    <div className="col-span-1 flex flex-col">
      <label className={s.label}>{label}</label>
      <DatePicker
        selected={meta[field] ? new Date(meta[field]) : null}
        onChange={(date) => handleChange(field, date?.toISOString())}
        className={s.input}
        dateFormat="yyyy-MM-dd"
        placeholderText="YYYY-MM-DD"
      />
    </div>
  );

  // Standardized date+time picker for StartDate/EndDate (used in both Event and Project)
  const renderDateTimePicker = (label, field) => (
    <div className="col-span-1 flex flex-col">
      <label className={s.label}>{label}</label>
      <DatePicker
        selected={meta[field] ? new Date(meta[field]) : null}
        onChange={(date) => handleChange(field, date?.toISOString())}
        className={s.input}
        dateFormat="yyyy-MM-dd h:mm aa"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        placeholderText="YYYY-MM-DD HH:MM"
      />
    </div>
  );

  return (
    <div className={`${s.wrapper} grid grid-cols-2 gap-4`}>
      {fields.MachineName ? renderInput('Machine Name', 'MachineName', 'TryHackMe XYZ', true) : 
      renderInput('Title', 'Title', 'Main title of the content', true) }

      {fields.slug && renderInput(`Slug (ReadOnly)`, 'Slug', 'Title-based - AutoGen')}

      {fields.summary ? renderTextarea('Summary', 'Summary', 'Short summary or excerpt') : fields.aboutus ? <> </> :
      renderTextarea('Description', 'Description', 'Short Description or excerpt') }

       {/*meta.Summary ? fields.summary && renderTextarea('Summary', 'Summary', 'Short summary or excerpt') : fields.aboutus ? <> </> :
      renderTextarea('Description', 'Description', 'Short Description or excerpt') }
      {contentType == 'Event' && fields.summary && renderTextarea('Summary', 'Summary', 'Short summary or excerpt')*/}

      {/* Only show status select if statusinput is provided and not for Event (handled by action buttons) */}
      {fields.status && statusinput && statusinput.length > 0 && renderSelect('Status', 'Status', statusinput)}
      {fields.ProgressStatus && renderSelect('Progress Status', 'ProgressStatus', progressStatusinput )}
      {fields.image && renderInput('Cover Image URL', fields.image, 'https://domain.com/your-image.jpg')}
      {fields.mode && renderSelect('Mode', 'Mode', modeinput )}
      {fields.eventType && renderSelect('Event Type', 'EventType', eventTypeinput)}
      {fields.registrationType && renderSelect('Registration Type', 'RegistrationType', registrationTypeinput )}
      {fields.paymentType && renderSelect('Payment Type', 'PaymentType', paymentTypeinput )}
      {fields.difficulty &&
        renderSelect('Difficulty', 'Difficulty', [
          { value: 'Easy', label: 'Easy' },
          { value: 'Medium', label: 'Medium' },
          { value: 'Hard', label: 'Hard' },
          { value: 'Insane', label: 'Insane' },
        ])}
      {fields.osType && renderInput('OS Type', 'OsType', 'e.g. Linux')}
      {fields.platform && renderInput('Platform', 'Platform', 'e.g. TryHackMe, HackTheBox')}
      {fields.releaseDate && renderDatePicker('Release Date', 'ReleaseDate')}
      {fields.dateAchieved && renderDatePicker('Achievement Data', 'DateAchieved')}
      {fields.toolsUsed && renderInput('Tools Used (Comma Separated)', 'ToolsUsed', 'e.g. Nmap, BurpSuite')}
      {fields.BoxCreator && renderInput('Box Creator', 'BoxCreator', 'e.g. S0meBody3z0')}
      {fields.ip && renderInput('IP Address', 'IPAddress', 'e.g. 192.168.1.100')}
      {fields.reference && renderInput('Reference URL', 'Reference', 'https://reference.com')}
      {fields.AudioURL && renderInput('Podcast URL', 'AudioURL', 'https://podcast.com')}
      {fields.repo && renderInput('Repository URL', 'RepoURL', 'https://github.com/repo')}
      {fields.demo && renderInput('Demo URL', 'DemoURL', 'https://demo.com')}
      {fields.progress && renderSelect('Completion Level ( % )', 'ProgressPercentage', Array.from({ length: 21 }, (_, i) => { const value = i * 5; return { value: value.toString(), label: value.toString() };}) )}
      {fields.EpisodeNumber && renderInput('Episode Number', 'EpisodeNumber', '0 - *')}
      {fields.Duration && renderInput('Duration ( minutes )', 'Duration', '*')}
      {/* Standardized for both Event and Project */}
      {fields.start && renderDateTimePicker(contentType === 'Event' ? 'Event Start' : 'Project Start', 'StartDate')}
      {fields.end && renderDateTimePicker(contentType === 'Event' ? 'Event End' : 'Project End', 'EndDate')}
      {fields.location && renderInput('Location', 'Location', 'Event location or link')}
      {/* Organizer field uses ContributorSelector, but label is Organizer(s) for Event */}
      {fields.organizer && (
        <ContributorSelector
          selected={contributorsParsed}
          onChange={handleContributorsChange}
          allowAdd={true}
          label={contentType === 'Event' ? 'Organizer(s)' : 'Contributor'}
        />
      )}
      {fields.contributor && !fields.organizer && (
        <ContributorSelector
          selected={contributorsParsed}
          onChange={handleContributorsChange}
          allowAdd={true}
          label={meta.MachineName ? 'WriteUp Author' : contentType === 'Podcast' ? 'Speakers' : 'Contributor'}
        />
      )}
    </div>
  );
}
