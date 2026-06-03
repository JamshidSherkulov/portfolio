const EMPLOYER_PROFILE_FIELDS = [
  { key: 'companyName', label: 'Company name' },
  { key: 'website', label: 'Website' },
  { key: 'industry', label: 'Industry' },
  { key: 'location', label: 'Location' },
  { key: 'companySize', label: 'Company size' },
  { key: 'description', label: 'Description' },
  { key: 'logoUrl', label: 'Logo URL' },
]

function isFieldFilled(value) {
  return Boolean(value?.trim?.())
}

export function calculateEmployerProfileCompletion(profile) {
  if (!profile) {
    return {
      percentage: 0,
      missingLabels: EMPLOYER_PROFILE_FIELDS.map((field) => field.label),
      isComplete: false,
    }
  }

  const filledFields = EMPLOYER_PROFILE_FIELDS.filter((field) =>
    isFieldFilled(profile[field.key]),
  )
  const missingLabels = EMPLOYER_PROFILE_FIELDS.filter(
    (field) => !isFieldFilled(profile[field.key]),
  ).map((field) => field.label)

  const percentage = Math.round(
    (filledFields.length / EMPLOYER_PROFILE_FIELDS.length) * 100,
  )

  return {
    percentage,
    missingLabels,
    isComplete: percentage === 100,
  }
}

export function getEmployerCompanyName(profile) {
  if (profile?.companyName?.trim()) {
    return profile.companyName.trim()
  }
  return 'My Company'
}
