import React, { useState, useRef } from 'react';
import Card from "./components/Card"
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, TextareaAutosize } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Languages, Briefcase, GraduationCap, UserRound, CodeXml, Download, Plus, Trash } from 'lucide-react'
import html2pdf from 'html2pdf.js';

const sectionClass = "pb-6 mb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0";
const pageBreakClass = "print:break-before-page";

type FormData = {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    customFields: { [key: string]: string };
  };
  experience: {
    title: string;
    company: string;
    date: string;
    responsibilities: string[];
    customFields: { [key: string]: string };
  }[];
  skills: string[];
  education: {
    degree: string;
    school: string;
    date: string;
    customFields: { [key: string]: string };
  }[];
  aboutMe: string;
  languages: string[];
  customSections: { name: string, customFields: { [key: string]: string } }[];
};


export default function ResumeBuilder() {
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: 'RAPHAEL CARLEBACH',
      title: 'FULL-STACK DEVELOPER',
      email: 'carlebachraphael@gmail.com',
      phone: '052-5555555',
      linkedin: 'https://www.linkedin.com/in/raphael-carlebach-120492200',
      github: 'https://github.com/raphaelCarlebach',
      customFields: {}
    },
    experience: [
      {
        title: 'Full-stack web developer',
        company: 'CARLEBACH.com',
        date: 'May 2020 — Present',
        responsibilities: [
          "Led the product development team, overseeing the full lifecycle of web-based systems development, ensuring project milestones were met on time and within scope, and managing customer relationships to understand requirements and deliver tailored solutions.",
          "Led end-to-end development of web-based information systems, utilizing React for frontend and Node.js for backend, ensuring seamless functionality across all layers.",
          "Designed and optimized SQL database architecture, improving data storage, retrieval efficiency, and overall system performance.",
          "Developed, tested, and maintained scalable, reliable web applications using React, Node.js, and .NET for full-stack development.",
          "Created and documented software requirements specifications, ensuring clear communication and smooth project execution across teams.",
          "Implemented system and application design with React, Node.js, and .NET, following best practices and maintaining high-quality standards.",
          "Maintained and updated product documentation and knowledge bases to ensure accurate, up-to-date information.",
          "Built and integrated API services using Node.js and .NET, enabling smooth data exchange between systems and platforms."
        ],
        customFields: {}
      }
    ],
    skills: ['HTML', 'CSS', 'Sass', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'APIs', 'REST/NET', 'php', 'python'],
    education: [
      {
        degree: 'Diploma in Full-Stack Web Development',
        school: 'HackerU College',
        date: 'Jul 2020 — May 2021',
        customFields: {}
      }
    ],
    aboutMe: 'Experienced and committed Full-Stack Developer with a proven track record of designing and implementing scalable web applications using the latest technologies. Skilled in both front-end and back-end development, with a strong understanding of database management, cloud services, and API integration. A fast learner with a passion for creating innovative solutions and a dedication to continuous professional growth. I possess strong leadership and creative problem-solving abilities, with the skill to analyze and resolve organizational challenges. Known for being a hard-working, responsible team member who consistently strives to deliver high-quality results in fast-paced environments.',
    languages: ['English', 'Hebrew'],
    customSections: []
  });

  const resumeRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, section?: keyof FormData, index?: number) => {
    if (section && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        [section]: (prev[section] as any[]).map((item, i) =>
          i === index ? { ...item, [field]: e.target.value } : item
        )
      }));
    } else if (section === 'personalInfo') {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: e.target.value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const isCustomField = field.startsWith('customFields.');

    if (isCustomField) {
      const customFieldKey = field.split('.')[1];
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          customFields: {
            ...formData.personalInfo.customFields,
            [customFieldKey]: e.target.value,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          [field]: e.target.value,
        },
      });
    }
  };

  const handleExperienceChange = (index: number, field: string, value: string, customField: boolean = false) => {
    const newExperience = [...formData.experience];

    if (customField) {
      newExperience[index] = {
        ...newExperience[index],
        customFields: {
          ...newExperience[index].customFields,
          [field]: value,
        },
      };
    } else {
      newExperience[index] = {
        ...newExperience[index],
        [field]: value,
      };
    }

    setFormData({
      ...formData,
      experience: newExperience,
    });
  };

  const handleEducationChange = (index: number, field: string, value: string, customField: boolean = false) => {
    const newEducation = [...formData.education];

    if (customField) {
      newEducation[index] = {
        ...newEducation[index],
        customFields: {
          ...newEducation[index].customFields,
          [field]: value,
        },
      };
    } else {
      newEducation[index] = {
        ...newEducation[index],
        [field]: value,
      };
    }

    setFormData({
      ...formData,
      education: newEducation,
    });
  };

  const handleResponsibilitiesChange = (index: number, value: string) => {
    const newExperience = [...formData.experience];
    newExperience[index].responsibilities = value.split('\n');
    setFormData({ ...formData, experience: newExperience });
  };

  const handleAddCustomField = (section: keyof FormData, index?: number) => {
    const fieldName = prompt("Enter the name for the new field:");
    if (fieldName) {
      if (section === 'personalInfo') {
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            customFields: {
              ...prev.personalInfo.customFields,
              [fieldName]: ''
            }
          }
        }));
      } else if (Array.isArray(formData[section]) && typeof index === 'number') {
        setFormData(prev => ({
          ...prev,
          [section]: (prev[section] as any[]).map((item, i) =>
            i === index ? { ...item, customFields: { ...item.customFields, [fieldName]: '' } } : item
          )
        }));
      }
    }
  };

  const handleRemoveCustomField = (section: keyof FormData, fieldName: string, index?: number) => {
    if (section === 'personalInfo') {
      setFormData(prev => {
        const { [fieldName]: _, ...rest } = prev.personalInfo.customFields;
        return {
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            customFields: rest
          }
        };
      });
    } else if (Array.isArray(formData[section]) && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        [section]: (prev[section] as any[]).map((item, i) =>
          i === index ? {
            ...item,
            customFields: Object.fromEntries(
              Object.entries(item.customFields).filter(([key]) => key !== fieldName)
            )
          } : item
        )
      }));
    }
  };

  const handleAddCustomSection = () => {
    const sectionName = prompt("Enter the name for the new section:");
    if (sectionName) {
      setFormData(prev => ({
        ...prev,
        customSections: [...prev.customSections, { name: sectionName, customFields: {} }]
      }));
    }
  };

  const handleRemoveCustomSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const handleCustomSectionFieldChange = (sectionIndex: number, fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex ? { ...section, customFields: { ...section.customFields, [fieldName]: value } } : section
      )
    }));
  };

  const handleAddCustomSectionField = (sectionIndex: number) => {
    const fieldName = prompt("Enter the name for the new field:");
    if (fieldName) {
      setFormData(prev => ({
        ...prev,
        customSections: prev.customSections.map((section, i) =>
          i === sectionIndex ? { ...section, customFields: { ...section.customFields, [fieldName]: '' } } : section
        )
      }));
    }
  };

  const handleRemoveCustomSectionField = (sectionIndex: number, fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex ? { ...section, customFields: Object.fromEntries(Object.entries(section.customFields).filter(([key]) => key !== fieldName)) } : section
      )
    }));
  };

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 10,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="w-1/3" id="form">
        <h2 className="text-2xl font-bold mb-4">Resume Information</h2>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="personal-info-content"
            id="personal-info-header"
          >
            <Typography>Personal Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space-y-4">
              <div className="space-y-2">
                <TextField
                  label="Name"
                  value={formData.personalInfo.name}
                  onChange={(e) => handlePersonalInfoChange(e, 'name')}
                  fullWidth
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Title"
                  value={formData.personalInfo.title}
                  onChange={(e) => handlePersonalInfoChange(e, 'title')}
                  fullWidth
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange(e, 'email')}
                  fullWidth
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Phone"
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange(e, 'phone')}
                  fullWidth
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="LinkedIn"
                  type="url"
                  value={formData.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange(e, 'linkedin')}
                  fullWidth
                />
              </div>
              <div className="space-y-2">
                <TextField
                  label="Github"
                  type="url"
                  value={formData.personalInfo.github}
                  onChange={(e) => handlePersonalInfoChange(e, 'github')}
                  fullWidth
                />
              </div>

              {Object.entries(formData.personalInfo.customFields).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TextField
                      label={key}
                      value={value}
                      onChange={(e) => handlePersonalInfoChange(e, `customFields.${key}`)}
                      fullWidth
                    />

                    <Button variant="outlined" onClick={() => handleRemoveCustomField('personalInfo', key)}>
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}

              <Button onClick={() => handleAddCustomField('personalInfo')}>
                <Plus className="mr-2 h-4 w-4" /> Add Custom Field
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="experience-content"
            id="experience-header"
          >
            <Typography>Experience</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space-y-4">
              {formData.experience.map((job, index) => (
                <div key={index} className="space-y-2">
                  <TextField
                    label="Job Title"
                    value={job.title}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Company"
                    value={job.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Date"
                    value={job.date}
                    onChange={(e) => handleExperienceChange(index, 'date', e.target.value)}
                    fullWidth
                  />
                  <TextareaAutosize
                    minRows={4}
                    placeholder="Responsibilities (one per line)"
                    value={job.responsibilities.join('\n')}
                    onChange={(e) => handleResponsibilitiesChange(index, e.target.value)}
                    style={{ width: '100%' }}
                  />

                  {Object.entries(job.customFields).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TextField
                          label={key}
                          value={value}
                          onChange={(e) => handleExperienceChange(index, key, e.target.value, true)}
                          fullWidth
                        />

                        <Button variant="outlined" onClick={() => handleRemoveCustomField('experience', key, index)}>
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => handleAddCustomField('experience', index)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Custom Field
                  </Button>
                </div>
              ))}
              <Button variant="contained" onClick={() => setFormData({
                ...formData,
                experience: [...formData.experience, { title: '', company: '', date: '', responsibilities: [], customFields: {} }]
              })}>
                Add Experience
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="skills-content"
            id="skills-header"
          >
            <Typography>Skills</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space-y-2">
              <TextField
                label="Skills (comma-separated)"
                value={formData.skills.join(', ')}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(skill => skill.trim()) })}
                fullWidth
              />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="education-content"
            id="education-header"
          >
            <Typography>Education</Typography>
          </AccordionSummary>
          <AccordionDetails>

            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div className="space-y-4">
                  <div key={index} className="space-y-2">
                    <TextField
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="space-y-2">
                    <TextField
                      label="School"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div className="space-y-2">
                    <TextField
                      label="Date"
                      value={edu.date}
                      onChange={(e) => handleEducationChange(index, 'date', e.target.value)}
                      fullWidth
                    />
                  </div>

                  {Object.entries(edu.customFields).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TextField
                          label={key}
                          value={value}
                          onChange={(e) => handleEducationChange(index, key, e.target.value, true)}
                          fullWidth
                        />

                        <Button variant="outlined" onClick={() => handleRemoveCustomField('education', key, index)}>
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button onClick={() => handleAddCustomField('education', index)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Custom Field
                  </Button>

                </div>
              ))}


              <Button variant="contained" onClick={() => setFormData({
                ...formData,
                education: [...formData.education, { degree: '', school: '', date: '', customFields: {} }]
              })}>
                Add Education
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="about-me-content"
            id="about-me-header"
          >
            <Typography>About Me</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space-y-2">
              <TextField
                label="About Me"
                value={formData.aboutMe}
                onChange={(e) => handleInputChange(e, 'aboutMe')}
                fullWidth
                multiline
                rows={4}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="languages-content"
            id="languages-header"
          >
            <Typography>Languages</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="space-y-2">
              <TextField
                label="Languages (comma-separated)"
                value={formData.languages.join(', ')}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(',').map(lang => lang.trim()) })}
                fullWidth
              />
            </div>
          </AccordionDetails>
        </Accordion>

        {formData.customSections.map((section, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`custom-section-${index}-content`}
              id={`custom-section-${index}-header`}
            >
              <Typography>{section.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="space-y-4">
                {Object.entries(section.customFields).map(([fieldName, value]) => (
                  <div key={fieldName} className="space-y-2">
                    <Typography variant="h6">{fieldName}</Typography>
                    <div className="flex gap-2">
                      <TextField
                        label={fieldName}
                        value={value}
                        onChange={(e) => handleCustomSectionFieldChange(index, fieldName, e.target.value)}
                        fullWidth
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRemoveCustomSectionField(index, fieldName)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => handleAddCustomSectionField(index)}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Field
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleRemoveCustomSection(index)}
                  className="mt-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
          onClick={handleAddCustomSection}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Custom Section
        </Button>
      </div>


      <div className="w-2/3" id="preview">
        <Card className="p-8">
          <div ref={resumeRef} className="space-y-8">
            <header className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{formData.personalInfo.name}</h1>
                <p className="text-primary uppercase tracking-wide mt-1">{formData.personalInfo.title}</p>
              </div>
              <div className="text-sm text-black space-y-1 text-right">
                <p>{formData.personalInfo.email}</p>
                <p>{formData.personalInfo.phone}</p>
                <p>
                  <a href={formData.personalInfo.linkedin} className="text-primary hover:underline">
                    {formData.personalInfo.linkedin}
                  </a>
                </p>
                <p>
                  <a href={formData.personalInfo.github} className="text-primary hover:underline">
                    {formData.personalInfo.github}
                  </a>
                </p>

                {Object.entries(formData.personalInfo.customFields)
                  .filter(([key, value]) => typeof value === 'string' && value.trim() !== '')
                  .map(([key, value], index) => (
                    <p key={index}>{value as string}</p>
                  ))}
              </div>
            </header>

            <div className="space-y-12">
              <section className={`${sectionClass} ${pageBreakClass}`}>
                <h2 className="text-sm font-semibold uppercase mb-4 text-primary flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  EXPERIENCE
                </h2>
                <div className="space-y-12">
                  {formData.experience.map((job, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-black">{job.date}</p>
                      </div>
                      <p className="text-sm text-black mb-2">{job.company}</p>
                      <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-black">
                        {job.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                        {Object.entries(job.customFields).map(([key, value]) => (
                          <p key={key} className="text-sm text-black mt-2">
                            <strong>{key}:</strong> {value}
                          </p>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${sectionClass} ${pageBreakClass}`}>
                <h2 className="text-sm font-semibold uppercase mb-4 text-primary flex items-center gap-2">
                  <CodeXml className="w-4 h-4" />
                  SKILLS
                </h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="border border-black rounded-full px-2 py-0.5 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section className={`${sectionClass} ${pageBreakClass}`}>
                <h2 className="text-sm font-semibold uppercase mb-4 text-primary flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  EDUCATION
                </h2>
                <div>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-sm text-black">{edu.date}</p>
                      </div>
                      <p className="text-sm text-black">{edu.school}</p>

                      {Object.entries(edu.customFields).map(([key, value]) => (
                        <p key={key} className="text-sm text-black mt-2">
                          <strong>{key}:</strong> {value}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="text-sm font-semibold uppercase mb-4 text-primary flex items-center gap-2">
                  <UserRound className="w-4 h-4" />
                  ABOUT ME
                </h2>
                <p className="text-sm text-black">{formData.aboutMe}</p>
              </section>

              <section className={sectionClass}>
                <h2 className="text-sm font-semibold uppercase mb-4 text-primary flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  LANGUAGES
                </h2>
                <ul className="space-y-2 text-sm">
                  {formData.languages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              </section>

              {formData.customSections.map((section, index) => (
                <section key={index} className={sectionClass}>
                  <h2 className="text-sm font-semibold uppercase mb-4 text-primary flex items-center gap-2">
                    {section.name}
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(section.customFields).map(([fieldName, value]) => (
                      <p key={fieldName} className="text-sm text-black">
                        <strong>{fieldName}:</strong> {value}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

            </div>
          </div>
        </Card>
        <Button onClick={handleDownloadPDF} className="mt-4">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}