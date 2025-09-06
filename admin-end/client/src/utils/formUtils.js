export const SERVICE_OPTIONS = [
    { value: "Principal", label: "Principal" },
    { value: "Teacher", label: "Teacher" },
  ];
  
  export const GRADER_OPTIONS = {
    Principal: [
      { value: "SLPS i", label: "SLPS i" },
      { value: "SLPS ii", label: "SLPS ii" },
      { value: "SLPS iii", label: "SLPS iii" },
    ],
    Teacher: [
      { value: "SLTS 3i", label: "SLTS 3i" },
      { value: "SLTS 3ii", label: "SLTS 3ii" },
      { value: "SLTS 2ii", label: "SLTS 2ii" },
      { value: "SLTS 2i", label: "SLTS 2i" },
      { value: "SLTS 1", label: "SLTS 1" },
    ],
  };
  
  export function getAvailableGraders(service) {
    return GRADER_OPTIONS[service] || [];
  }
  