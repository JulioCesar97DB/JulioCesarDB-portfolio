/** File name the resume downloads as: "Julio-Cesar-Diaz-Resume.pdf". A
    recruiter's downloads folder is full of files called resume.pdf. */
export function resumeFileName(name: string): string {
  const ascii = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${ascii}-Resume.pdf`;
}
